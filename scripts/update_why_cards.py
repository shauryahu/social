import os
import numpy as np
from PIL import Image

OUT_DIR = r"d:\social-main\public\images\why"
os.makedirs(OUT_DIR, exist_ok=True)

TARGET_W, TARGET_H = 800, 1000

CARDS = [
    (
        "established-experience.png",
        r"C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\.user_uploaded\media_1794948381713_a3b1c54e.jpg",
    ),
    (
        "integrated-network.png",
        r"C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\.user_uploaded\media_1794948381731_ce33dd75.jpg",
    ),
    (
        "specialized-assistance.png",
        r"C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\.user_uploaded\media_1794948381732_6e48cb14.jpg",
    ),
    (
        "multi-platform.png",
        r"C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\.user_uploaded\media_1794948381733_74cad942.jpg",
    ),
]

def process_image(filename, src_path):
    im = Image.open(src_path).convert("RGB")
    arr = np.array(im)
    
    # Card outline box in the 935x1024 original image
    # Left: ~140, Right: ~795, Top: ~66, Bottom: ~955
    x1, x2 = 140, 795
    y1, y2 = 66, 955
    
    card = arr[y1:y2, x1:x2].copy()
    ch, cw, _ = card.shape
    
    # 1. Remove the faint drawn border line in the outer 20px perimeter
    for y in range(ch):
        for x in range(cw):
            # Outer margin of the card
            if x < 20 or x > cw - 20 or y < 20 or y > ch - 20:
                if card[y, x].mean() > 175:
                    card[y, x] = [255, 255, 255]
            # Clean background to pure #FFFFFF
            if card[y, x].mean() > 248:
                card[y, x] = [255, 255, 255]

    # 2. Scale proportionally to fit 800x1000 canvas
    # Target content height ~920px (leaves ~40px margin top and bottom)
    scale = 920.0 / ch
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    
    card_img = Image.fromarray(card).resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    final = Image.new("RGB", (TARGET_W, TARGET_H), (255, 255, 255))
    offset_x = (TARGET_W - new_w) // 2
    offset_y = (TARGET_H - new_h) // 2
    final.paste(card_img, (offset_x, offset_y))
    
    out_path = os.path.join(OUT_DIR, filename)
    final.save(out_path, "PNG")
    print(f"Saved {out_path} ({TARGET_W}x{TARGET_H})")

def main():
    for filename, src_path in CARDS:
        process_image(filename, src_path)
    print("All 4 cards updated successfully!")

if __name__ == "__main__":
    main()
