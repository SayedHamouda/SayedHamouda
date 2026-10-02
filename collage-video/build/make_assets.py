# Generates collage textures (crumpled paper, torn scraps, tape, halftone) and halftone cutouts.
import numpy as np, os
from PIL import Image, ImageFilter, ImageDraw, ImageOps, ImageChops
rng = np.random.default_rng(3)
EMO = 'build/node_modules/@lobehub/fluent-emoji-3d/assets/'
OUT = 'assets/'

def fbm(w, h, octaves=6, base=4, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((h, w)); amp = 1.; tot = 0
    for o in range(octaves):
        s = base * 2 ** o
        small = r.random((max(2, int(h / w * s)) + 1, s + 1))
        im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += np.asarray(im, float) / 255 * amp; tot += amp; amp *= .5
    return acc / tot

def crumple(w, h, seed=0, strength=1.):
    r = np.random.default_rng(seed + 100)
    sw, sh = max(2, w // 4), max(2, h // 4)
    n = int(70 * (w * h) / (1080 * 1920)) + 12
    px, py = r.random(n) * sw, r.random(n) * sh
    shade = r.normal(0, 1, n)
    yy, xx = np.mgrid[0:sh, 0:sw]
    d = (xx[..., None] - px) ** 2 + (yy[..., None] - py) ** 2
    idx = np.argsort(d, -1)[..., :2]
    d1 = np.take_along_axis(d, idx[..., :1], -1)[..., 0] ** .5; d2 = np.take_along_axis(d, idx[..., 1:2], -1)[..., 0] ** .5
    fac = shade[idx[..., 0]]
    crease = np.exp(-((d2 - d1) / 1.2) ** 2)          # thin lines at facet borders
    m = fac * .55 - crease * .9
    im = Image.fromarray(((np.clip(m, -3, 3) + 3) / 6 * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.2))
    L = (np.asarray(im, float) / 255 * 6 - 3) / 3
    L += (fbm(w, h, 5, 8, seed) - .5) * .5
    return np.clip(L * strength, -1, 1)

def paper(w, h, tone=(236, 234, 229), seed=0, strength=1., grain=6):
    L = crumple(w, h, seed, strength)
    base = np.array(tone, float)[None, None, :]
    img = base + L[..., None] * 21
    img += rng.normal(0, grain, (h, w, 1))
    return np.clip(img, 0, 255).astype(np.uint8)

def torn_mask(w, h, seed, jag=3.2, pad=14):
    r = np.random.default_rng(seed)
    pts = []
    def edge(x0, y0, x1, y1, n):
        for i in range(n):
            t = i / n; x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t
            nx, ny = (y1 - y0), -(x1 - x0); L = (nx * nx + ny * ny) ** .5 or 1
            d = r.normal(0, jag * .6) + (r.random() < .06) * r.normal(0, jag * 1.6)
            pts.append((x + nx / L * d, y + ny / L * d))
    edge(pad, pad, w - pad, pad, w // 5); edge(w - pad, pad, w - pad, h - pad, h // 5)
    edge(w - pad, h - pad, pad, h - pad, w // 5); edge(pad, h - pad, pad, pad, h // 5)
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon(pts, fill=255)
    return m.filter(ImageFilter.GaussianBlur(.6))

def scrap(name, w, h, tone, seed, grid=None, alpha=255):
    a = paper(w, h, tone, seed, .8, 5)
    im = Image.fromarray(a).convert('RGBA')
    if grid:
        d = ImageDraw.Draw(im); col, step = grid
        for x in range(0, w, step): d.line([(x, 0), (x, h)], fill=col, width=1)
        for y in range(0, h, step): d.line([(0, y), (w, y)], fill=col, width=1)
    m = torn_mask(w, h, seed)
    if alpha < 255: m = m.point(lambda v: v * alpha // 255)
    im.putalpha(m); im.save(OUT + 'tex/' + name + '.png')

def tape(name, w, h, col, seed):
    r = np.random.default_rng(seed)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = [(0, 0)]
    for y in range(0, h + 1, 6): pts.append((r.uniform(0, 8), y))
    left = pts[1:]; right = [(w - r.uniform(0, 8), y) for y in range(h, -1, -6)]
    d.polygon(left + right, fill=col + (215,))
    a = np.asarray(im).astype(float); a[..., :3] += r.normal(0, 8, a[..., :3].shape); im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    im.save(OUT + 'tex/' + name + '.png')

def halftone_stripe(name, w, h, seed):
    r = np.random.default_rng(seed); im = Image.new('L', (w, h), 255); d = ImageDraw.Draw(im)
    for y in range(0, h, 7):
        for x in range(0, w, 7):
            g = (1 - x / w) ** 1.2 + r.normal(0, .06)
            rad = max(0, min(3.9, g * 4.2))
            if rad > .3: d.ellipse([x - rad, y - rad, x + rad, y + rad], fill=0)
    rgba = Image.new('RGBA', (w, h), (20, 20, 20, 0)); rgba.putalpha(ImageOps.invert(im)); rgba.save(OUT + 'tex/' + name + '.png')

# --- base papers ---
Image.fromarray(paper(1080, 1920, (238, 236, 231), 1, 1.0)).save(OUT + 'tex/paper_bg.jpg', quality=92)
Image.fromarray(paper(1080, 1920, (240, 238, 233), 5, 1.2)).save(OUT + 'tex/paper_bg2.jpg', quality=92)
scrap('scrap_white_a', 760, 560, (247, 246, 242), 11)
scrap('scrap_white_b', 600, 820, (246, 245, 241), 12)
scrap('scrap_white_c', 940, 1180, (248, 247, 243), 13)
scrap('scrap_grid_a', 620, 520, (244, 244, 240), 21, ((196, 205, 214, 255), 26))
scrap('scrap_grid_b', 900, 700, (243, 243, 239), 22, ((200, 208, 216, 255), 30))
scrap('scrap_grid_tall', 420, 980, (243, 243, 239), 23, ((200, 208, 216, 255), 28))
scrap('scrap_coral', 640, 520, (240, 140, 120), 31)
scrap('scrap_green', 640, 520, (160, 214, 132), 41)
scrap('scrap_kraft', 700, 360, (214, 196, 160), 51)
scrap('scrap_black', 760, 150, (24, 24, 24), 61)
for i, (w, h) in enumerate([(220, 64), (300, 70), (180, 58)]):
    tape(f'tape_olive_{i}', w, h, (176, 186, 108), 70 + i)
    tape(f'tape_cream_{i}', w, h, (232, 222, 190), 80 + i)
halftone_stripe('halftone_a', 260, 1100, 1); halftone_stripe('halftone_b', 520, 340, 2)

# --- cutouts ---
def dots(w, h, step=7):
    yy, xx = np.mgrid[0:h, 0:w]
    cx = (xx % step) - step / 2; cy = (yy % step) - step / 2
    return np.sqrt(cx * cx + cy * cy) / (step / 2 * 1.41)
def cutout(src, name, size=560, mode='gray', outline=12, contrast=1.35):
    im = Image.open(src).convert('RGBA').resize((size, size), Image.LANCZOS)
    a = im.split()[3]
    g = np.asarray(ImageOps.grayscale(im.convert('RGB')), float) / 255
    g = np.clip((g - .5) * contrast + .55, 0, 1)
    D = dots(size, size, 6)
    ht = np.where(D < (1 - g) * 1.15, 0., 1.)            # halftone screen
    g2 = np.clip(g * .72 + ht * .28 - .06, 0, 1)
    g2 += rng.normal(0, .035, g2.shape)
    if mode == 'gray':
        rgb = np.stack([g2 * 255] * 3, -1) * np.array([1, .99, .96])
    else:  # coral duotone
        lo, mid, hi = np.array([60, 18, 14.]), np.array([240, 106, 82.]), np.array([255, 226, 214.])
        g3 = g2[..., None]; rgb = np.where(g3 < .55, lo + (mid - lo) * (g3 / .55), mid + (hi - mid) * ((g3 - .55) / .45))
    body = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert('RGBA'); body.putalpha(a)
    pad = outline + 20; W = size + pad * 2
    canvas = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    big = Image.new('L', (W, W), 0); big.paste(a, (pad, pad))
    ol = big.filter(ImageFilter.MaxFilter(outline * 2 + 1)).filter(ImageFilter.GaussianBlur(1))
    white = Image.new('RGBA', (W, W), (250, 249, 246, 255)); white.putalpha(ol)
    sh = Image.new('RGBA', (W, W), (0, 0, 0, 0)); shm = ol.filter(ImageFilter.GaussianBlur(10)).point(lambda v: v * .35)
    sh.putalpha(shm); canvas.alpha_composite(sh, (6, 12)); canvas.alpha_composite(white); canvas.alpha_composite(body, (pad, pad))
    canvas.save(OUT + 'cut/' + name + '.png')

C = {'magnifier': '1f50d', 'phone': '1f4f1', 'books': '1f4da', 'trophy': '1f3c6', 'bulb': '1f4a1', 'hourglass': '23f3', 'sleepy': '1f634',
     'student': '1f9d1-200d-1f393', 'girl': '1f469-200d-1f393', 'sprout': '1f331', 'tree': '1f333', 'target': '1f3af', 'offline': '1f4f4',
     'fire': '1f525', 'gift': '1f381', 'scales': '2696-fe0f', 'pencil': '270f-fe0f', 'pin': '1f4cc', 'chart': '1f4c8', 'handshake': '1f91d',
     'brain': '1f9e0', 'memo': '1f4dd', 'puzzle': '1f9e9', 'drop': '1f4a7', 'point': '1f446', 'megaphone': '1f4e3', 'tired': '1f62b', 'yawn': '1f971',
     'tv': '1f4fa', 'compass': '1f9ed', 'clipboard': '1f4cb', 'check': '2705', 'cross': '274c', 'speech': '1f4ac', 'teacher': '1f9d1-200d-1f3eb', 'box': '1f4e6'}
for k, v in C.items():
    cutout(EMO + v + '.webp', k)
for k in ['sleepy', 'trophy', 'fire', 'gift', 'girl', 'target', 'tree', 'bulb', 'phone', 'hourglass', 'magnifier', 'speech']:
    cutout(EMO + C[k] + '.webp', k + '_c', mode='coral')
print('done', len(os.listdir(OUT + 'cut')), len(os.listdir(OUT + 'tex')))
