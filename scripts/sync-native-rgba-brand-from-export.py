#!/usr/bin/env python3
"""
Copy brand PNG that already has a real alpha channel into bundled assets.

Only crops to the alpha bounding box (+ padding) and optionally downscales for web.
Does NOT key/flood/neutral-remove pixels — use when the design export is already RGBA.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--source",
        type=Path,
        default=Path("public/brand/ChatGPT Image 10 may 2026, 11_31_49.png"),
        help="RGBA export (repo-relative)",
    )
    ap.add_argument("--pad", type=int, default=12, help="Padding around alpha bbox")
    ap.add_argument(
        "--max-side",
        type=int,
        default=1400,
        help="If longest edge exceeds this, scale down (LANCZOS), keeping aspect",
    )
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    src = args.source if args.source.is_absolute() else root / args.source
    if not src.is_file():
        print(f"missing source: {src}", file=sys.stderr)
        return 1

    im = Image.open(src).convert("RGBA")
    bbox = im.getbbox()
    if bbox is None:
        print("source has no opaque pixels", file=sys.stderr)
        return 1
    l, t, r, b = bbox
    pad = max(0, args.pad)
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    out = im.crop((l, t, r, b))

    w, h = out.size
    m = max(w, h)
    if args.max_side > 0 and m > args.max_side:
        scale = args.max_side / m
        nw = max(1, int(round(w * scale)))
        nh = max(1, int(round(h * scale)))
        out = out.resize((nw, nh), Image.Resampling.LANCZOS)

    brand = root / "src" / "assets" / "brand"
    targets = [
        "ceos-os-horizontal-color.png",
        "ceos-os-horizontal.png",
        "ceos-os-landing-hero.png",
        "ceos-os-nombre-logo-dorado.png",
    ]
    for name in targets:
        p = brand / name
        out.save(p, optimize=True)
        print(f"wrote {p.relative_to(root)}  RGBA {out.size}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
