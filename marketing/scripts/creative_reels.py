# Animated creative reels: base clips (beat-cut) + per-frame PIL overlay + music. Usage: python3 creative_reels.py S <v1|v2|v3>
import sys, os, json, math, random, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S = sys.argv[1]; which = sys.argv[2]; FPS = 30
F = lambda n, s: ImageFont.truetype(f"{S}/fonts/{n}", s)
YL = (247, 231, 51); W = (255, 255, 255); K = (15, 15, 15); RED = (226, 35, 26); CREAM = (250, 243, 228)
BEATS = json.load(open(S + "/music_trend/beats.json"))
LOGO = Image.open(S + "/logo/rc.jpg").convert("RGBA").resize((86, 86))
def src(c):
    for p in (f"{S}/drive2/proxy/{c}.mp4", f"{S}/footage/proxy/{c}.mp4"):
        if os.path.exists(p): return p
def dims(p):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", p], capture_output=True, text=True).stdout.strip().split(",")
    return int(o[0]), int(o[1])
def build_base(R, shots):
    segs = []
    for i, (c, ss, d, fx) in enumerate(shots):
        p = src(c); w, h = dims(p)
        vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" if h >= w else \
             "split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2"
        vf += f",scale=w='trunc(1080*(1+0.07*t/{d:.3f})/2)*2':h=-2:eval=frame,crop=1080:1920,fps={FPS},setsar=1,eq=saturation=1.12:contrast=1.05"
        if "dark" in fx: vf += ",boxblur=10:2,eq=brightness=-0.18"
        if "cam" in fx: vf += ",eq=saturation=0.85:gamma_r=1.06:gamma_b=0.94:brightness=-0.12,noise=alls=5:allf=t"
        if "dim" in fx: vf += ",eq=brightness=-0.08"
        if "flash" in fx: vf += ",eq=brightness='0.45*max(0\\,1-t/0.12)':eval=frame"
        o = f"{R}s{i:02d}.mp4"; segs.append(o)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-i", p, "-t", f"{d:.3f}", "-vf", vf, "-an", "-c:v", "libx264", "-crf", "17", "-preset", "veryfast", o], check=True)
    open(R + "l.txt", "w").write("".join(f"file '{s}'\n" for s in segs))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", R + "l.txt", "-c", "copy", R + "base.mp4"], check=True)
def beat_bounds(key, ss, start_t, n, step):
    b = [x - ss for x in BEATS[key] if x - ss >= start_t - 0.02]; return [b[i * step] for i in range(n + 1)]
ease = lambda x: 1 - (1 - min(max(x, 0), 1)) ** 3
def pop(x):  # 0..1 -> overshoot scale
    x = min(max(x, 0), 1); return 1 + 0.15 * math.sin(x * math.pi) if x < 1 else 1
def paste_scaled(im, layer, cx, cy, sc, alpha=1.0):
    if sc <= 0.01 or alpha <= 0: return
    l = layer.resize((max(1, int(layer.width * sc)), max(1, int(layer.height * sc))), Image.BICUBIC)
    if alpha < 1: a = l.split()[3].point(lambda v: int(v * alpha)); l.putalpha(a)
    im.alpha_composite(l, (int(cx - l.width / 2), int(cy - l.height / 2)))
def text_layer(t, f, fill, box=None, pad=(26, 10), shadow=True):
    tmp = ImageDraw.Draw(Image.new("RGBA", (1, 1))); bb = tmp.textbbox((0, 0), t, font=f); w, h = bb[2] - bb[0], bb[3] - bb[1]
    L = Image.new("RGBA", (w + pad[0] * 2 + 20, h + pad[1] * 2 + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    if box: d.rounded_rectangle((10, 10, 10 + w + pad[0] * 2, 10 + h + pad[1] * 2), box[1], fill=box[0])
    elif shadow:
        sh = Image.new("RGBA", L.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((10 + pad[0] - bb[0] + 3, 10 + pad[1] - bb[1] + 5), t, font=f, fill=(0, 0, 0, 190)); L.alpha_composite(sh.filter(ImageFilter.GaussianBlur(7)))
    d.text((10 + pad[0] - bb[0], 10 + pad[1] - bb[1]), t, font=f, fill=fill); return L
def render(R, T, overlay_fn, music, music_ss, out):
    os.makedirs(R + "ov", exist_ok=True)
    for f in os.listdir(R + "ov"): os.remove(R + "ov/" + f)
    N = int(T * FPS)
    for n in range(N):
        im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); overlay_fn(im, n / FPS); im.save(f"{R}ov/{n:04d}.png", compress_level=1)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", R + "base.mp4", "-framerate", str(FPS), "-i", R + "ov/%04d.png", "-ss", str(music_ss), "-t", f"{T:.2f}", "-i", music,
        "-filter_complex", f"[0:v][1:v]overlay=0:0:shortest=1[v];[2:a]afade=t=in:d=0.15,afade=t=out:st={T-1.3:.2f}:d=1.3,loudnorm=I=-14:TP=-1.5[a]",
        "-map", "[v]", "-map", "[a]", "-t", f"{T:.2f}", "-c:v", "libx264", "-b:v", "9M", "-maxrate", "11M", "-bufsize", "18M", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
    print(out, round(T, 2))
def logo(im): im.alpha_composite(LOGO, (850, 262))

# ---------------- V1: WhatsApp chat -> 2 ghante baad (Alfaaz) ----------------
if which == "v1":
    R = S + "/render/creative/v1/"; os.makedirs(R, exist_ok=True)
    REV = 5.6; key = "signal"; mss = 28.12 - REV
    clips = [("IMG_1611", 4), ("IMG_1613", 2), ("IMG_1614", 5), ("IMG_2098", 10), ("IMG_1615", 2), ("IMG_2234", 1), ("IMG_1616", 8), ("IMG_1440", 3)]
    bb = beat_bounds(key, mss, REV, len(clips), 2); T = bb[-1] + 1.6
    shots = [("IMG_1611", 0.5, REV, "dark")] + [(c, ss, bb[i + 1] - bb[i] + (1.6 if i == len(clips) - 1 else 0), "flash" if i == 0 else "") for i, (c, ss) in enumerate(clips)]
    build_base(R, shots)
    hf = F("Montserrat-ExtraBold.woff", 40); sf = F("Montserrat-Medium.woff", 24); nf = F("Montserrat-ExtraBold.woff", 24); mf = F("Poppins-Bold.woff", 40)
    head = Image.new("RGBA", (840, 100), (0, 0, 0, 0)); hd = ImageDraw.Draw(head); hd.rounded_rectangle((0, 0, 839, 99), 24, fill=(7, 94, 84))
    hd.ellipse((22, 18, 86, 82), fill=(37, 211, 102)); hd.text((40, 26), "RC", font=F("Montserrat-ExtraBold.woff", 26), fill=W)
    hd.text((104, 16), "Kanatal Trip 27 Nov", font=hf, fill=W); hd.text((104, 62), "Riya, Aman, Sneha, Captain +17", font=sf, fill=(200, 230, 225))
    msgs = [(0.9, "l", "Riya", "Hi sab, main Noida se"), (1.8, "l", "Aman", "Kisi ko jaanta nahi yaha"), (2.6, "r", "", "same 😂"), (3.4, "l", "Sneha", "Bus mein awkward hoga kya?"), (4.4, "l", "Captain", "Bas 2 ghante ruko...")]
    def bubble(side, n, t):
        t = t.replace(" 😂", " haha"); w = int(ImageDraw.Draw(Image.new("RGBA", (1, 1))).textlength(t, font=mf)) + 54; h = 112 if n else 82
        L = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(L); d.rounded_rectangle((0, 0, w - 1, h - 1), 22, fill=W if side == "l" else (220, 248, 198))
        if n: d.text((26, 10), n, font=nf, fill=(7, 140, 120) if n != "Captain" else RED); d.text((26, 44), t, font=mf, fill=K)
        else: d.text((26, 16), t, font=mf, fill=K)
        return L
    B = [(t0, side, bubble(side, n, t)) for t0, side, n, t in msgs]
    l2 = text_layer("2 GHANTE BAAD:", F("Montserrat-ExtraBold.woff", 86), K, box=(YL, 0))
    end1 = text_layer("Pehle strangers,", F("Gloock.woff", 96), W); end2 = text_layer("ab family.", F("Gloock.woff", 120), YL)
    cta = text_layer("Next trip 27 Nov • Comment TRIP", F("Montserrat-ExtraBold.woff", 40), K, box=(W, 34))
    def ov(im, t):
        logo(im)
        if t < REV:
            k = ease(t / 0.4); im.alpha_composite(head, (120, int(300 - 60 * (1 - k))))
            y = 440
            for t0, side, L in B:
                if t >= t0:
                    sc = pop((t - t0) / 0.25) if t - t0 < 0.25 else 1; x = 130 if side == "l" else 950 - L.width
                    paste_scaled(im, L, x + L.width / 2, y + L.height / 2, sc * min(1, (t - t0) / 0.12 + 0.5))
                y += L.height + 22
            if t > 4.4 and int(t * 4) % 2 == 0: ImageDraw.Draw(im).text((140, y + 6), "Captain is typing...", font=F("Poppins-MediumItalic.woff", 30), fill=(230, 230, 230))
        else:
            u = t - REV
            if u < 3.2: paste_scaled(im, l2, 540, 430, pop(u / 0.3) if u < 0.3 else 1)
            if t > T - 4.0:
                v = t - (T - 4.0); paste_scaled(im, end1, 540, 420, 1, min(1, v / 0.3)); paste_scaled(im, end2, 540, 545, pop((v - 0.4) / 0.3) if v > 0.4 else 0)
                if v > 1.0: paste_scaled(im, cta, 540, 1430, 1, min(1, (v - 1.0) / 0.3))
    render(R, T, ov, S + "/music_trend/signal.mp3", mss, S + "/render/creative/13Nov_9AM_WhatsAppChat_Signal.mp4")

# ---------------- V2: Camcorder POV (Shaam Shaandaar) ----------------
if which == "v2":
    R = S + "/render/creative/v2/"; os.makedirs(R, exist_ok=True)
    key = "shaam1"; mss = 19.41
    clips = [("IMG_1617", 1), ("IMG_1618", 3), ("IMG_1620", 5), ("IMG_1612", 0.5), ("IMG_1448", 0.3), ("IMG_1449", 2.5), ("IMG_1623", 0.3), ("IMG_1630", 9)]
    bb = beat_bounds(key, mss, 0, len(clips), 4); T = bb[-1] + 0.8
    shots = [(c, ss, bb[i + 1] - bb[i] + (0.8 if i == len(clips) - 1 else 0), "cam") for i, (c, ss) in enumerate(clips)]
    build_base(R, shots)
    m = F("SpaceMono-Bold.woff", 44)
    pov = text_layer("POV:", F("Montserrat-ExtraBold.woff", 76), W); a1 = text_layer("subah 6 baje", F("Gloock.woff", 118), W); a2 = text_layer("badalon ke andar", F("Gloock.woff", 112), YL)
    b1 = text_layer("Kanatal", F("Gloock.woff", 200), YL); b2 = text_layer("Delhi se sirf 1 raat door", F("Poppins-MediumItalic.woff", 52), W)
    cta = text_layer("27–29 Nov • Comment KANATAL", F("Montserrat-ExtraBold.woff", 40), K, box=(YL, 0))
    SW = bb[4]
    def ov(im, t):
        d = ImageDraw.Draw(im)
        for (x, y, dx, dy) in [(130, 300, 1, 1), (950, 300, -1, 1), (130, 1540, 1, -1), (950, 1540, -1, -1)]:
            d.line((x, y, x + 70 * dx, y), fill=W, width=6); d.line((x, y, x, y + 70 * dy), fill=W, width=6)
        if int(t * 2) % 2 == 0: d.ellipse((170, 392, 204, 426), fill=RED)
        d.text((220, 380), "REC", font=m, fill=W); s = int(t); d.text((640, 380), f"00:{s // 60:02d}:{s % 60:02d}".replace("00:00:", "00:00:"), font=m, fill=W)
        ts = 6 * 3600 + 12 * 60 + int(t); d.text((170, 1450), f"27 NOV 2026  {ts // 3600:02d}:{ts // 60 % 60:02d}:{ts % 60:02d} AM", font=m, fill=W)
        d.rectangle((790, 1405, 900, 1440), outline=W, width=4); d.rectangle((798, 1413, 870, 1432), fill=W); d.text((170, 1395), "KANATAL, UK", font=m, fill=YL)
        logo(im)
        if t < SW:
            paste_scaled(im, pov, 540, 820, 1, min(1, t / 0.25))
            if t > 0.7: paste_scaled(im, a1, 540, 925, pop((t - 0.7) / 0.3) if t < 1.0 else 1)
            if t > 2.6: paste_scaled(im, a2, 540, 1060, pop((t - 2.6) / 0.3) if t < 2.9 else 1)
        else:
            u = t - SW; paste_scaled(im, b1, 540, 820, pop(u / 0.3) if u < 0.3 else 1)
            if u > 0.6: paste_scaled(im, b2, 540, 960, 1, min(1, (u - 0.6) / 0.3))
            if u > 2.0: paste_scaled(im, cta, 540, 1250, pop((u - 2.0) / 0.3) if u < 2.3 else 1)
    render(R, T, ov, S + "/music_trend/shaam1.mp3", mss, S + "/render/creative/13Nov_2PM_CamcorderPOV_ShaamShaandaar.mp4")

# ---------------- V3: Boarding pass offer (Badtameez Dil) ----------------
if which == "v3":
    R = S + "/render/creative/v3/"; os.makedirs(R, exist_ok=True)
    P1 = 5.4; key = "badtameez"; mss = 45.02 - P1
    clips = [("kanA_015", 3), ("kanB_001", 4), ("kanB_006", 3), ("IMG_1444", 0.3), ("kanA_002", 1), ("IMG_1630", 10), ("tehri_013", 10), ("kanB_028", 1), ("kanA_010", 2), ("kanB_018", 1)]
    bb = beat_bounds(key, mss, P1, len(clips), 2); T = bb[-1] + 2.6
    shots = [("IMG_1449", 1.5, P1, "dim")] + [(c, ss, bb[i + 1] - bb[i] + (2.6 if i == len(clips) - 1 else 0), "flash" if i == 0 else "") for i, (c, ss) in enumerate(clips)]
    build_base(R, shots)
    # ticket
    card = Image.new("RGBA", (900, 560), (0, 0, 0, 0)); cd = ImageDraw.Draw(card); cd.rounded_rectangle((0, 0, 899, 559), 36, fill=CREAM)
    cd.rounded_rectangle((0, 0, 899, 120), 36, fill=RED); cd.rectangle((0, 80, 899, 120), fill=CREAM)
    cd.text((40, 22), "BOARDING PASS", font=F("Montserrat-ExtraBold.woff", 44), fill=W); cd.text((640, 30), "RC TRIPS", font=F("Montserrat-ExtraBold.woff", 36), fill=W)
    cd.text((40, 150), "DEL", font=F("Montserrat-ExtraBold.woff", 120), fill=K); cd.text((560, 150), "KNT", font=F("Montserrat-ExtraBold.woff", 120), fill=K)
    cd.text((40, 280), "Delhi", font=F("Poppins-MediumItalic.woff", 34), fill=(90, 90, 90)); cd.text((560, 280), "Kanatal", font=F("Poppins-MediumItalic.woff", 34), fill=(90, 90, 90))
    cd.line((330, 215, 520, 215), fill=K, width=4); cd.polygon([(520, 215), (495, 200), (495, 230)], fill=K)
    for i, (k_, v) in enumerate([("PASSENGER", "You + 20"), ("DATE", "27–29 NOV"), ("SEAT", "Window ;)")]):
        x = 40 + i * 290; cd.text((x, 350), k_, font=F("Montserrat-Medium.woff", 26), fill=(110, 110, 110)); cd.text((x, 385), v, font=F("Montserrat-ExtraBold.woff", 38), fill=K)
    cd.line((40, 460, 860, 460), fill=(180, 170, 150), width=2); random.seed(3)
    for i in range(60): x = 40 + i * 13.5; cd.rectangle((x, 480, x + random.choice([3, 5, 8]), 530), fill=K)
    card = card.rotate(5, expand=True, resample=Image.BICUBIC)
    shd = Image.new("RGBA", card.size, (0, 0, 0, 0)); shd.paste((0, 0, 0, 120), (0, 0), card.split()[3]); shd = shd.filter(ImageFilter.GaussianBlur(18))
    stamp = Image.new("RGBA", (380, 150), (0, 0, 0, 0)); sd = ImageDraw.Draw(stamp); sd.rounded_rectangle((5, 5, 374, 144), 18, outline=RED, width=10); sd.text((40, 30), "BOOKED", font=F("Montserrat-ExtraBold.woff", 76), fill=RED); stamp = stamp.rotate(-14, expand=True, resample=Image.BICUBIC)
    t1 = text_layer("Your seat is", F("Poppins-MediumItalic.woff", 56), W); t2 = text_layer("confirmed.", F("Gloock.woff", 130), YL)
    price = text_layer("₹6,800 • 2N/3D • Zipline, bonfire, Tehri", ImageFont.truetype(S + "/fonts/Poppins-ExtraBold.ttf", 38), W)
    strip = text_layer("DELHI to KANATAL  |  27–29 NOV  |  ₹6,800", ImageFont.truetype(S + "/fonts/Poppins-ExtraBold.ttf", 40), K, box=(YL, 0), pad=(30, 14))
    e1 = text_layer("Comment", F("Poppins-MediumItalic.woff", 60), W); e2 = text_layer("KANATAL", F("Montserrat-ExtraBold.woff", 130), K, box=(YL, 0)); e3 = text_layer("WhatsApp 99109 85862", ImageFont.truetype(S + "/fonts/Poppins-ExtraBold.ttf", 44), W)
    def ov(im, t):
        logo(im)
        if t < P1:
            paste_scaled(im, t1, 540, 400, 1, min(1, t / 0.25))
            if t > 0.4: paste_scaled(im, t2, 540, 500, pop((t - 0.4) / 0.3) if t < 0.7 else 1)
            k = ease((t - 0.9) / 0.6); y = int(1920 + (760 - 1920) * k)
            if t > 0.9: im.alpha_composite(shd, (95, y + 20)); im.alpha_composite(card, (80, y))
            if t > 2.4: paste_scaled(im, stamp, 780, y + 120, 1.6 - 0.6 * ease((t - 2.4) / 0.2), min(1, (t - 2.4) / 0.1))
            if t > 3.2: paste_scaled(im, price, 540, 1420, 1, min(1, (t - 3.2) / 0.3))
        elif t < T - 2.6:
            paste_scaled(im, strip, 540, 1440, 1)
        else:
            u = t - (T - 2.6); im.alpha_composite(Image.new("RGBA", im.size, (0, 0, 0, int(110 * min(1, u / 0.3)))))
            paste_scaled(im, e1, 540, 760, 1, min(1, u / 0.25)); paste_scaled(im, e2, 540, 890, pop((u - 0.2) / 0.3) if u < 0.5 else (1 if u > 0.2 else 0))
            if u > 0.6: paste_scaled(im, e3, 540, 1040, 1, min(1, (u - 0.6) / 0.3)); paste_scaled(im, strip, 540, 1440, 1)
    render(R, T, ov, S + "/music_trend/badtameez.mp3", mss, S + "/render/creative/13Nov_8PM_BoardingPass_BadtameezDil.mp4")
