# Persistent ad overlay (transparent 1080x1920 PNG) inside Meta Reels SAFE ZONE:
# keep text in x 120-960, y 250-1540, and x<=880 for y>720 (right-side buttons).
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, out = sys.argv[1], sys.argv[2]
P = {"title": [("Kanatal", "Y"), ("Tehri", "W")], "tag": "15+ Strangers  •  1 Captain  •  Every Weekend", "price": "₹6,800", "nights": "2N/3D",
     "icons": [(0xe530, "Transport"), (0xe53a, "Stay"), (0xe56c, "Meals"), (0xe412, "Sightseeing"), (0xea52, "Activities"), (0xf0e2, "Captain")]}
if len(sys.argv) > 3 and sys.argv[3] != "1": exec(open(sys.argv[3]).read(), {}, P)
title, tag, price, nights = P["title"], P["tag"], P["price"], P["nights"]
SAFE = sys.argv[-1] == "1"  # draw safe-zone guide for checking
F = lambda n, s: ImageFont.truetype(S + "/fonts/" + n, s)
Y = (230, 255, 43); W = (255, 255, 255); K = (0, 0, 0)
im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
def grad(y0, h, a, up):
    g = Image.new("L", (1, h))
    for y in range(h): g.putpixel((0, y), int(a * ((1 - y / h) if up else (y / h)) ** 1.3))
    im.paste(Image.new("RGBA", (1080, h), (0, 0, 0, 255)), (0, y0), g.resize((1080, h)))
grad(0, 720, 230, True); grad(1000, 920, 200, False)
d = ImageDraw.Draw(im)
def shadow_text(xy, t, f, fill, blur=6, off=(4, 6), a=170):
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((xy[0] + off[0], xy[1] + off[1]), t, font=f, fill=(0, 0, 0, a))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur))); d.text(xy, t, font=f, fill=fill)
# logo (centered, top of safe zone)
lg = Image.open(S + "/logo/rc.jpg").convert("RGBA").resize((112, 112))
im.paste(lg, (484, 262))
# tag line
ft0 = F("Poppins-SemiBold.ttf", 33); w = d.textlength(tag, font=ft0); shadow_text(((1080 - w) / 2, 388), tag, ft0, W)
# title (two colours, fit to 820px)
size = 170
while True:
    ft = F("Bricolage-800.woff", size); parts = [(t + (" " if i < len(title) - 1 else ""), Y if c == "Y" else W) for i, (t, c) in enumerate(title)]
    tw = sum(d.textlength(t, font=ft) for t, _ in parts)
    if tw <= 820: break
    size -= 4
x = (1080 - tw) / 2
for t, c in parts: shadow_text((x, 428), t, ft, c, blur=8, off=(5, 8), a=190); x += d.textlength(t, font=ft)
# price sticker (tilted)
fp = F("Poppins-ExtraBold.ttf", 74); fs = F("Poppins-SemiBold.ttf", 30)
fpp = F("Poppins-SemiBold.ttf", 25); pw = d.textlength(price, font=fp); SW = int(34 + 84 + 12 + pw + 14 + d.textlength("/person", font=fpp) + 34)
st = Image.new("RGBA", (SW, 140), (0, 0, 0, 0)); s = ImageDraw.Draw(st)
s.rounded_rectangle((6, 6, SW - 7, 133), 32, fill=Y, outline=K, width=5)
s.text((34, 52), "ONLY", font=fs, fill=K); s.text((130, 18), price, font=fp, fill=K)
s.text((130 + pw + 14, 54), "/person", font=fpp, fill=K)
st = st.rotate(3, resample=Image.BICUBIC, expand=True)
px = (880 + 120 - st.width) // 2
shs = Image.new("RGBA", st.size, (0, 0, 0, 0)); shs.paste((0, 0, 0, 150), (0, 0), st.split()[3])
im.alpha_composite(shs.filter(ImageFilter.GaussianBlur(10)), (px + 6, 1118)); im.alpha_composite(st, (px, 1108))
# info bar
MI = F("MIcons.woff", 52); fl = F("Poppins-SemiBold.ttf", 19)
icons = P["icons"]
bx0, bx1, by0, by1 = 128, 872, 1312, 1428
fn = F("Poppins-ExtraBold.ttf", 28); nw = d.textlength(nights, font=fn)
d.rounded_rectangle((bx0 + 34, by0 - 42, bx0 + 34 + nw + 32, by0 + 4), 13, fill=K, outline=Y, width=3)
d.text((bx0 + 50, by0 - 40), nights, font=fn, fill=Y)
d.rounded_rectangle((bx0, by0, bx1, by1), 28, fill=(0, 0, 0, 215), outline=Y, width=4)
step = (bx1 - bx0) / len(icons)
for i, (cp, lab) in enumerate(icons):
    cx = bx0 + step * (i + .5); d.text((cx - 26, by0 + 12), chr(cp), font=MI, fill=W)
    lw = d.textlength(lab, font=fl); d.text((cx - lw / 2, by0 + 76), lab, font=fl, fill=W)
# whatsapp CTA
fw = F("Poppins-ExtraBold.ttf", 30); t = "WhatsApp  72900 12474  •  99109 85862"; w = d.textlength(t, font=fw) + 96
x0 = (1000 - w) / 2
d.rounded_rectangle((x0, 1452, x0 + w, 1520), 34, fill=(37, 211, 102))
d.text((x0 + 22, 1460), chr(0xe0b7), font=F("MIcons.woff", 42), fill=W); d.text((x0 + 72, 1462), t, font=fw, fill=W)
if SAFE:
    g = ImageDraw.Draw(im)
    for r in [(0, 0, 1080, 250), (0, 1540, 1080, 1920), (0, 0, 120, 1920), (960, 0, 1080, 1920), (880, 720, 960, 1540)]:
        ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(ov).rectangle(r, fill=(255, 0, 0, 70)); im.alpha_composite(ov)
im.save(out)
