#!/usr/bin/env python3
"""
Build two landing brand PNGs from exports in public/brand/:
  - Letters (nav): wide wordmark crop
  - Letters + lion (hero): full mark

“Quita fondo” automático suele dejar mate **blanco**: bordes con RGB alto y alfa < 255 se ven
lavados / borrosos sobre #030712. Aquí:
  - Recuperamos RGB en alfa parcial asumiendo composición sobre blanco (anti-mate).
  - Defringe tonal hacia el fondo oscuro del landing para cerrar halos residuales.
  - Afilado **antes** del downscale + LANCZOS en dos pasos + afilado suave final.
"""
from __future__ import annotations

import math
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "brand"
OUT = ROOT / "src" / "assets" / "brand"

LETTERS_SRC = PUBLIC / "ChatGPT Image 12 may 2026, 17_46_29.png"
LION_SRC = PUBLIC / "ChatGPT Image 12 may 2026, 17_33_59.png"

# Fondo hero aproximado (landing-hero) — alinear borde del logo con lo que ve el usuario
HERO_BG = (3, 7, 18)


def crop_alpha_bbox(im: Image.Image, pad: int) -> Image.Image:
    im = im.convert("RGBA")
    bb = im.getbbox()
    if bb is None:
        raise ValueError("empty alpha")
    l, t, r, b = bb
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def limit_longest_edge(im: Image.Image, max_side: int) -> Image.Image:
    if max_side <= 0:
        return im
    w, h = im.size
    m = max(w, h)
    if m <= max_side:
        return im
    scale = max_side / m
    nw = max(1, int(round(w * scale)))
    nh = max(1, int(round(h * scale)))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def resize_longest_two_step(im: Image.Image, max_side: int) -> Image.Image:
    """Downscale pesado en dos pasos para conservar bordes finos (metal, texto)."""
    w, h = im.size
    m = max(w, h)
    if m <= max_side:
        return im
    ratio = max_side / m
    if ratio >= 0.72:
        return limit_longest_edge(im, max_side)
    mid = max(max_side + 1, int(round(m * math.sqrt(ratio))))
    return limit_longest_edge(limit_longest_edge(im, mid), max_side)


def sharpen_mild(im: Image.Image) -> Image.Image:
    return im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=102, threshold=3))


def sharpen_pre_downscale(im: Image.Image) -> Image.Image:
    """Un poco más fuerte en píxeles nativos antes de reducir."""
    return im.filter(ImageFilter.UnsharpMask(radius=1.15, percent=118, threshold=2))


def recover_rgb_from_white_matte(im: Image.Image) -> Image.Image:
    """
    Asume bordes semitransparentes mezclados con blanco (255).
    F = (C - 255 + A) * 255 / A por canal (straight alpha sobre fondo blanco).
    """
    out = im.convert("RGBA").copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a <= 0 or a >= 255:
                continue
            nr = int(round((r - 255 + a) * 255.0 / max(a, 1)))
            ng = int(round((g - 255 + a) * 255.0 / max(a, 1)))
            nb = int(round((b - 255 + a) * 255.0 / max(a, 1)))
            px[x, y] = (
                max(0, min(255, nr)),
                max(0, min(255, ng)),
                max(0, min(255, nb)),
                a,
            )
    return out


def tonal_defringe_for_dark_bg(im: Image.Image, bg: tuple[int, int, int]) -> Image.Image:
    """
    Invierte la mezcla straight-alpha sobre `bg` en píxeles semitransparentes claros,
    para recuperar un frente opaco más coherente sobre UI oscura.
    """
    br, bgo, bb = bg
    out = im.convert("RGBA").copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or a >= 252:
                continue
            lum = (r + g + b) / 3
            mn = min(r, g, b)
            if lum < 198 or mn < 150:
                continue
            ta = a / 255.0
            if ta < 0.035:
                px[x, y] = (0, 0, 0, 0)
                continue
            cr = int(round((r - br * (1.0 - ta)) / ta))
            cg = int(round((g - bgo * (1.0 - ta)) / ta))
            cb = int(round((b - bb * (1.0 - ta)) / ta))
            px[x, y] = (
                max(0, min(255, cr)),
                max(0, min(255, cg)),
                max(0, min(255, cb)),
                a,
            )
    return out


def dematte_pale_semitransparent(im: Image.Image) -> Image.Image:
    """Restos de checker / mate casi blanco tras las correcciones anteriores."""
    out = im.convert("RGBA").copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or a >= 253:
                continue
            mn, mx = min(r, g, b), max(r, g, b)
            if mn >= 249 and mx <= 255 and (mx - mn) <= 12:
                px[x, y] = (0, 0, 0, 0)
    return out


def flood_edge_pale_background(im: Image.Image, tol: int) -> Image.Image:
    im = im.convert("RGBA").copy()
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
        lum = (c[0] + c[1] + c[2]) / 3
        if lum < 215:
            continue
        if not any(dist(c, r) <= tol for r in refs):
            refs.append(c)
    if not refs:
        return im

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


def process_lion_hero() -> Image.Image:
    pad_loose = 28
    pad_tight = 12
    raw = Image.open(LION_SRC).convert("RGBA")
    lion = crop_alpha_bbox(raw, pad_loose)
    lion = recover_rgb_from_white_matte(lion)
    lion = tonal_defringe_for_dark_bg(lion, HERO_BG)
    lion = dematte_pale_semitransparent(lion)
    lion = flood_edge_pale_background(lion, tol=46)
    lion = crop_alpha_bbox(lion, pad_tight)
    lion = sharpen_pre_downscale(lion)
    lion = resize_longest_two_step(lion, max_side=2800)
    lion = sharpen_mild(lion)
    return lion


def process_letters_nav() -> Image.Image:
    pad = 10
    im = crop_alpha_bbox(Image.open(LETTERS_SRC).convert("RGBA"), pad)
    im = recover_rgb_from_white_matte(im)
    im = tonal_defringe_for_dark_bg(im, HERO_BG)
    im = dematte_pale_semitransparent(im)
    return sharpen_mild(limit_longest_edge(im, max_side=560))


def process_pair() -> None:
    letters = process_letters_nav()
    lion = process_lion_hero()

    OUT.mkdir(parents=True, exist_ok=True)
    lp = OUT / "ceos-os-landing-nav-letters.png"
    hp = OUT / "ceos-os-landing-hero-with-lion.png"
    letters.save(lp, optimize=True)
    lion.save(hp, optimize=True)
    print(f"wrote {lp.relative_to(ROOT)}  {letters.size}")
    print(f"wrote {hp.relative_to(ROOT)}  {lion.size}")


def main() -> int:
    if not LETTERS_SRC.is_file() or not LION_SRC.is_file():
        print("missing source PNG(s) in public/brand/", file=sys.stderr)
        return 1
    process_pair()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
