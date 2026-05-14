#!/usr/bin/env python3
"""
Optional cleanup: only dark *neutral* pixels on the outer rim (touching transparency).

Does NOT strip light beige/gold anti-alias — doing that visibly damages the logo (jagged /
flat edges). For halos on dark UI, fix the source export or use `crop-brand-png-to-alpha-bbox.py`
only.

Large PNGs: tens of seconds per file worst-case.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image


def _alpha_flat(px, w: int, h: int) -> bytearray:
    a = bytearray(w * h)
    i = 0
    for y in range(h):
        for x in range(w):
            a[i] = px[x, y][3]
            i += 1
    return a


def _touches_zero(alpha: bytearray, w: int, h: int, x: int, y: int) -> bool:
    o = y * w + x
    if x > 0 and alpha[o - 1] == 0:
        return True
    if x + 1 < w and alpha[o + 1] == 0:
        return True
    if y > 0 and alpha[o - w] == 0:
        return True
    if y + 1 < h and alpha[o + w] == 0:
        return True
    if x > 0 and y > 0 and alpha[o - w - 1] == 0:
        return True
    if x + 1 < w and y > 0 and alpha[o - w + 1] == 0:
        return True
    if x > 0 and y + 1 < h and alpha[o + w - 1] == 0:
        return True
    if x + 1 < w and y + 1 < h and alpha[o + w + 1] == 0:
        return True
    return False


def _is_neutral(r: int, g: int, b: int, spread_max: int) -> bool:
    return max(r, g, b) - min(r, g, b) <= spread_max


def strip_edge_matte_pass(
    px,
    w: int,
    h: int,
    *,
    neutral_spread: int,
    dark_cutoff: int,
    max_passes: int,
) -> int:
    cleared = 0
    for _ in range(max_passes):
        alpha = _alpha_flat(px, w, h)
        batch: list[tuple[int, int]] = []
        for y in range(h):
            row = y * w
            for x in range(w):
                o = row + x
                if alpha[o] == 0:
                    continue
                if not _touches_zero(alpha, w, h, x, y):
                    continue
                r, g, b, _a = px[x, y]
                if not _is_neutral(r, g, b, neutral_spread):
                    continue
                if max(r, g, b) > dark_cutoff:
                    continue
                batch.append((x, y))
        if not batch:
            break
        for x, y in batch:
            px[x, y] = (0, 0, 0, 0)
        cleared += len(batch)
    return cleared


def strip_soft_gray_edge_pass(
    px,
    w: int,
    h: int,
    *,
    neutral_spread: int,
    dark_cutoff: int,
    max_alpha: int,
) -> int:
    alpha = _alpha_flat(px, w, h)
    cleared = 0
    for y in range(h):
        for x in range(w):
            o = y * w + x
            if alpha[o] == 0 or alpha[o] > max_alpha:
                continue
            if not _touches_zero(alpha, w, h, x, y):
                continue
            r, g, b, _a = px[x, y]
            if not _is_neutral(r, g, b, neutral_spread):
                continue
            if max(r, g, b) > dark_cutoff:
                continue
            px[x, y] = (0, 0, 0, 0)
            cleared += 1
    return cleared


def process_png(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()

    n1 = strip_edge_matte_pass(
        px, w, h, neutral_spread=22, dark_cutoff=52, max_passes=96
    )
    n2 = strip_soft_gray_edge_pass(
        px, w, h, neutral_spread=26, dark_cutoff=78, max_alpha=245
    )
    n3 = strip_edge_matte_pass(
        px, w, h, neutral_spread=18, dark_cutoff=40, max_passes=32
    )

    tmp = path.with_name(path.stem + ".__matte__.png")
    try:
        im.save(tmp, optimize=True)
        tmp.replace(path)
    finally:
        if tmp.exists():
            tmp.unlink(missing_ok=True)
    print(f"{path.name}: edge_matte={n1} soft_edge={n2} tidy={n3}")


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
    args = ap.parse_args()
    root = Path(__file__).resolve().parents[1]
    for rel in args.paths:
        p = Path(rel)
        if not p.is_absolute():
            p = root / p
        if not p.is_file():
            print(f"missing: {p}", file=sys.stderr)
            continue
        process_png(p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
