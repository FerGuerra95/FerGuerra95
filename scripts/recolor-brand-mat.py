"""Replace legacy flat mat #030712 with #0b1020 in bundled RGB brand PNGs."""
from __future__ import annotations

import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _load_flatten():
    p = Path(__file__).resolve().parent / "flatten-brand-on-bg.py"
    spec = importlib.util.spec_from_file_location("flatten_brand", p)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


def main() -> None:
    flat = _load_flatten()
    old = (0x03, 0x07, 0x12)
    new = (0x0B, 0x10, 0x20)
    brand = ROOT / "src" / "assets" / "brand"
    for name in ("ceos-os-emblem.png", "ceos-os-horizontal.png"):
        path = brand / name
        w, h, rgba = flat._read_png_rgba(path)
        rgb = bytearray(w * h * 3)
        o = 0
        for i in range(0, len(rgba), 4):
            r, g, b = rgba[i], rgba[i + 1], rgba[i + 2]
            if (r, g, b) == old:
                r, g, b = new
            rgb[o : o + 3] = bytes((r, g, b))
            o += 3
        tmp = path.with_suffix(path.suffix + ".tmp")
        flat._write_png_rgb(tmp, w, h, bytes(rgb))
        tmp.replace(path)
        print(f"{name}: recolored mat {old} -> {new}")


if __name__ == "__main__":
    main()
