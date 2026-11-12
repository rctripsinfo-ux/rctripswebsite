import sys, os, subprocess
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; out = sys.argv[2]; title = sys.argv[3]; shots = [x.split("|") for x in sys.argv[4:]]
F = lambda n, s: ImageFont.truetype(f"{S}/fonts/{n}", s)
def src(c):
    for p in (f"{S}/footage/stk/{c}.mp4", f"{S}/drive2/proxy/{c}.mp4", f"{S}/footage/proxy/{c}.mp4", f"{S}/footage/{c}.mp4"):
        if os.path.exists(p): return p
tiles = []
for i, (c, ss, label) in enumerate(shots):
    tmp = f"{S}/storyboard/_t.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", ss, "-i", src(c), "-frames:v", "1", "-vf", "scale=270:480:force_original_aspect_ratio=increase,crop=270:480,eq=contrast=1.08:saturation=1.18", tmp])
    im = Image.open(tmp).convert("RGB"); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 270, 34), fill=(0, 0, 0)); d.text((8, 4), f"{i+1}. {'STOCK' if c.startswith(('p','man/')) else 'HAMARI'}", font=F("Poppins-Bold.woff", 20), fill=(247, 231, 51) if not c.startswith(('p','man/')) else (255, 255, 255))
    if label:
        f = F("Anton-Regular.ttf", 30); w = d.textlength(label, font=f); d.rectangle(((270 - w) / 2 - 8, 400, (270 + w) / 2 + 8, 444), fill=(0, 0, 0)); d.text(((270 - w) / 2, 402), label, font=f, fill=(255, 255, 255))
    tiles.append(im)
cols = 5; rows = (len(tiles) + cols - 1) // cols
sh = Image.new("RGB", (cols * 280 + 10, rows * 490 + 70), "white"); ImageDraw.Draw(sh).text((12, 14), title, font=F("Poppins-Bold.woff", 34), fill="black")
for i, t in enumerate(tiles): sh.paste(t, (10 + (i % cols) * 280, 70 + (i // cols) * 490))
sh.save(out, quality=88)
