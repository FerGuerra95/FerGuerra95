"""
Remove baked-in checkerboard / neutral-gray fringe next to real transparency.

Pixels are cleared (RGBA 0,0,0,0) only if they are opaque neutral grays typical of
Photoshop-style checker previews AND they touch transparency (4-neighbor), repeated
until stable — avoids eating interior metallic/chrome grays that never border alpha=0.
"""
from __future__ import annotations

import struct
import zlib
from pathlib import Path


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
    if ct not in (2, 6) or bd != 8:
        raise ValueError(f"expected RGB8 or RGBA8, got ct={ct} bd={bd}")
    raw = zlib.decompress(idat)
    bpp = 4 if ct == 6 else 3
    stride = w * bpp
    out = bytearray(h * stride)
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
        out[o : o + stride] = row
        prev = row
        o += stride

    if ct == 2:
        rgba = bytearray(w * h * 4)
        for y in range(h):
            for x in range(w):
                si = (y * w + x) * 3
                di = (y * w + x) * 4
                rgba[di : di + 3] = out[si : si + 3]
                rgba[di + 3] = 255
        return w, h, bytes(rgba)
    return w, h, bytes(out)


def _write_png_rgba(path: Path, width: int, height: int, rgba: bytes) -> None:
    def chunk(tag: bytes, payload: bytes) -> bytes:
        crc = zlib.crc32(tag + payload) & 0xFFFFFFFF
        return struct.pack(">I", len(payload)) + tag + payload + struct.pack(">I", crc)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)
        raw.extend(rgba[y * stride : (y + 1) * stride])
    compressed = zlib.compress(bytes(raw), level=9)
    out = bytearray(b"\x89PNG\r\n\x1a\n")
    out.extend(chunk(b"IHDR", ihdr))
    out.extend(chunk(b"IDAT", compressed))
    out.extend(chunk(b"IEND", b""))
    path.write_bytes(out)


def _is_checker_neutral(r: int, g: int, b: int, a: int) -> bool:
    if a < 250:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    if mx - mn > 22:
        return False
    avg = (r + g + b) // 3
    # PS-style checker grays (was 148 min — missed 143–147 and caused visible grid)
    return 120 <= avg <= 228


def _touches_transparent_8(w: int, h: int, rgba: bytearray, x: int, y: int) -> bool:
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            if dx == 0 and dy == 0:
                continue
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                return True
            j = (ny * w + nx) * 4
            if rgba[j + 3] == 0:
                return True
    return False


def strip_fringe(w: int, h: int, rgba: bytearray) -> int:
    """Expand transparency into checker-like pixels touching alpha=0 (8-neighbor). Returns pixels cleared."""
    cleared = 0
    while True:
        to_clear: list[tuple[int, int]] = []
        for y in range(h):
            for x in range(w):
                i = (y * w + x) * 4
                r, g, b, a = rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]
                if a == 0:
                    continue
                if not _is_checker_neutral(r, g, b, a):
                    continue
                if _touches_transparent_8(w, h, rgba, x, y):
                    to_clear.append((x, y))
        if not to_clear:
            break
        for x, y in to_clear:
            i = (y * w + x) * 4
            rgba[i : i + 4] = b"\0\0\0\0"
            cleared += 1
    return cleared


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    brand = root / "public" / "brand"
    for name in ("ceos-os-emblem.png", "ceos-os-horizontal.png"):
        path = brand / name
        w, h, rgba_b = _read_png_rgba(path)
        rgba = bytearray(rgba_b)
        n = strip_fringe(w, h, rgba)
        _write_png_rgba(path, w, h, bytes(rgba))
        print(f"{name}: cleared {n} fringe pixels")


if __name__ == "__main__":
    main()
