"""Crop product photos out of the catalog PDF page renders into WebP files.

Fallback for D9 until the customer sends original photos.
Input:  assets/catalog/pNN.jpg (1075x1521 renders of each PDF page)
Output: public/images/products/<name>.webp
Usage:  python -I scripts/crop-catalog.py
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "catalog"
OUT = ROOT / "public" / "images" / "products"
OUT.mkdir(parents=True, exist_ok=True)

# Three-view boxes (front, side, back) in page pixels, per layout.
ORNATE = [(42, 284, 373, 950), (390, 284, 683, 950), (699, 284, 1031, 950)]
CROSS = [(49, 392, 338, 838), (364, 392, 670, 838), (697, 392, 1024, 838)]
CLEAR = [(34, 414, 353, 863), (375, 414, 695, 863), (718, 414, 1038, 863)]

THREE_VIEW = {
    "ornate-gold": (2, ORNATE), "ornate-brown": (3, ORNATE), "ornate-black": (4, ORNATE),
    "ornate-white": (5, ORNATE), "ornate-acrylic": (6, ORNATE),
    "cross-back-lime-green": (8, CROSS), "cross-back-brown": (9, CROSS),
    "cross-back-pink": (10, [(52, 378, 360, 762), (377, 378, 698, 762), (714, 378, 1022, 762)]),
    "cross-back-white": (11, CROSS),
    "cross-back-amethyst-purple": (12, [(100, 415, 362, 810), (420, 415, 695, 810), (712, 415, 1040, 810)]),
    "cross-back-dark-brown": (13, [(50, 415, 362, 810), (388, 415, 700, 810), (725, 415, 1060, 810)]),
    "luna": (14, [(27, 318, 353, 906), (370, 318, 698, 906), (714, 318, 1048, 906)]),
    "regal-flora": (15, [(32, 320, 355, 901), (372, 320, 698, 901), (715, 320, 1043, 901)]),
    "aurora": (16, CLEAR),
    "imperia": (17, [(39, 407, 341, 965), (370, 407, 685, 965), (716, 407, 1038, 965)]),
    "valeria": (18, [(95, 245, 365, 700), (400, 245, 690, 700), (720, 245, 1000, 700)]),
    "elvira": (19, [(34, 459, 350, 1160), (381, 459, 692, 1160), (724, 459, 1038, 1160)]),
    "aurelia": (20, CLEAR),
    # Side view skipped: the page's callout text overlaps it.
    "aurelian": (21, [(105, 285, 425, 960), None, (745, 300, 1025, 900)]),
    "lumina": (22, [(34, 414, 341, 936), (366, 414, 689, 936), (716, 414, 1038, 936)]),
    "lucent": (23, [(92, 252, 388, 680), (407, 252, 695, 680), (714, 252, 990, 680)]),
}

# Single wide photo areas for pages without a three-view layout.
SINGLE = {
    "tonate": (24, (0, 175, 1075, 1010)),
    "acrylic-chiavari": (25, (0, 175, 1075, 1010)),
    "rattan": (26, (0, 175, 1075, 1010)),
    "milan-elegance": (27, (0, 175, 1075, 1030)),
    "milan-blush": (28, (0, 175, 1075, 1030)),
    "milan-curve": (29, (0, 175, 1075, 1030)),
    "milan-heritage": (30, (0, 175, 1075, 1030)),
    "pagoda-3x3": (40, (0, 190, 1075, 1521)),
    "pagoda-20x20": (41, (0, 190, 1075, 1521)),
    "german-hanger": (42, (0, 300, 1075, 1145)),
    "german-aluminium-pagoda": (43, (0, 185, 1075, 1000)),
}

VELVET_SOFAS = ["sky-blue", "emerald-green", "bright-orange", "beige", "royal-blue",
                "baby-pink", "royal-black", "dusty-rose", "golden"]


def save(img: Image.Image, name: str) -> None:
    if img.width > 900:
        img = img.resize((900, round(img.height * 900 / img.width)), Image.LANCZOS)
    img.save(OUT / f"{name}.webp", "WEBP", quality=82)


def page(n: int) -> Image.Image:
    return Image.open(SRC / f"p{n:02d}.jpg").convert("RGB")


for name, (n, boxes) in THREE_VIEW.items():
    p = page(n)
    for view, box in zip(["front", "side", "back"], boxes):
        if box:
            save(p.crop(box), f"{name}-{view}")

for name, (n, box) in SINGLE.items():
    save(page(n).crop(box), name)

for i, colour in enumerate(VELVET_SOFAS):
    p = page(31 + i)
    save(p.crop((60, 320, 1015, 735)), f"velvet-sofa-{colour}-1")
    save(p.crop((60, 745, 1015, 1160)), f"velvet-sofa-{colour}-2")

print(len(list(OUT.glob("*.webp"))), "images written")
