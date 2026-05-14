#!/usr/bin/env python3
"""Crop RGBA brand PNGs to the bounding box of non-transparent pixels (+ padding)."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image


def crop_to_alpha_bbox(path: Path, pad: int) -> tuple[int, int]:
    im = Image.open(path).convert("RGBA")
    bbox = im.getbbox()
    if bbox is None:
        raise ValueError(f"No opaque pixels: {path}")
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    out = im.crop((l, t, r, b))
    tmp = path.with_name(path.stem + ".__crop__.png")
    try:
        out.save(tmp, optimize=True)
        tmp.replace(path)
    finally:
        if tmp.exists():
            tmp.unlink(missing_ok=True)
    return out.size


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "paths",
        nargs="*",
        default=[
            "src/assets/brand/ceos-os-emblem.png",
            "src/assets/brand/ceos-os-horizontal.png",
        ],
        help="PNG paths relative to repo root",
    )
    ap.add_argument("--pad", type=int, default=10, help="Padding around alpha bbox")
    args = ap.parse_args()
    root = Path(__file__).resolve().parents[1]
    for rel in args.paths:
        p = Path(rel)
        if not p.is_absolute():
            p = root / p
        if not p.is_file():
            print(f"skip missing: {p}", file=sys.stderr)
            continue
        w, h = crop_to_alpha_bbox(p, args.pad)
        print(f"{p.name}: -> {w}x{h}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
