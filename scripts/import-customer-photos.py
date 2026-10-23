"""Convert the customer's WhatsApp photos into site WebP files.

Round 1 (2026-10-23): real set-up photos replace blurry stock images and feed the hero tiles.
Input:  the folder the customer's photos were saved to (WhatsApp Image 2026-10-22 at ....jpeg)
Output: public/images/<path>.webp
Usage:  python -I scripts/import-customer-photos.py "C:/Users/Mohd Azimullah/Downloads/milan group img"
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images"
MAX_W = 1600
MIN_W = 800
MIN_W_HERO = 540  # hero tiles render at most ~210 CSS px wide

P = "WhatsApp Image 2026-10-22 at "

# (source, output under public/images without extension, aspect, focus (x, y) as 0–1, trim from bottom in px)
JOBS = [
    (P + "10.01.55 PM.jpeg", "home/hero-tents", "3:4", (0.55, 0.5), 0),
    (P + "10.02.12 PM (1).jpeg", "home/hero-tables", "3:4", (0.55, 0.5), 0),
    (P + "9.56.57 PM (1).jpeg", "home/hero-decor", "3:4", (0.5, 0.5), 0),
    (P + "9.52.52 PM.jpeg", "products/super-structure-1", "orig", (0.5, 0.5), 75),
    (P + "9.56.56 PM.jpeg", "products/super-structure-2", "4:3", (0.5, 0.5), 0),
    (P + "9.56.57 PM.jpeg", "products/super-structure-3", "4:3", (0.5, 0.5), 0),
    (P + "9.53.26 PM.jpeg", "items/t-gazebo", "4:3", (0.5, 0.45), 160),
    (P + "10.02.12 PM.jpeg", "items/t-pandal", "4:3", (0.5, 0.5), 0),
    (P + "10.02.11 PM.jpeg", "items/f-banquet-tables", "4:3", (0.5, 0.55), 0),
    (P + "9.58.05 PM.jpeg", "home/real-german-hanger", "4:3", (0.5, 0.5), 0),
    (P + "10.01.52 PM.jpeg", "home/real-tent-interior", "4:3", (0.5, 0.5), 0),
    (P + "10.01.54 PM.jpeg", "home/real-palace-tent", "4:3", (0.5, 0.5), 0),
    (P + "10.02.11 PM (1).jpeg", "home/real-entrance-gate", "4:3", (0.5, 0.5), 0),
    (P + "10.02.13 PM (1).jpeg", "home/real-chair-rows", "4:3", (0.5, 0.5), 0),
    (P + "10.02.13 PM.jpeg", "home/real-hall-seating", "4:3", (0.5, 0.5), 0),
    (P + "9.56.55 PM.jpeg", "home/real-hall-tent", "4:3", (0.5, 0.5), 0),
    (P + "9.56.56 PM (1).jpeg", "home/real-lawn-tent", "4:3", (0.5, 0.5), 0),
    (P + "9.58.06 PM.jpeg", "home/real-night-decor", "4:3", (0.5, 0.5), 0),
]


def crop_to(img: Image.Image, aspect: str, focus: tuple[float, float]) -> Image.Image:
    if aspect == "orig":
        return img
    aw, ah = (int(n) for n in aspect.split(":"))
    w, h = img.size
    if w / h > aw / ah:  # too wide: cut the sides
        cw, ch = round(h * aw / ah), h
    else:  # too tall: cut top/bottom
        cw, ch = w, round(w * ah / aw)
    left = min(max(round(focus[0] * w - cw / 2), 0), w - cw)
    top = min(max(round(focus[1] * h - ch / 2), 0), h - ch)
    return img.crop((left, top, left + cw, top + ch))


def main(src_dir: Path) -> None:
    for src, out, aspect, focus, trim in JOBS:
        img = Image.open(src_dir / src).convert("RGB")
        if trim:
            img = img.crop((0, 0, img.width, img.height - trim))
        img = crop_to(img, aspect, focus)
        floor = MIN_W_HERO if out.startswith("home/hero-") else MIN_W
        if img.width < floor:
            print(f"SKIP {out}: {img.width}px wide, below {floor}px")
            continue
        if img.width > MAX_W:
            img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)
        dest = OUT / f"{out}.webp"
        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, "WEBP", quality=85)
        print(f"ok   {out}: {img.width}x{img.height}")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
