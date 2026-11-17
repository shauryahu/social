import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

out_dir = r"d:\social-main\public\images\why"
os.makedirs(out_dir, exist_ok=True)

W, H = 800, 1000

# -------------------------------------------------------------
# CARD 1: Established Experience (Clock Icon on pure #FFFFFF)
# -------------------------------------------------------------
def generate_card_1():
    im = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(im)
    cx, cy = 400, 470

    # Outer luxury rings (#000000)
    for r, w in [(240, 2), (200, 4), (160, 2), (120, 1)]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 0, 0), width=w)

    # 12 Hour tick markers
    for deg in range(0, 360, 30):
        rad = math.radians(deg)
        w_tick = 4 if deg % 90 == 0 else 2
        x1 = cx + math.cos(rad) * 178
        y1 = cy + math.sin(rad) * 178
        x2 = cx + math.cos(rad) * 196
        y2 = cy + math.sin(rad) * 196
        draw.line([(x1, y1), (x2, y2)], fill=(0, 0, 0), width=w_tick)

    # 60 Minute tiny dots
    for deg in range(0, 360, 6):
        if deg % 30 != 0:
            rad = math.radians(deg)
            x = cx + math.cos(rad) * 187
            y = cy + math.sin(rad) * 187
            draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(60, 60, 60))

    # Clock hands
    rad_h = math.radians(-35)
    draw.line([(cx, cy), (cx + math.cos(rad_h) * 95, cy + math.sin(rad_h) * 95)], fill=(0, 0, 0), width=6)
    rad_m = math.radians(-90)
    draw.line([(cx, cy), (cx + math.cos(rad_m) * 140, cy + math.sin(rad_m) * 140)], fill=(0, 0, 0), width=4)

    # Center pivot
    draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=(0, 0, 0))
    draw.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=(255, 255, 255))

    # EST. 2021 Badge
    badge_w, badge_h = 110, 22
    bx1, by1 = cx - badge_w, cy + 245
    bx2, by2 = cx + badge_w, by1 + 44
    draw.rounded_rectangle([bx1, by1, bx2, by2], radius=22, outline=(0, 0, 0), width=2)

    try:
        font = ImageFont.truetype("arialbd.ttf", 20)
    except Exception:
        font = ImageFont.load_default()

    text = "EST. 2021"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, by1 + (44 - th) // 2 - 2), text, fill=(0, 0, 0), font=font)

    im.save(os.path.join(out_dir, "established-experience.png"), "PNG")
    print("Saved established-experience.png")

# -------------------------------------------------------------
# CARD 2: Multi-Platform (Connected Orbital Globe on #FFFFFF)
# -------------------------------------------------------------
def generate_card_2():
    im = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(im)
    cx, cy = 400, 480

    # Central sphere
    draw.ellipse([cx - 110, cy - 110, cx + 110, cy + 110], outline=(0, 0, 0), width=3)

    # Latitudinal / orbital grid rings inside sphere
    draw.arc([cx - 110, cy - 45, cx + 110, cy + 45], 0, 360, fill=(0, 0, 0), width=1)
    draw.arc([cx - 45, cy - 110, cx + 45, cy + 110], 0, 360, fill=(0, 0, 0), width=1)

    # 3 Outer orbital ellipses
    for rx, ry, ang in [(260, 90, 25), (250, 85, -35), (270, 100, 70)]:
        pts = []
        rad_ang = math.radians(ang)
        cos_a = math.cos(rad_ang)
        sin_a = math.sin(rad_ang)
        for t in range(0, 360, 3):
            rad_t = math.radians(t)
            px = rx * math.cos(rad_t)
            py = ry * math.sin(rad_t)
            rx_t = px * cos_a - py * sin_a + cx
            ry_t = px * sin_a + py * cos_a + cy
            pts.append((rx_t, ry_t))
        draw.polygon(pts, outline=(0, 0, 0), width=2)

    # Orbiting nodes
    nodes = [
        (cx - 180, cy - 90, 22),
        (cx + 170, cy - 80, 20),
        (cx - 150, cy + 130, 18),
        (cx + 160, cy + 120, 18),
        (cx, cy - 200, 18),
    ]
    for nx, ny, nr in nodes:
        draw.ellipse([nx - nr, ny - nr, nx + nr, ny + nr], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
        draw.ellipse([nx - 6, ny - 6, nx + 6, ny + 6], fill=(0, 0, 0))
        draw.line([(cx, cy), (nx, ny)], fill=(120, 120, 120), width=1)

    im.save(os.path.join(out_dir, "multi-platform.png"), "PNG")
    print("Saved multi-platform.png")

# -------------------------------------------------------------
# CARD 3: Specialized Assistance (Shield Icon on #FFFFFF)
# -------------------------------------------------------------
def generate_card_3():
    im = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(im)
    cx, cy = 400, 470

    shield_outer = [
        (cx, cy - 210),
        (cx + 170, cy - 130),
        (cx + 140, cy + 90),
        (cx, cy + 220),
        (cx - 140, cy + 90),
        (cx - 170, cy - 130),
    ]
    shield_inner = [
        (cx, cy - 170),
        (cx + 130, cy - 100),
        (cx + 110, cy + 70),
        (cx, cy + 180),
        (cx - 110, cy + 70),
        (cx - 130, cy - 100),
    ]
    draw.polygon(shield_outer, outline=(0, 0, 0), width=3)
    draw.polygon(shield_inner, outline=(0, 0, 0), width=2)

    draw.line([shield_outer[0], shield_outer[3]], fill=(0, 0, 0), width=2)
    draw.line([shield_outer[1], shield_outer[4]], fill=(140, 140, 140), width=1)
    draw.line([shield_outer[5], shield_outer[2]], fill=(140, 140, 140), width=1)

    for angle in [0, 45, 90, 135]:
        rad = math.radians(angle)
        length = 75 if angle % 90 == 0 else 40
        dx = math.cos(rad) * length
        dy = math.sin(rad) * length
        draw.line([(cx - dx, cy - dy), (cx + dx, cy + dy)], fill=(0, 0, 0), width=3 if angle % 90 == 0 else 2)
    draw.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], fill=(0, 0, 0))

    im.save(os.path.join(out_dir, "specialized-assistance.png"), "PNG")
    print("Saved specialized-assistance.png")

# -------------------------------------------------------------
# CARD 4: Integrated Network (Connected Network Cubes on #FFFFFF)
# -------------------------------------------------------------
def generate_card_4():
    im = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(im)

    def draw_iso_cube(px, py, size):
        dx = size * math.cos(math.radians(30))
        dy = size * math.sin(math.radians(30))
        top = [(px, py - size), (px + dx, py - size + dy), (px, py - size + 2*dy), (px - dx, py - size + dy)]
        draw.polygon(top, fill=(255, 255, 255), outline=(0, 0, 0), width=3)
        left = [(px - dx, py - size + dy), (px, py - size + 2*dy), (px, py + dy), (px - dx, py)]
        draw.polygon(left, fill=(245, 245, 245), outline=(0, 0, 0), width=3)
        right = [(px + dx, py - size + dy), (px, py - size + 2*dy), (px, py + dy), (px + dx, py)]
        draw.polygon(right, fill=(230, 230, 230), outline=(0, 0, 0), width=3)

    draw.line([(400, 390), (290, 550)], fill=(0, 0, 0), width=3)
    draw.line([(400, 390), (510, 550)], fill=(0, 0, 0), width=3)
    draw.line([(290, 550), (510, 550)], fill=(0, 0, 0), width=3)

    draw_iso_cube(400, 390, 70)
    draw_iso_cube(290, 550, 65)
    draw_iso_cube(510, 550, 65)

    for nx, ny in [(400, 390), (290, 550), (510, 550)]:
        draw.ellipse([nx - 12, ny - 12, nx + 12, ny + 12], fill=(255, 255, 255), outline=(0, 0, 0), width=3)

    im.save(os.path.join(out_dir, "integrated-network.png"), "PNG")
    print("Saved integrated-network.png")

# -------------------------------------------------------------
# CARD 5: Direct Communication (No Intermediaries on #FFFFFF)
# -------------------------------------------------------------
def generate_card_5():
    src_path = r"C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\.user_uploaded\media_1794881613002_feff63da.jpg"
    im = Image.open(src_path).convert("RGB")
    arr = np.array(im, dtype=np.float32)
    H_orig, W_orig, _ = arr.shape

    lum = 0.299 * arr[:,:,0] + 0.587 * arr[:,:,1] + 0.114 * arr[:,:,2]
    clean = np.ones((H_orig, W_orig, 3), dtype=np.uint8) * 255

    # 1. Text extraction
    for y in range(40, 230):
        for x in range(W_orig):
            l = lum[y, x]
            if l < 110:
                val = int(np.clip(l / 110.0, 0, 1) * 20)
                clean[y, x] = [val, val, val]

    # 2. Upward Arrow: clean polygonal arrow in the center
    arrow_pts = [
        (362, 195),
        (410, 295),
        (384, 295),
        (384, 720),
        (340, 720),
        (340, 295),
        (314, 295),
    ]
    arrow_mask = Image.new("L", (W_orig, H_orig), 0)
    adraw = ImageDraw.Draw(arrow_mask)
    adraw.polygon(arrow_pts, fill=255)
    adraw.arc([280, 680, 360, 780], start=270, end=360, fill=255, width=22)
    adraw.arc([364, 680, 444, 780], start=180, end=270, fill=255, width=22)

    arrow_arr = np.array(arrow_mask)
    arrow_idx = np.where(arrow_arr > 100)
    clean[arrow_idx[0], arrow_idx[1]] = [221, 224, 228] # #DDE0E4

    # 3. Left and Right Businessman Silhouettes
    for y in range(260, 885):
        for x in range(160, 564):
            l = lum[y, x]
            if l < 75:
                clean[y, x] = [0, 0, 0]
            elif l > 205 and 200 < x < 524 and y < 600:
                clean[y, x] = [255, 255, 255]

    # Scale to 800x1000
    im_clean = Image.fromarray(clean)
    scale = 920.0 / H_orig
    new_w = int(W_orig * scale)
    new_h = int(H_orig * scale)
    im_scaled = im_clean.resize((new_w, new_h), Image.Resampling.LANCZOS)

    final = Image.new("RGB", (W, H), (255, 255, 255))
    offset_x = (W - new_w) // 2
    offset_y = (H - new_h) // 2
    final.paste(im_scaled, (offset_x, offset_y))

    ground_y = offset_y + int(880 * scale)
    fdraw = ImageDraw.Draw(final)
    fdraw.line([(offset_x + int(170 * scale), ground_y), (offset_x + int(554 * scale), ground_y)], fill=(37, 37, 37), width=2)

    final.save(os.path.join(out_dir, "direct-communication.png"), "PNG")
    print("Saved direct-communication.png")

if __name__ == "__main__":
    generate_card_1()
    generate_card_2()
    generate_card_3()
    generate_card_4()
    generate_card_5()
    print("All 5 monochrome cards generated successfully!")
