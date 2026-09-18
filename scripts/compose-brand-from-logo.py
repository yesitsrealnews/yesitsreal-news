#!/usr/bin/env python3
"""Compose X banners and profile photos from the locked logo. Do not retouch the mark."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/workspace")
BRAND = ROOT / "public" / "brand"
# Locked mark — place it, never redraw it.
MARK = Image.open(BRAND / "avatar.png").convert("RGBA")
FONT = "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Bold.ttf"
INK = (11, 11, 11)
PAPER = (244, 239, 228)
SIGNAL = (225, 6, 0)
GOLD = (255, 228, 0)


def fit_mark(size: int) -> Image.Image:
    return MARK.resize((size, size), Image.Resampling.LANCZOS)


def circle_on(bg_rgb: tuple[int, int, int], size: int) -> Image.Image:
    mark = fit_mark(size)
    canvas = Image.new("RGBA", (size, size), (*bg_rgb, 255))
    canvas.alpha_composite(mark)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    canvas.putalpha(mask)
    return canvas


def banner_1500() -> Image.Image:
    w, h = 1500, 500
    canvas = Image.new("RGB", (w, h), INK)
    draw = ImageDraw.Draw(canvas)
    mark = fit_mark(460)
    canvas.paste(mark, (20, 20), mark)
    draw.rectangle((508, 56, 516, 444), fill=SIGNAL)
    lg = ImageFont.truetype(FONT, 64)
    sm = ImageFont.truetype(FONT, 28)
    x = 560
    draw.text((x, 128), "REAL NEWS.", fill=PAPER, font=lg)
    draw.text((x, 198), "UNBELIEVABLY DUMB.", fill=PAPER, font=lg)
    draw.rectangle((x, 288, x + 220, 296), fill=GOLD)
    draw.text((x, 322), "YESITSREAL.NEWS", fill=GOLD, font=sm)
    return canvas


def og_card() -> Image.Image:
    w, h = 1200, 630
    canvas = Image.new("RGB", (w, h), INK)
    draw = ImageDraw.Draw(canvas)
    mark = fit_mark(360)
    canvas.paste(mark, (70, 135), mark)
    draw.rectangle((470, 160, 478, 470), fill=SIGNAL)
    lg = ImageFont.truetype(FONT, 58)
    sm = ImageFont.truetype(FONT, 26)
    draw.text((516, 200), "REAL NEWS.", fill=PAPER, font=lg)
    draw.text((516, 268), "UNBELIEVABLY DUMB.", fill=PAPER, font=lg)
    draw.rectangle((516, 352, 736, 360), fill=GOLD)
    draw.text((516, 384), "YESITSREAL.NEWS", fill=GOLD, font=sm)
    return canvas


def save_jpg(im: Image.Image, path: Path, quality: int = 92) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rgb = im.convert("RGB")
    rgb.save(path, "JPEG", quality=quality, optimize=True, subsampling=1)


def save_png(im: Image.Image, path: Path) -> None:
    im.save(path, "PNG", optimize=True)


def main() -> None:
    # Profile JPEG: the locked mark, round-ready on its own red. Do not rewrite avatar.png / avatar.svg.
    circ = circle_on(SIGNAL, 1024)
    save_png(circ, BRAND / "avatar-circle.png")
    circ_jpg = Image.new("RGB", (1024, 1024), SIGNAL)
    circ_jpg.paste(circ, (0, 0), circ)
    save_jpg(circ_jpg, BRAND / "avatar.jpg", 95)

    b = banner_1500()
    for name in (
        "YES-ITS-REAL-banniere-X-1500x500.jpg",
        "twitter-banner-1500x500.jpg",
        "header-x-1500x500.jpg",
        "header.jpg",
        "header-clean.jpg",
        "header-preview.jpg",
        "header-elon-eyes.jpg",
        "header-eyes-yellow.jpg",
    ):
        save_jpg(b, BRAND / name, 92)

    og = og_card()
    save_jpg(og, ROOT / "public" / "og.jpg", 90)
    print("brand composed from locked mark")


if __name__ == "__main__":
    main()
