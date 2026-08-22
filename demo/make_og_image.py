"""
Build the 1200x630 social preview image referenced by og:image in index.html.

Run from the project root directory:
  conda run -n torch-env python demo/make_og_image.py

Reads the already-converted PNGs in demo/frontend/public/images/, so it does not
need the raw .tif files.
"""

import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(BASE, "demo", "frontend", "public", "images")
# Stays PNG: several social scrapers still do not accept WebP for og:image.
OUT = os.path.join(BASE, "demo", "frontend", "public", "og-image.png")

SAMPLE = "ZM1717612_2021-08"          # a roughly 40/60 field-to-background tile
W, H = 1200, 630
BG = (15, 23, 42)                     # slate-950, matching the site
GRID = (30, 41, 59)                   # slate-800
WHITE = (255, 255, 255)
MUTED = (148, 163, 184)               # slate-400
ACCENT = (96, 165, 250)               # blue-400

PANELS = [("satellite", "Satellite input"),
          ("labels", "Ground truth"),
          ("predictions", "UNet prediction")]

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default(size)


def main():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=GRID)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=GRID)

    d.text((64, 78), "Satellite Agricultural", font=load_font(52), fill=WHITE)
    d.text((64, 140), "Field Segmentation", font=load_font(52), fill=ACCENT)
    d.text((64, 216),
           "UNet fine-tuning  ·  MappingAfrica  ·  Zambia",
           font=load_font(24), fill=MUTED)
    d.text((64, 254),
           "81.79% pixel accuracy  ·  43.31% mIoU  ·  50 test predictions",
           font=load_font(24), fill=MUTED)

    tile, gap, top = 256, 32, 320
    left = 64
    label_font = load_font(20)
    for i, (kind, label) in enumerate(PANELS):
        path = os.path.join(IMAGES, kind, f"{SAMPLE}.webp")
        if not os.path.exists(path):
            raise SystemExit(f"missing {path} — run demo/convert_images.py first")
        resample = Image.NEAREST if kind != "satellite" else Image.LANCZOS
        panel = Image.open(path).convert("RGB").resize((tile, tile), resample)
        x = left + i * (tile + gap)
        img.paste(panel, (x, top))
        d.rectangle([x, top, x + tile - 1, top + tile - 1], outline=(51, 65, 85))
        d.text((x, top + tile + 12), label, font=label_font, fill=MUTED)

    img.save(OUT, format="PNG", optimize=True)
    print(f"Wrote {OUT} ({img.width}x{img.height}, {os.path.getsize(OUT) // 1024} KB)")


if __name__ == "__main__":
    main()
