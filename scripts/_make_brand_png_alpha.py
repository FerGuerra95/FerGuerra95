"""One-off: convert CEO's OS brand PNGs to true RGBA (PNG color type 6).
Removes light neutral checkerboard / white margins without Pillow dependency on repo."""
from __future__ import annotations

import struct
import zlib
from pathlib import Path


def _read_png(path: Path) -> tuple[int, int, int, bytes]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    pos = 8
    width = height = bit_depth = color_type = None
    idat = bytearray()
    while pos < len(data):
        length = struct.unpack(">I", data[pos : pos + 4])[0]
        ctype = data[pos + 4 : pos + 8]
        chunk = data[pos + 8 : pos + 8 + length]
        pos += 12 + length
        if ctype == b"IHDR":
            width, height, bit_depth, color_type, *_ = struct.unpack(">IIBBBBB", chunk)
        elif ctype == b"IDAT":
            idat.extend(chunk)
        elif ctype == b"IEND":
            break
    if color_type != 2 or bit_depth != 8:
        raise ValueError(f"expected RGB8, got color_type={color_type} bit_depth={bit_depth}")
    raw = zlib.decompress(idat)
    bpp = 3
    stride = width * bpp
    out = bytearray(height * stride)
    i = 0
    o = 0
    prev = bytearray(stride)
    for y in range(height):
        f = raw[i]
        i += 1
        row = bytearray(raw[i : i + stride])
        i += stride
        if f == 0:
            pass
        elif f == 1:  # Sub
            for x in range(stride):
                left = row[x - bpp] if x >= bpp else 0
                row[x] = (row[x] + left) & 0xFF
        elif f == 2:  # Up
            for x in range(stride):
                row[x] = (row[x] + prev[x]) & 0xFF
        elif f == 3:  # Average
            for x in range(stride):
                left = row[x - bpp] if x >= bpp else 0
                up = prev[x]
                row[x] = (row[x] + ((left + up) >> 1)) & 0xFF
        elif f == 4:  # Paeth
            def paeth(a: int, b: int, c: int) -> int:
                p = a + b - c
                pa = abs(p - a)
                pb = abs(p - b)
                pc = abs(p - c)
                if pa <= pb and pa <= pc:
                    return a
                if pb <= pc:
                    return b
                return c

            for x in range(stride):
                a = row[x - bpp] if x >= bpp else 0
                b = prev[x]
                c = prev[x - bpp] if x >= bpp else 0
                row[x] = (row[x] + paeth(a, b, c)) & 0xFF
        else:
            raise ValueError(f"unsupported filter {f}")
        out[o : o + stride] = row
        prev = row
        o += stride
    return width, height, color_type, bytes(out)


def _is_light_neutral_background(r: int, g: int, b: int) -> bool:
    """Treat light, low-saturation pixels as fake checker / white margin."""
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 175:
        return False
    sat = mx - mn
    # Allow slightly tinted light grays; drop saturated (logo) pixels.
    return sat <= 38


def rgba_from_rgb(
    width: int,
    height: int,
    rgb: bytes,
    *,
    neutral_fn,
) -> bytes:
    bpp = 4
    stride = width * bpp
    out = bytearray(height * stride)
    s3 = width * 3
    for y in range(height):
        src_row = rgb[y * s3 : (y + 1) * s3]
        dst_o = y * stride
        for x in range(width):
            r, g, b = src_row[x * 3 : x * 3 + 3]
            if neutral_fn(r, g, b):
                out[dst_o + x * 4 : dst_o + x * 4 + 4] = b"\0\0\0\0"
            else:
                out[dst_o + x * 4 : dst_o + x * 4 + 4] = bytes((r, g, b, 255))
    return bytes(out)


def _write_png_rgba(path: Path, width: int, height: int, rgba: bytes) -> None:
    def chunk(tag: bytes, payload: bytes) -> bytes:
        return struct.pack(">I", len(payload)) + tag + payload + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)  # None filter
        raw.extend(rgba[y * stride : (y + 1) * stride])
    compressed = zlib.compress(bytes(raw), level=9)
    out = bytearray()
    out.extend(b"\x89PNG\r\n\x1a\n")
    out.extend(chunk(b"IHDR", ihdr))
    out.extend(chunk(b"IDAT", compressed))
    out.extend(chunk(b"IEND", b""))
    path.write_bytes(out)


def process_file(path: Path) -> None:
    w, h, ct, rgb = _read_png(path)
    rgba = rgba_from_rgb(w, h, rgb, neutral_fn=_is_light_neutral_background)
    _write_png_rgba(path, w, h, rgba)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    for name in ("ceos-os-emblem.png", "ceos-os-horizontal.png"):
        p = root / "public" / "brand" / name
        process_file(p)
        b = p.read_bytes()
        # IHDR at byte 12: length 13, then 'IHDR', payload starts 16+4=20? Standard: after signature, first chunk at 8.
        # layout: 4 len, 4 type, data, 4 crc
        ihdr_start = b.find(b"IHDR")
        if ihdr_start < 0:
            raise SystemExit("IHDR not found")
        payload_start = ihdr_start + 4
        ct = b[payload_start + 9]
        w = struct.unpack(">I", b[payload_start : payload_start + 4])[0]
        h = struct.unpack(">I", b[payload_start + 4 : payload_start + 8])[0]
        print(f"{name}: {w}x{h} color_type={ct} (expect 6)")


if __name__ == "__main__":
    main()
