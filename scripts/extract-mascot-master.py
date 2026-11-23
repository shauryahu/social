import numpy as np
from PIL import Image, ImageDraw, ImageFilter

img_path = r"C:\Users\USER\.gemini\antigravity\brain\da496d37-3ff2-4b7f-9011-fb4d0e692a91\.user_uploaded\media_1794959459804_904aae7b.jpg"
orig = Image.open(img_path).convert("RGB")
w, h = orig.size
arr = np.array(orig, dtype=np.float32)

# Background surface fit
xs = (np.arange(w) - w/2) / (w/2)
ys = (np.arange(h) - h/2) / (h/2)
grid_x, grid_y = np.meshgrid(xs, ys)
basis = np.stack([np.ones_like(grid_x), grid_x, grid_y, grid_x**2, grid_y**2, grid_x * grid_y], axis=-1)

bg_mask = np.zeros((h, w), dtype=bool)
bg_mask[0:80, :] = True
bg_mask[-80:, :] = True
bg_mask[:, 0:130] = True
bg_mask[:, -130:] = True

X_bg = basis[bg_mask]
bg_surface = np.zeros_like(arr)
for ch in range(3):
    y_bg = arr[:, :, ch][bg_mask]
    coeffs, _, _, _ = np.linalg.lstsq(X_bg, y_bg, rcond=None)
    bg_surface[:, :, ch] = np.dot(basis, coeffs)

# Landmarks for Head Spline
landmarks = [
    (505, 188), # Top center dip
    (435, 178), # Left ear inner slope
    (365, 150), # Left ear tip
    (312, 215), # Left ear outer slope
    (276, 275), # Left ear base / upper cheek
    (264, 380), # Left mid cheek
    (308, 498), # Left jaw
    (395, 555), # Left chin
    (505, 574), # Chin bottom
    (615, 555), # Right chin
    (702, 498), # Right jaw
    (746, 380), # Right mid cheek
    (734, 275), # Right upper cheek
    (698, 215), # Right ear outer slope
    (645, 150), # Right ear tip
    (575, 178), # Right ear inner slope
]

def catmull_rom_spline(pts, num_samples=30):
    res = []
    M = len(pts)
    for i in range(M):
        p0 = pts[(i - 1) % M]
        p1 = pts[i]
        p2 = pts[(i + 1) % M]
        p3 = pts[(i + 2) % M]

        for t in np.linspace(0, 1, num_samples, endpoint=False):
            t2 = t * t
            t3 = t2 * t
            x = 0.5 * ((2*p1[0]) + (-p0[0] + p2[0])*t + (2*p0[0] - 5*p1[0] + 4*p2[0] - p3[0])*t2 + (-p0[0] + 3*p1[0] - 3*p2[0] + p3[0])*t3)
            y = 0.5 * ((2*p1[1]) + (-p0[1] + p2[1])*t + (2*p0[1] - 5*p1[1] + 4*p2[1] - p3[1])*t2 + (-p0[1] + 3*p1[1] - 3*p2[1] + p3[1])*t3)
            res.append((x, y))
    return res

spline_pts = catmull_rom_spline(landmarks, num_samples=50)

# Create 4x supersampled mask for ultra-crisp antialiasing
SS = 4
mask_ss = Image.new("L", (w * SS, h * SS), 0)
mask_draw = ImageDraw.Draw(mask_ss)

spline_ss = [(p[0] * SS, p[1] * SS) for p in spline_pts]
mask_draw.polygon(spline_ss, fill=255)

# Left wing pill in SS coords
# from (236, 335) to (180, 455), radius 36
lw_p1 = (236 * SS, 335 * SS)
lw_p2 = (180 * SS, 455 * SS)
lw_r = 36 * SS
mask_draw.line([lw_p1, lw_p2], fill=255, width=lw_r * 2)
mask_draw.ellipse([lw_p1[0]-lw_r, lw_p1[1]-lw_r, lw_p1[0]+lw_r, lw_p1[1]+lw_r], fill=255)
mask_draw.ellipse([lw_p2[0]-lw_r, lw_p2[1]-lw_r, lw_p2[0]+lw_r, lw_p2[1]+lw_r], fill=255)

# Right wing pill in SS coords
# from (764, 335) to (820, 455), radius 36
rw_p1 = (764 * SS, 335 * SS)
rw_p2 = (820 * SS, 455 * SS)
rw_r = 36 * SS
mask_draw.line([rw_p1, rw_p2], fill=255, width=rw_r * 2)
mask_draw.ellipse([rw_p1[0]-rw_r, rw_p1[1]-rw_r, rw_p1[0]+rw_r, rw_p1[1]+rw_r], fill=255)
mask_draw.ellipse([rw_p2[0]-rw_r, rw_p2[1]-rw_r, rw_p2[0]+rw_r, rw_p2[1]+rw_r], fill=255)

# Downscale supersampled mask to 1x with high-quality box/lanczos filtering
mask_1x = mask_ss.resize((w, h), Image.Resampling.LANCZOS)
alpha = np.array(mask_1x, dtype=np.float32) / 255.0

# Decontaminate background color
fg = np.zeros_like(arr)
for ch in range(3):
    I_ch = arr[:, :, ch]
    B_ch = bg_surface[:, :, ch]
    valid = alpha > 0.02
    fg_ch = np.zeros_like(I_ch)
    fg_ch[valid] = np.clip((I_ch[valid] - (1.0 - alpha[valid]) * B_ch[valid]) / np.maximum(alpha[valid], 0.08), 0, 255)
    fg[:, :, ch] = fg_ch

rgba = np.dstack([fg.astype(np.uint8), (alpha * 255).astype(np.uint8)])
final_img = Image.fromarray(rgba, mode="RGBA")

# Crop tight
alpha_arr = rgba[:, :, 3]
rows = np.any(alpha_arr > 10, axis=1)
cols = np.any(alpha_arr > 10, axis=0)
ymin, ymax = np.where(rows)[0][[0, -1]]
xmin, xmax = np.where(cols)[0][[0, -1]]

pad = 16
ymin = max(0, ymin - pad)
ymax = min(h, ymax + pad)
xmin = max(0, xmin - pad)
xmax = min(w, xmax + pad)

cropped = final_img.crop((xmin, ymin, xmax, ymax))
cropped.save(r"d:\social-main\public\images\robot-mascot.png")

dark_bg = Image.new("RGBA", cropped.size, (13, 14, 22, 255))
dark_preview = Image.alpha_composite(dark_bg, cropped)
dark_preview.save(r"d:\social-main\public\previews\mascot_master_dark.png")
print(f"Master extraction complete! Size: {cropped.size}")
