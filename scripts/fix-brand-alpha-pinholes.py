#!/usr/bin/env python3
"""
Fix broken binary alpha in brand PNGs: accidental 1px transparent holes inside strokes
(letters, lion ring, icons) without flooding the outer background.

Uses a high 8-neighbor opaque count (default 6) so only near-enclosed gaps close. Optional
`--reach` mode: only touch transparent pixels not connected to the image edge (stricter).
"""
from __future__ import annotations

import argparse
import sys
from collections import deque
from pathlib import Path

from PIL import Image


def mark_exterior_transparent(px, w: int, h: int) -> list[list[bool]]:
    """Transparent pixels connected to any image border (true background)."""
    ext = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_add(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and px[x, y][3] == 0 and not ext[y][x]:
            ext[y][x] = True
            q.append((x, y))

    for x in range(w):
        try_add(x, 0)
        try_add(x, h - 1)
    for y in range(h):
        try_add(0, y)
        try_add(w - 1, y)

    while q:
        x, y = q.popleft()
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nx, ny = x + dx, y + dy
            try_add(nx, ny)
    return ext


def fill_pinholes(
    px,
    w: int,
    h: int,
    *,
    min_opaque_neighbors: int,
    max_passes: int,
    exterior: list[list[bool]] | None,
) -> int:
    filled = 0
    for _ in range(max_passes):
        batch: list[tuple[int, int, int, int, int]] = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                r, g, b, a = px[x, y]
                if a >= 128:
                    continue
                if exterior is not None and exterior[y][x]:
                    continue
                rs = gs = bs = n = 0
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        if dx == 0 and dy == 0:
                            continue
                        rr, gg, bb, aa = px[x + dx, y + dy]
                        if aa < 250:
                            continue
                        n += 1
                        rs += rr
                        gs += gg
                        bs += bb
                if n >= min_opaque_neighbors:
                    batch.append((x, y, rs // n, gs // n, bs // n))
        if not batch:
            break
        for x, y, r, g, b in batch:
            px[x, y] = (r, g, b, 255)
            filled += 1
            if exterior is not None:
                exterior[y][x] = False
    return filled


def soften_chromatic_edges(
    px,
    w: int,
    h: int,
    *,
    bg_rgb: tuple[int, int, int],
    mix: float,
    min_chroma: int,
) -> int:
    """
    Binary-alpha PNGs often have a hard pixel stair on dark UIs. Nudge *chromatic* boundary
    pixels slightly toward page bg (#030712) so the lion ring / gold type sit softer.
    """
    br, bg, bb = bg_rgb

    def touches_trans(x: int, y: int) -> bool:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                    return True
        return False

    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 250:
                continue
            if not touches_trans(x, y):
                continue
            if max(r, g, b) - min(r, g, b) < min_chroma:
                continue
            r2 = int(r * (1 - mix) + br * mix)
            g2 = int(g * (1 - mix) + bg * mix)
            b2 = int(b * (1 - mix) + bb * mix)
            px[x, y] = (r2, g2, b2, a)
            changed += 1
    return changed


def defringe_dark_neutral(
    px,
    w: int,
    h: int,
    *,
    neutral_spread: int,
    dark_max: int,
    max_passes: int,
) -> int:
    def touches_trans(x: int, y: int) -> bool:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                    return True
        return False

    cleared = 0
    for _ in range(max_passes):
        to_clear: list[tuple[int, int]] = []
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a < 250:
                    continue
                if not touches_trans(x, y):
                    continue
                mx, mn = max(r, g, b), min(r, g, b)
                if mx - mn > neutral_spread:
                    continue
                if mx > dark_max:
                    continue
                to_clear.append((x, y))
        if not to_clear:
            break
        for x, y in to_clear:
            px[x, y] = (0, 0, 0, 0)
            cleared += 1
    return cleared


def process(
    path: Path,
    *,
    neighbors: int,
    max_passes: int,
    reach: bool,
    defringe: bool,
    soften: bool,
) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    ext = mark_exterior_transparent(px, w, h) if reach else None
    n = fill_pinholes(
        px,
        w,
        h,
        min_opaque_neighbors=neighbors,
        max_passes=max_passes,
        exterior=ext,
    )
    d = 0
    if defringe:
        d = defringe_dark_neutral(
            px, w, h, neutral_spread=20, dark_max=44, max_passes=48
        )
    s = 0
    if soften:
        s = soften_chromatic_edges(
            px,
            w,
            h,
            bg_rgb=(3, 7, 18),
            mix=0.10,
            min_chroma=18,
        )
    tmp = path.with_name(path.stem + ".__alpha__.png")
    try:
        im.save(tmp, optimize=True)
        tmp.replace(path)
    finally:
        if tmp.exists():
            tmp.unlink(missing_ok=True)
    print(
        f"{path.name}: pinholes_filled={n} defringe={d} "
        f"edge_soft={s} reach={reach}"
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "paths",
        nargs="*",
        default=[
            "src/assets/brand/ceos-os-emblem.png",
            "src/assets/brand/ceos-os-horizontal.png",
        ],
    )
    ap.add_argument(
        "--neighbors",
        type=int,
        default=5,
        help="Opaque 8-neighbors required (5=letters/ring gaps; 6=minimal; 4=risky)",
    )
    ap.add_argument(
        "--max-passes",
        type=int,
        default=24,
        help="Cap iterations (low value + neighbors=4 avoids flooding)",
    )
    ap.add_argument(
        "--reach",
        action="store_true",
        help="Ignore transparent pixels connected to image border (extra safety)",
    )
    ap.add_argument(
        "--defringe",
        action="store_true",
        help="Remove dark neutral matte on outer edge",
    )
    ap.add_argument(
        "--no-edge-soften",
        action="store_true",
        help="Skip 10% RGB blend of chromatic edge pixels toward #030712",
    )
    args = ap.parse_args()
    root = Path(__file__).resolve().parents[1]
    for rel in args.paths:
        p = Path(rel)
        if not p.is_absolute():
            p = root / p
        if not p.is_file():
            print(f"missing: {p}", file=sys.stderr)
            continue
        process(
            p,
            neighbors=args.neighbors,
            max_passes=args.max_passes,
            reach=args.reach,
            defringe=args.defringe,
            soften=not args.no_edge_soften,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
