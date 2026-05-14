#!/usr/bin/env python3
"""Prepare brand PNGs for dark UIs: near-black → transparent, light neutral → transparent.

Handles RGB exports (no alpha) and fake \"transparency\" checkerboards baked into RGB.
"""
from __future__ import annotations

import argparse
import sys
from collections import deque
from pathlib import Path

from PIL import Image


def black_to_alpha(im: Image.Image, thresh: int) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    t = max(0, min(80, thresh))
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if r <= t and g <= t and b <= t:
                px[x, y] = (0, 0, 0, 0)
    return im


def light_neutral_to_alpha(
    im: Image.Image, *, chroma_max: int, lum_min: int, lum_max: int
) -> Image.Image:
    """Remove light grey / white flat backgrounds (e.g. baked checkerboard)."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            spread = max(r, g, b) - min(r, g, b)
            lum = (r + g + b) / 3
            if spread <= chroma_max and lum_min <= lum <= lum_max:
                px[x, y] = (0, 0, 0, 0)
    return im


def flood_edge_background(im: Image.Image, tol: int) -> Image.Image:
    """Flood from image edges: transparent if connected to edge and similar to a corner colour."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size

    def dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
        return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])

    corners = [
        px[0, 0][:3],
        px[w - 1, 0][:3],
        px[0, h - 1][:3],
        px[w - 1, h - 1][:3],
    ]
    refs: list[tuple[int, int, int]] = []
    for c in corners:
        if not any(dist(c, r) <= tol for r in refs):
            refs.append(c)

    def is_bg(rgb: tuple[int, int, int]) -> bool:
        return min(dist(rgb, r) for r in refs) <= tol * 3

    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= w or y >= h:
            return
        i = y * w + x
        if seen[i]:
            return
        seen[i] = 1
        if is_bg(px[x, y][:3]):
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _a = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            i = ny * w + nx
            if seen[i]:
                continue
            seen[i] = 1
            if is_bg(px[nx, ny][:3]):
                q.append((nx, ny))

    return im


def process(
    im: Image.Image,
    *,
    black_thresh: int,
    neutral: bool,
    flood: bool,
    chroma: int,
    lum_lo: int,
    lum_hi: int,
    flood_tol: int,
) -> Image.Image:
    out = black_to_alpha(im, black_thresh)
    if neutral:
        out = light_neutral_to_alpha(
            out, chroma_max=chroma, lum_min=lum_lo, lum_max=lum_hi
        )
    if flood:
        out = flood_edge_background(out, flood_tol)
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("path", type=Path, help="PNG path (repo-relative or absolute)")
    ap.add_argument("--thresh", type=int, default=24, help="Near-black → transparent (0–80)")
    ap.add_argument(
        "--neutral",
        action="store_true",
        help="Also remove light flat neutrals (checkerboard-style)",
    )
    ap.add_argument("--chroma", type=int, default=26, help="Max RGB spread for neutral removal")
    ap.add_argument("--lum-min", type=int, default=158)
    ap.add_argument("--lum-max", type=int, default=275)
    ap.add_argument(
        "--flood-edge",
        action="store_true",
        help="Flood-clear edge-connected pixels similar to corners",
    )
    ap.add_argument("--flood-tol", type=int, default=42)
    ap.add_argument("--in-place", action="store_true")
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    p = args.path if args.path.is_absolute() else root / args.path
    if not p.is_file():
        print(f"missing: {p}", file=sys.stderr)
        return 1

    im = Image.open(p)
    out = process(
        im,
        black_thresh=args.thresh,
        neutral=args.neutral,
        flood=args.flood_edge,
        chroma=args.chroma,
        lum_lo=args.lum_min,
        lum_hi=args.lum_max,
        flood_tol=args.flood_tol,
    )

    if args.in_place:
        tmp = p.with_name(p.stem + ".__rgba__.png")
        out.save(tmp, optimize=True)
        tmp.replace(p)
        target = p
    else:
        target = p.with_name(p.stem + "-rgba.png")
        out.save(target, optimize=True)

    bb = out.getbbox()
    print(
        f"wrote {target.relative_to(root) if target.is_relative_to(root) else target} "
        f"RGBA {out.size} bbox={bb}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
