#!/usr/bin/env python3
"""Build wordmark PNGs from ceos-os-horizontal-color.png.

``--title-only`` / default stacked path: legacy headline-band extraction.

``--wordmark-letters``: strip from ~43% width to the right edge, then alpha bbox; run
``scripts/rgba-unpremultiply-black-bg.py`` on the horizontal first if the master is RGB.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image


def wordmark_letters_rect(w: int, h: int) -> tuple[int, int, int, int]:
    """Wide strip to the right of the wheel; bbox pass removes vertical slack."""
    left = min(max(0, int(round(0.43 * w))), w - 4)
    top = 0
    right = max(left + 2, w - 10)
    bottom = h
    return (left, top, right, bottom)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--source",
        type=Path,
        default=Path("src/assets/brand/ceos-os-horizontal-color.png"),
        help="Source horizontal PNG (repo-relative or absolute)",
    )
    ap.add_argument(
        "--out",
        type=Path,
        default=Path("src/assets/brand/ceos-os-wordmark-color.png"),
        help="Output wordmark PNG",
    )
    ap.add_argument("--gap", type=int, default=16, help="Vertical gap between bands (px)")
    ap.add_argument(
        "--title-only",
        action="store_true",
        help="Only the headline strip (cleaner in narrow nav bars; no tagline)",
    )
    ap.add_argument(
        "--wordmark-letters",
        action="store_true",
        help="CEO's OS wordmark only (right of wheel), for nav / login",
    )
    ap.add_argument(
        "--letters-pad",
        type=int,
        default=12,
        help="Padding when trimming to alpha bbox (--wordmark-letters only)",
    )
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    src = args.source if args.source.is_absolute() else root / args.source
    out = args.out if args.out.is_absolute() else root / args.out
    if not src.is_file():
        print(f"missing source: {src}", file=sys.stderr)
        return 1

    im = Image.open(src).convert("RGBA")
    w, h = im.size

    if args.wordmark_letters:
        l, t, r, b = wordmark_letters_rect(w, h)
        sub = im.crop((l, t, r, b))
        bb = sub.getbbox()
        if not bb:
            print("wordmark letters region has no opaque pixels", file=sys.stderr)
            return 1
        pad = max(0, args.letters_pad)
        lx, ty, rx, by = bb
        lx = max(0, lx - pad)
        ty = max(0, ty - pad)
        rx = min(sub.width, rx + pad)
        by = min(sub.height, by + pad)
        canvas = sub.crop((lx, ty, rx, by))
    else:
        y_title0, y_title1 = max(6, int(0.008 * h)), int(0.13 * h)
        title = im.crop((0, y_title0, w, y_title1))
        tb = title.getbbox()
        if not tb:
            print("title band has no opaque pixels", file=sys.stderr)
            return 1
        title = title.crop(tb)

        if args.title_only:
            canvas = title
        else:
            y_sub0, y_sub1 = int(0.708 * h), int(0.868 * h)
            sub = im.crop((0, y_sub0, w, y_sub1))
            sb = sub.getbbox()
            if not sb:
                print("subtitle band has no opaque pixels", file=sys.stderr)
                return 1
            sub = sub.crop(sb)

            th = title.size[1]
            sh = sub.size[1]
            gap = max(0, args.gap)

            l_src = min(tb[0], sb[0])
            r_src = max(tb[2], sb[2])
            cw = r_src - l_src
            ch = th + gap + sh
            ox_title = tb[0] - l_src
            ox_sub = sb[0] - l_src

            canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
            canvas.paste(title, (ox_title, 0), title)
            canvas.paste(sub, (ox_sub, th + gap), sub)

    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, optimize=True)
    cw, ch = canvas.size
    print(f"wrote {out.relative_to(root) if out.is_relative_to(root) else out} ({cw}x{ch})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
