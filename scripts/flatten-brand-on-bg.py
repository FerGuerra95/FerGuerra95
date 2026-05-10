"""
Composite CEO's OS brand PNGs onto the marketing/login dark base (#030712) and
emit RGB-only PNGs (no alpha). Removes browser-visible checkerboard from broken
alpha / transparency grids. Tight-crops to original non-transparent bbox + pad.
"""
from __future__ import annotations

import struct
import zlib
from pathlib import Path

# Matches landing shell: linear-gradient(180deg, #030712 0%, ...)
BG_R, BG_G, BG_B = 0x03, 0x07, 0x12
PAD = 2


def _read_png_rgba(path: Path) -> tuple[int, int, bytes]:
    b = path.read_bytes()
    if b[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    pos = 8
    idat = bytearray()
    w = h = bd = ct = None
    while pos < len(b):
        ln = int.from_bytes(b[pos : pos + 4], "big")
        typ = b[pos + 4 : pos + 8]
        chunk = b[pos + 8 : pos + 8 + ln]
        pos += 12 + ln
        if typ == b"IHDR":
            w, h, bd, ct, *_ = struct.unpack(">IIBBBBB", chunk)
        elif typ == b"IDAT":
            idat.extend(chunk)
        elif typ == b"IEND":
            break
    if bd != 8 or ct not in (2, 6):
        raise ValueError(f"need RGB8 or RGBA8, got ct={ct}")
    raw = zlib.decompress(idat)
    bpp = 4 if ct == 6 else 3
    stride = w * bpp
    pix = bytearray(h * stride)
    i = o = 0
    prev = bytearray(stride)

    def paeth(a: int, b: int, c: int) -> int:
        p = a + b - c
        pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
        if pa <= pb and pa <= pc:
            return a
        if pb <= pc:
            return b
        return c

    for y in range(h):
        f = raw[i]
        i += 1
        row = bytearray(raw[i : i + stride])
        i += stride
        if f == 1:
            for x in range(stride):
                left = row[x - bpp] if x >= bpp else 0
                row[x] = (row[x] + left) & 255
        elif f == 2:
            for x in range(stride):
                row[x] = (row[x] + prev[x]) & 255
        elif f == 3:
            for x in range(stride):
                left = row[x - bpp] if x >= bpp else 0
                row[x] = (row[x] + ((left + prev[x]) >> 1)) & 255
        elif f == 4:
            for x in range(stride):
                a = row[x - bpp] if x >= bpp else 0
                b_ = prev[x]
                c = prev[x - bpp] if x >= bpp else 0
                row[x] = (row[x] + paeth(a, b_, c)) & 255
        elif f != 0:
            raise ValueError(f"filter {f}")
        pix[o : o + stride] = row
        prev = row
        o += stride

    if ct == 2:
        rgba = bytearray(w * h * 4)
        for y in range(h):
            for x in range(w):
                si = (y * w + x) * 3
                di = (y * w + x) * 4
                rgba[di : di + 3] = pix[si : si + 3]
                rgba[di + 3] = 255
        return w, h, bytes(rgba)

    return w, h, bytes(pix)


def _write_png_rgb(path: Path, width: int, height: int, rgb: bytes) -> None:
    def chunk(tag: bytes, payload: bytes) -> bytes:
        crc = zlib.crc32(tag + payload) & 0xFFFFFFFF
        return struct.pack(">I", len(payload)) + tag + payload + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    raw = bytearray()
    stride = width * 3
    for y in range(height):
        raw.append(0)
        raw.extend(rgb[y * stride : (y + 1) * stride])
    compressed = zlib.compress(bytes(raw), level=9)
    out = bytearray(b"\x89PNG\r\n\x1a\n")
    out.extend(chunk(b"IHDR", ihdr))
    out.extend(chunk(b"IDAT", compressed))
    out.extend(chunk(b"IEND", b""))
    path.write_bytes(out)


def flatten_crop_write(path: Path) -> tuple[int, int]:
    w, h, rgba_b = _read_png_rgba(path)
    rgba = rgba_b
    min_x, min_y = w, h
    max_x, max_y = -1, -1
    flat = bytearray(w * h * 3)

    for y in range(h):
        for x in range(w):
            i = (y * w + x) * 4
            r, g, b, a = rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]
            if a > 8:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
            if a == 255:
                pr, pg, pb = r, g, b
            elif a == 0:
                pr, pg, pb = BG_R, BG_G, BG_B
            else:
                pr = (r * a + BG_R * (255 - a)) // 255
                pg = (g * a + BG_G * (255 - a)) // 255
                pb = (b * a + BG_B * (255 - a)) // 255
            j = (y * w + x) * 3
            flat[j : j + 3] = bytes((pr, pg, pb))

    if max_x < 0:
        raise ValueError(f"no visible pixels in {path.name}")

    min_x = max(0, min_x - PAD)
    min_y = max(0, min_y - PAD)
    max_x = min(w - 1, max_x + PAD)
    max_y = min(h - 1, max_y + PAD)
    cw = max_x - min_x + 1
    ch = max_y - min_y + 1
    crop = bytearray(cw * ch * 3)
    for y in range(ch):
        sy = min_y + y
        for x in range(cw):
            sx = min_x + x
            j = (sy * w + sx) * 3
            di = (y * cw + x) * 3
            crop[di : di + 3] = flat[j : j + 3]

    _write_png_rgb(path, cw, ch, bytes(crop))
    return cw, ch


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    brand = root / "public" / "brand"
    for name in ("ceos-os-emblem.png", "ceos-os-horizontal.png"):
        p = brand / name
        cw, ch = flatten_crop_write(p)
        b = p.read_bytes()
        ct = b[b.find(b"IHDR") + 4 + 9]
        print(f"{name}: -> {cw}x{ch} RGB color_type={ct} (2=RGB)")


if __name__ == "__main__":
    main()
