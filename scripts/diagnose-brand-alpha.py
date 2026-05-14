#!/usr/bin/env python3
"""Report alpha anomalies in brand PNGs (holes, fringe, semi-transparent interior)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    for name in ("ceos-os-emblem.png", "ceos-os-horizontal.png"):
        path = root / "src/assets/brand" / name
        im = Image.open(path).convert("RGBA")
        w, h = im.size
        px = im.load()
        semi = holes = edge_semi = 0
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a == 0:
                    continue
                if a < 255:
                    semi += 1
                    # "interior hole" heuristic: semi surrounded by mostly opaque
                    op_n = 0
                    for dx in (-1, 0, 1):
                        for dy in (-1, 0, 1):
                            if dx == 0 and dy == 0:
                                continue
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < w and 0 <= ny < h:
                                if px[nx, ny][3] >= 250:
                                    op_n += 1
                    if op_n >= 5:
                        holes += 1
                    if op_n <= 2:
                        edge_semi += 1
        print(f"{name} {w}x{h}")
        print(f"  semi-transparent px: {semi} ({100*semi/(w*h):.2f}%)")
        print(f"  semi with mostly-opaque neighbors (pinholes): {holes}")
        print(f"  semi on sparse-opaque neighborhood (edge AA): {edge_semi}")


if __name__ == "__main__":
    main()
