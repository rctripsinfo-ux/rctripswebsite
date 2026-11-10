import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, out = sys.argv[1], sys.argv[2]
F = lambda n, s: ImageFont.truetype(S + "/fonts/" + n, s)
P = {"t1": "Kanatal ", "t2": "Tehri", "sub": "2N/3D  •  Every Weekend from Delhi", "price": "₹6,800",
     "inc": ["Stay • Meals • Zipline • Sky Cycling", "Bonfire • Tehri Boating • Trip Captain"]}
if len(sys.argv) > 3: exec(open(sys.argv[3]).read(), {}, P)
Y = (230, 255, 43); W = (255, 255, 255); K = (0, 0, 0)
im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 175)); d = ImageDraw.Draw(im)
def c(y, t, f, fill):
    w = d.textlength(t, font=f); d.text(((1080 - w) / 2, y), t, font=f, fill=fill)
lg = Image.open(S + "/logo/rc.jpg").convert("RGBA").resize((210, 210))
im.paste(lg, (435, 290))
t1, t2 = P["t1"], P["t2"]; sz = 150
while d.textlength(t1 + t2, font=F("Bricolage-800.woff", sz)) > 820: sz -= 4
ft = F("Bricolage-800.woff", sz); w = d.textlength(t1 + t2, font=ft); x = (1080 - w) / 2
d.text((x, 540), t1, font=ft, fill=Y); d.text((x + d.textlength(t1, font=ft), 540), t2, font=ft, fill=W)
c(712, P["sub"], F("Poppins-SemiBold.ttf", 36), W)
R = (225, 29, 42)
if P.get("date"):
    fdt = F("Poppins-ExtraBold.ttf", 40); t = P["date"]; w = d.textlength(t, font=fdt) + 104; x0 = (1080 - w) / 2
    d.rounded_rectangle((x0, 772, x0 + w, 842), 35, fill=R)
    d.text((x0 + 20, 782), chr(0xe878), font=F("MIcons.woff", 46), fill=W); d.text((x0 + 70, 781), t, font=fdt, fill=W)
fp = F("Poppins-ExtraBold.ttf", 92)
d.rounded_rectangle((210, 868, 870, 1028), 40, fill=Y, outline=K, width=5)
fo = F("Poppins-SemiBold.ttf", 34); tw = d.textlength("ONLY", font=fo) + 20 + d.textlength(P["price"], font=fp); x = (1080 - tw) / 2
d.text((x, 926), "ONLY", font=fo, fill=K); d.text((x + d.textlength("ONLY", font=fo) + 20, 890), P["price"], font=fp, fill=K)
c(1052, P["inc"][0], F("Poppins-SemiBold.ttf", 34), W)
c(1098, P["inc"][1], F("Poppins-SemiBold.ttf", 34), W)
fw = F("Poppins-ExtraBold.ttf", 44)
d.rounded_rectangle((180, 1165, 900, 1260), 48, fill=(37, 211, 102))
d.text((215, 1180), chr(0xe0b7), font=F("MIcons.woff", 62), fill=W); d.text((300, 1183), "Book on WhatsApp", font=fw, fill=W)
c(1282, "+91 99109 85862", F("Poppins-ExtraBold.ttf", 80), Y)
c(1400, "rctrips.com", F("Poppins-SemiBold.ttf", 44), W)
im.save(out)
