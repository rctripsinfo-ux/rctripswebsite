import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, out = sys.argv[1], sys.argv[2]
F = lambda n, s: ImageFont.truetype(S + "/fonts/" + n, s)
Y = (230, 255, 43); W = (255, 255, 255); K = (0, 0, 0)
im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 175)); d = ImageDraw.Draw(im)
def c(y, t, f, fill):
    w = d.textlength(t, font=f); d.text(((1080 - w) / 2, y), t, font=f, fill=fill)
lg = Image.open(S + "/logo/rc.jpg").convert("RGBA").resize((210, 210))
m = Image.new("L", (210, 210), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 209, 209), 30, fill=255); im.paste(lg, (435, 290), m)
ft = F("Bricolage-800.woff", 150); t1, t2 = "Kanatal ", "Tehri"
w = d.textlength(t1 + t2, font=ft); x = (1080 - w) / 2
d.text((x, 540), t1, font=ft, fill=Y); d.text((x + d.textlength(t1, font=ft), 540), t2, font=ft, fill=W)
c(735, "2N/3D  •  Every Weekend from Delhi", F("Poppins-SemiBold.ttf", 36), W)
fp = F("Poppins-ExtraBold.ttf", 92)
d.rounded_rectangle((210, 820, 870, 980), 40, fill=Y, outline=K, width=5)
d.text((300, 878), "ONLY", font=F("Poppins-SemiBold.ttf", 34), fill=K); d.text((410, 842), "₹6,800", font=fp, fill=K)
c(1010, "Stay • Meals • Zipline • Sky Cycling", F("Poppins-SemiBold.ttf", 34), W)
c(1060, "Bonfire • Tehri Boating • Trip Captain", F("Poppins-SemiBold.ttf", 34), W)
fw = F("Poppins-ExtraBold.ttf", 44)
d.rounded_rectangle((180, 1170, 900, 1270), 50, fill=(37, 211, 102))
d.text((215, 1186), chr(0xe0b7), font=F("MIcons.woff", 62), fill=W); d.text((300, 1190), "Book on WhatsApp", font=fw, fill=W)
c(1295, "+91 72900 12474", F("Poppins-ExtraBold.ttf", 80), Y)
c(1420, "rctrips.com", F("Poppins-SemiBold.ttf", 44), W)
im.save(out)
