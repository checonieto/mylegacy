"""Download verified raw captures and prepare App Store-ready PNGs (RGB, no alpha).

iPhone captures are 1206x2622 (6.3-inch); they are scaled to 1320x2868 (IPHONE_67),
which has the same aspect ratio.
iPad captures are 1668x2420 (11-inch); App Store requires 13-inch (2064x2752),
so they are scaled to full height and centered on the app's cream background.
"""
import io
import json
import os
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(ROOT, "experiments", "livingmemory-store-captures.json")
ORDER = ["welcome", "questions", "review", "book"]
IPAD_SIZE = (2064, 2752)
IPHONE_SIZE = (1320, 2868)


def fetch(url: str) -> Image.Image:
    with urllib.request.urlopen(url) as r:
        return Image.open(io.BytesIO(r.read())).convert("RGB")


def to_ipad13(img: Image.Image) -> Image.Image:
    w, h = img.size
    scale = IPAD_SIZE[1] / h
    resized = img.resize((round(w * scale), IPAD_SIZE[1]), Image.LANCZOS)
    bg = img.getpixel((4, h // 2))  # sample app background at left edge
    canvas = Image.new("RGB", IPAD_SIZE, bg)
    canvas.paste(resized, ((IPAD_SIZE[0] - resized.width) // 2, 0))
    return canvas


def main() -> None:
    manifest = json.load(open(MANIFEST))
    for device in ("iphone", "ipad"):
        for lang, shots in manifest[device].items():
            out_dir = os.path.join(ROOT, device, lang)
            os.makedirs(out_dir, exist_ok=True)
            for i, key in enumerate(ORDER, 1):
                img = fetch(shots[key])
                if device == "ipad":
                    img = to_ipad13(img)
                elif img.size != IPHONE_SIZE:
                    img = img.resize(IPHONE_SIZE, Image.LANCZOS)
                path = os.path.join(out_dir, f"{i:02d}-{key}.png")
                img.save(path, "PNG")
                print(path, img.size)


if __name__ == "__main__":
    main()
