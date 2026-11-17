import math
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

out_dir = r"d:\social-main\public\images\why"
os.makedirs(out_dir, exist_ok=True)

W, H = 800, 1000

def create_base_canvas(color_top, color_bot, glow_center, glow_color, glow_radius=420):
    im = Image.new("RGBA", (W, H))
    draw = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        r = int(color_top[0] * (1 - t) + color_bot[0] * t)
        g = int(color_top[1] * (1 - t) + color_bot[1] * t)
        b = int(color_top[2] * (1 - t) + color_bot[2] * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
    
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gx, gy = glow_center
    for rad in range(glow_radius, 0, -6):
        alpha = int((1 - (rad / glow_radius) ** 1.6) * glow_color[3])
        gdraw.ellipse([gx - rad, gy - rad, gx + rad, gy + rad], fill=(glow_color[0], glow_color[1], glow_color[2], alpha))
    
    glow = glow.filter(ImageFilter.GaussianBlur(35))
    im = Image.alpha_composite(im, glow)
    
    # Subtle grid
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    griddraw = ImageDraw.Draw(grid)
    for x in range(0, W, 48):
        griddraw.line([(x, 0), (x, H)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, H, 48):
        griddraw.line([(0, y), (W, y)], fill=(255, 255, 255, 10), width=1)
    im = Image.alpha_composite(im, grid)
    return im

def add_floating_particles(im, particles):
    part = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(part)
    for x, y, r, a in particles:
        for rad in range(r, 0, -1):
            pdraw.ellipse([x - rad, y - rad, x + rad, y + rad], fill=(255, 255, 255, int(a * (1 - rad/r))))
    return Image.alpha_composite(im, part)

# CARD 1: Established Experience (Timepiece / Clock)
def make_card_1():
    im = create_base_canvas((14, 17, 30), (33, 20, 56), (400, 480), (145, 95, 255, 150))
    draw_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    cx, cy = 400, 480
    
    # Outer luxury rings
    for r, w, a in [(240, 2, 45), (200, 3, 90), (160, 2, 60), (120, 1, 40)]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(200, 180, 255, a), width=w)
    
    # Hour markers
    for deg in range(0, 360, 30):
        rad = math.radians(deg)
        x1 = cx + math.cos(rad) * 180
        y1 = cy + math.sin(rad) * 180
        x2 = cx + math.cos(rad) * 195
        y2 = cy + math.sin(rad) * 195
        draw.line([(x1, y1), (x2, y2)], fill=(240, 230, 255, 140), width=3)
    
    # Clock hands
    rad_h = math.radians(-30)
    draw.line([(cx, cy), (cx + math.cos(rad_h) * 90, cy + math.sin(rad_h) * 90)], fill=(255, 255, 255, 220), width=6)
    rad_m = math.radians(-90)
    draw.line([(cx, cy), (cx + math.cos(rad_m) * 135, cy + math.sin(rad_m) * 135)], fill=(180, 140, 255, 240), width=4)
    draw.ellipse([cx - 14, cy - 14, cx + 14, cy + 14], fill=(255, 255, 255, 240), outline=(140, 90, 255, 255), width=3)
    
    draw.rounded_rectangle([cx - 90, cy + 240, cx + 90, cy + 285], radius=22, fill=(255, 255, 255, 25), outline=(255, 255, 255, 70), width=2)
    
    particles = [(280, 300, 8, 120), (520, 340, 6, 140), (220, 620, 10, 90), (580, 590, 7, 110), (400, 260, 5, 180)]
    im = Image.alpha_composite(im, draw_layer)
    im = add_floating_particles(im, particles)
    im.save(os.path.join(out_dir, "established-experience.png"))
    print("Saved established-experience.png")

# CARD 2: Multi-Platform (Connected Orbital Globe)
def make_card_2():
    im = create_base_canvas((10, 20, 38), (31, 20, 58), (400, 480), (82, 120, 245, 160))
    draw_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    cx, cy = 400, 480
    
    draw.ellipse([cx - 110, cy - 110, cx + 110, cy + 110], fill=(255, 255, 255, 20), outline=(130, 170, 255, 120), width=3)
    
    for rx, ry, ang in [(260, 90, 25), (250, 85, -35), (270, 100, 70)]:
        pts = []
        rad_ang = math.radians(ang)
        cos_a = math.cos(rad_ang)
        sin_a = math.sin(rad_ang)
        for t in range(0, 360, 4):
            rad_t = math.radians(t)
            px = rx * math.cos(rad_t)
            py = ry * math.sin(rad_t)
            rx_t = px * cos_a - py * sin_a + cx
            ry_t = px * sin_a + py * cos_a + cy
            pts.append((rx_t, ry_t))
        draw.polygon(pts, outline=(170, 190, 255, 80), width=2)
    
    nodes = [
        (cx - 180, cy - 90, 30, (225, 48, 108, 180)),
        (cx + 170, cy - 80, 28, (37, 211, 102, 180)),
        (cx - 150, cy + 130, 26, (24, 119, 242, 180)),
        (cx + 160, cy + 120, 26, (0, 242, 234, 180)),
        (cx, cy - 200, 25, (255, 255, 255, 160)),
    ]
    for nx, ny, nr, ncolor in nodes:
        draw.ellipse([nx - nr - 6, ny - nr - 6, nx + nr + 6, ny + nr + 6], fill=(ncolor[0], ncolor[1], ncolor[2], 50))
        draw.ellipse([nx - nr, ny - nr, nx + nr, ny + nr], fill=(255, 255, 255, 45), outline=(255, 255, 255, 120), width=2)
        draw.line([(cx, cy), (nx, ny)], fill=(200, 220, 255, 50), width=1)
    
    im = Image.alpha_composite(im, draw_layer)
    im = add_floating_particles(im, [(320, 280, 7, 130), (480, 680, 9, 100), (200, 420, 6, 120)])
    im.save(os.path.join(out_dir, "multi-platform.png"))
    print("Saved multi-platform.png")

# CARD 3: Specialized Assistance (Refractive Shield / Diamond Prism)
def make_card_3():
    im = create_base_canvas((13, 23, 44), (26, 22, 58), (400, 480), (128, 96, 245, 160))
    draw_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
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
    draw.polygon(shield_outer, fill=(255, 255, 255, 22), outline=(180, 160, 255, 130), width=3)
    draw.polygon(shield_inner, fill=(150, 120, 255, 30), outline=(220, 210, 255, 90), width=2)
    
    draw.line([shield_outer[0], shield_outer[3]], fill=(255, 255, 255, 110), width=2)
    draw.line([shield_outer[1], shield_outer[4]], fill=(255, 255, 255, 60), width=1)
    draw.line([shield_outer[5], shield_outer[2]], fill=(255, 255, 255, 60), width=1)
    
    for angle in [0, 45, 90, 135]:
        rad = math.radians(angle)
        length = 75 if angle % 90 == 0 else 40
        dx = math.cos(rad) * length
        dy = math.sin(rad) * length
        draw.line([(cx - dx, cy - dy), (cx + dx, cy + dy)], fill=(255, 255, 255, 230), width=3 if angle % 90 == 0 else 2)
    draw.ellipse([cx - 15, cy - 15, cx + 15, cy + 15], fill=(255, 255, 255, 255))
    
    im = Image.alpha_composite(im, draw_layer)
    im = add_floating_particles(im, [(260, 260, 8, 140), (540, 280, 6, 120), (400, 720, 9, 110)])
    im.save(os.path.join(out_dir, "specialized-assistance.png"))
    print("Saved specialized-assistance.png")

# CARD 4: Integrated Network (3D Isometric Frosted Cubes)
def make_card_4():
    im = create_base_canvas((21, 18, 40), (38, 22, 66), (400, 480), (135, 61, 245, 170))
    draw_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    def draw_iso_cube(px, py, size, fill_top, fill_left, fill_right):
        dx = size * math.cos(math.radians(30))
        dy = size * math.sin(math.radians(30))
        top = [(px, py - size), (px + dx, py - size + dy), (px, py - size + 2*dy), (px - dx, py - size + dy)]
        draw.polygon(top, fill=fill_top, outline=(255, 255, 255, 120), width=2)
        left = [(px - dx, py - size + dy), (px, py - size + 2*dy), (px, py + dy), (px - dx, py)]
        draw.polygon(left, fill=fill_left, outline=(255, 255, 255, 90), width=2)
        right = [(px + dx, py - size + dy), (px, py - size + 2*dy), (px, py + dy), (px + dx, py)]
        draw.polygon(right, fill=fill_right, outline=(255, 255, 255, 90), width=2)

    draw_iso_cube(400, 390, 70, (255, 255, 255, 60), (160, 110, 255, 45), (120, 80, 240, 65))
    draw_iso_cube(290, 550, 65, (255, 255, 255, 50), (140, 95, 245, 40), (100, 70, 220, 55))
    draw_iso_cube(510, 550, 65, (255, 255, 255, 50), (140, 95, 245, 40), (100, 70, 220, 55))
    
    draw.line([(400, 390), (290, 550)], fill=(200, 170, 255, 150), width=3)
    draw.line([(400, 390), (510, 550)], fill=(200, 170, 255, 150), width=3)
    draw.line([(290, 550), (510, 550)], fill=(200, 170, 255, 150), width=3)
    
    for nx, ny in [(400, 390), (290, 550), (510, 550)]:
        draw.ellipse([nx - 12, ny - 12, nx + 12, ny + 12], fill=(255, 255, 255, 240), outline=(170, 110, 255, 255), width=3)
        
    im = Image.alpha_composite(im, draw_layer)
    im = add_floating_particles(im, [(360, 230, 8, 120), (450, 690, 7, 130), (200, 480, 6, 110)])
    im.save(os.path.join(out_dir, "integrated-network.png"))
    print("Saved integrated-network.png")

# CARD 5: Direct Communication (Paper Plane / Beacon Wave)
def make_card_5():
    im = create_base_canvas((10, 25, 46), (36, 24, 70), (400, 480), (82, 150, 255, 160))
    draw_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    cx, cy = 400, 470
    
    for r in range(120, 300, 45):
        draw.arc([cx - r - 40, cy - r + 30, cx + r - 40, cy + r + 30], start=240, end=350, fill=(130, 190, 255, max(15, 110 - int(r*0.3))), width=2)
    
    plane_pts = [
        (cx + 120, cy - 90),
        (cx - 110, cy + 60),
        (cx - 40, cy + 25),
        (cx - 10, cy + 100),
    ]
    draw.polygon([plane_pts[0], plane_pts[1], plane_pts[2]], fill=(255, 255, 255, 80), outline=(255, 255, 255, 180), width=2)
    draw.polygon([plane_pts[0], plane_pts[2], plane_pts[3]], fill=(170, 200, 255, 55), outline=(255, 255, 255, 140), width=2)
    draw.polygon([plane_pts[0], plane_pts[1], plane_pts[3]], outline=(255, 255, 255, 100), width=1)
    
    draw.arc([cx - 280, cy - 60, cx + 80, cy + 260], start=80, end=210, fill=(140, 210, 255, 140), width=3)
    draw.ellipse([cx + 120 - 10, cy - 90 - 10, cx + 120 + 10, cy - 90 + 10], fill=(255, 255, 255, 255), outline=(90, 180, 255, 255), width=3)
    
    im = Image.alpha_composite(im, draw_layer)
    im = add_floating_particles(im, [(300, 280, 8, 140), (540, 360, 6, 120), (240, 630, 9, 100)])
    im.save(os.path.join(out_dir, "direct-communication.png"))
    print("Saved direct-communication.png")

make_card_1()
make_card_2()
make_card_3()
make_card_4()
make_card_5()
print("All 5 cards generated successfully!")
