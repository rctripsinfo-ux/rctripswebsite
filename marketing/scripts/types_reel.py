# "Har trip pe ye log milte hi hain": each person plays, then freezes with a shutter click + white flash + tilted sticker label.
import sys, os, json, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S = sys.argv[1]; spec = {"S": S}; exec(open(sys.argv[2]).read(), spec)
R = f"{S}/render/types/{spec['name']}/"; os.makedirs(R + "ov", exist_ok=True); FPS = 30
F = lambda n, s: ImageFont.truetype(f"{S}/fonts/{n}", s)
YL = (247, 231, 51); W = (255, 255, 255); K = (12, 12, 12)
EMO = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", 109)
beats = [b - spec["music_ss"] for b in json.load(open(S + "/music_trend/beats.json"))[spec["music_key"]] if b >= spec["music_ss"] - 0.02]
def src(c):
    for p in (f"{S}/drive2/proxy/{c}.mp4", f"{S}/footage/proxy/{c}.mp4"):
        if os.path.exists(p): return p
def dims(p):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "csv=p=0:s=,", p], capture_output=True, text=True).stdout.replace("\n", ",").strip(",").split(",")
    return int(o[0]), int(o[1]), float(o[2])
GRADE = "eq=contrast=1.06:saturation=1.15,colorbalance=rh=0.03:bh=-0.02"
# timeline
P, Z = spec["play_beats"], spec["freeze_beats"]; bi = spec["intro_beats"]
segs = []; events = []  # (kind, t, data)
# intro clip
c, ss = spec["intro"]; t_intro = beats[bi]; segs.append((c, ss, t_intro, 0, "intro"))
for (c, fz, label, emo) in spec["people"] + [spec["outro"]]:
    last = (c, fz, label, emo) == tuple(spec["outro"]) if isinstance(spec["outro"], (list, tuple)) else False
    zb = spec["outro_freeze_beats"] if last else Z
    t0 = beats[bi]; t1 = beats[bi + P]; t2 = beats[bi + P + zb] if not last else beats[bi + P] + spec["outro_hold"]
    segs.append((c, fz, t1 - t0, t2 - t1, label)); events.append((t1, label, emo, last)); bi += P + zb
T = sum(s[2] + s[3] for s in segs)
# build segments (play then freeze on chosen frame)
files = []
for i, (c, fz, pd, zd, label) in enumerate(segs):
    p = src(c); w, h, dur = dims(p); start = max(0.0, min(fz - pd, dur - pd - 0.05)) if label != "intro" else fz
    vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" if h >= w else \
         "split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2"
    tot = pd + zd
    vf += f",fps={FPS},setsar=1,{GRADE},tpad=stop_mode=clone:stop_duration={zd + 0.05:.3f}"
    vf += f",scale=w='trunc(1080*(1+0.10*max(0\\,1-t/0.2)+if(gte(t\\,{pd:.3f})\\,0.06*min(1\\,(t-{pd:.3f})/0.25)\\,0))/2)*2':h=-2:eval=frame,crop=1080:1920"
    if label == "intro": vf += ",boxblur=8:1,eq=brightness=-0.15"
    o = f"{R}s{i:02d}.mp4"; files.append((o, tot, pd, start))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-i", p, "-t", f"{pd:.3f}", "-vf", vf, "-t", f"{tot:.3f}", "-af", f"apad,atrim=0:{tot:.3f},afade=t=out:st={max(0,pd-0.08):.3f}:d=0.08", "-c:v", "libx264", "-crf", "17", "-preset", "veryfast", "-c:a", "aac", "-ar", "44100", "-ac", "2", o], check=True)
open(R + "l.txt", "w").write("".join(f"file '{f[0]}'\n" for f in files))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", R + "l.txt", "-c:v", "copy", "-c:a", "aac", R + "base.mp4"], check=True)
# overlays
def sticker(label, emo):
    f = F("Anton-Regular.ttf", 92); d0 = ImageDraw.Draw(Image.new("RGBA", (1, 1))); bb = d0.textbbox((0, 0), label, font=f); tw, th = bb[2] - bb[0], bb[3] - bb[1]
    e = Image.new("RGBA", (136, 128), (0, 0, 0, 0)); ImageDraw.Draw(e).text((0, 0), emo, font=EMO, embedded_color=True); e = e.resize((78, 74))
    w = tw + 60 + 90; h = th + 50
    L = Image.new("RGBA", (w + 40, h + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle((20, 20, 20 + w, 20 + h), 22, fill=YL, outline=K, width=6); d.text((50 - bb[0], 20 + 25 - bb[1]), label, font=f, fill=K); L.alpha_composite(e, (50 + tw + 18, 20 + (h - 74) // 2))
    L = L.rotate(spec.get("tilt", 4), expand=True, resample=Image.BICUBIC)
    sh = Image.new("RGBA", L.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 140), (0, 0), L.split()[3]); out = Image.new("RGBA", (L.width + 20, L.height + 20), (0, 0, 0, 0)); out.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)), (12, 16)); out.alpha_composite(L, (0, 0)); return out
def txt(t, f, fill, box=None):
    d0 = ImageDraw.Draw(Image.new("RGBA", (1, 1))); bb = d0.textbbox((0, 0), t, font=f); w, h = bb[2] - bb[0], bb[3] - bb[1]; px, py = (28, 16) if box else (6, 6)
    L = Image.new("RGBA", (w + px * 2 + 30, h + py * 2 + 30), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    if box: d.rectangle((15, 15, 15 + w + px * 2, 15 + h + py * 2), fill=box)
    else:
        sh = Image.new("RGBA", L.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((15 + px - bb[0] + 3, 15 + py - bb[1] + 6), t, font=f, fill=(0, 0, 0, 200)); L.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
    d.text((15 + px - bb[0], 15 + py - bb[1]), t, font=f, fill=fill); return L
def put(im, L, cx, cy, u, a=1.0):
    if u < 0: return
    k = min(u / 0.15, 1); sc = 1.4 - 0.4 * (1 - (1 - k) ** 3) if u < 0.15 else 1.0
    l = L.resize((max(1, int(L.width * sc)), max(1, int(L.height * sc))), Image.BICUBIC)
    im.alpha_composite(l, (int(cx - l.width / 2), int(cy - l.height / 2)))
ST = {ev[1]: sticker(ev[1], ev[2]) for ev in events if not ev[3]}
I1 = txt("Har trip pe", F("Poppins-Bold.woff", 76), W); I2 = txt("YE LOG MILTE HI HAIN", F("Anton-Regular.ttf", 118), K, YL); I3 = txt("👇", F("Poppins-Bold.woff", 10), W)
O1 = txt("AUR TUM KAUN HO?", F("Anton-Regular.ttf", 140), K, YL); O2 = txt("Comment karo 👇".replace(" 👇", ""), F("Poppins-Bold.woff", 64), W); O3 = txt(spec["cta"], F("Poppins-Bold.woff", 46), W)
for f in os.listdir(R + "ov"): os.remove(R + "ov/" + f)
for n in range(int(T * FPS)):
    t = n / FPS; im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    if t < t_intro: put(im, I1, 540, 760, t); put(im, I2, 540, 900, t - 0.25)
    for (te, label, emo, last) in events:
        u = t - te
        if 0 <= u < 0.09: im.alpha_composite(Image.new("RGBA", im.size, (255, 255, 255, int(230 * (1 - u / 0.09)))))
        if not last:
            nxt = [e[0] for e in events if e[0] > te]; end = nxt[0] - (beats[1] - beats[0]) * spec["play_beats"] if nxt else T
            if 0 <= u and t < te + (beats[1] - beats[0]) * spec["freeze_beats"] + 0.02: put(im, ST[label], 540, 1270, u)
        elif u >= 0:
            put(im, O1, 540, 820, u); put(im, O2, 540, 980, u - 0.35); put(im, O3, 540, 1090, u - 0.7)
    im.save(f"{R}ov/{n:04d}.png", compress_level=1)
# audio: music + clip audio + shutter at freezes
ains = ["-ss", str(spec["music_ss"]), "-t", f"{T:.2f}", "-i", spec["music"]]; afc = [f"[2:a]volume={spec.get('music_vol',0.85)}[m]", f"[0:a]volume={spec.get('orig_vol',0.55)}[o]"]; lab = ["[m]", "[o]"]
for j, (te, *_ ) in enumerate(events):
    ains += ["-i", S + "/music_trend/shutter.wav"]; ms = int(te * 1000); afc.append(f"[{3+j}:a]adelay={ms}|{ms},volume=0.8[c{j}]"); lab.append(f"[c{j}]")
afc.append(f"{''.join(lab)}amix=inputs={len(lab)}:normalize=0,afade=t=out:st={T-1.0:.2f}:d=1.0,loudnorm=I=-14:TP=-1.5[a]")
out = f"{S}/render/types/{spec['name']}.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", R + "base.mp4", "-framerate", str(FPS), "-i", R + "ov/%04d.png", *ains, "-filter_complex", "[0:v][1:v]overlay=0:0[v];" + ";".join(afc),
    "-map", "[v]", "-map", "[a]", "-t", f"{T:.2f}", "-c:v", "libx264", "-b:v", "8M", "-maxrate", "10M", "-bufsize", "16M", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
print(out, round(T, 2))
