import os
import glob
from PIL import Image

BRAIN_DIR = r"C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91"
PUBLIC_DIR = r"D:\social-main\public"

recordings = [
    ("scripts/screencast/desktop_l2d", "switch-desktop-light-to-dark"),
    ("scripts/screencast/desktop_d2l", "switch-desktop-dark-to-light"),
    ("scripts/screencast/mobile_l2d", "switch-mobile-light-to-dark-4x"),
    ("scripts/screencast/mobile_d2l", "switch-mobile-dark-to-light-4x"),
]

for frame_dir, out_name in recordings:
    files = sorted(glob.glob(os.path.join(frame_dir, "*.jpg")))
    if not files:
        print(f"No frames in {frame_dir}")
        continue

    images = [Image.open(f) for f in files]
    first = images[0]

    # Save as animated WebP (lossless/high-quality video animation)
    webp_public = os.path.join(PUBLIC_DIR, f"{out_name}.webp")
    webp_brain = os.path.join(BRAIN_DIR, f"{out_name}.webp")
    
    first.save(
        webp_public,
        save_all=True,
        append_images=images[1:],
        duration=50,  # 20 fps (50ms per frame)
        loop=0,
        quality=90,
    )
    first.save(
        webp_brain,
        save_all=True,
        append_images=images[1:],
        duration=50,
        loop=0,
        quality=90,
    )
    print(f"Generated {out_name}.webp ({len(images)} frames, {os.path.getsize(webp_public)/1024:.1f} KB)")
