# Pro reel: stock views + own clips, beat-cut, fast xfade transitions, punch zoom, cinematic grade, grain, kinetic text, whoosh SFX.
import sys, os, json, subprocess, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S = sys.argv[1]; spec = {"S": S}; exec(open(sys.argv[2]).read(), spec)
R = f"{S}/render/pro/{spec['name']}/"; os.makedirs(R + "ov", exist_ok=True); FPS = 30; TD = 0.18
F = lambda n, s: ImageFont.truetype(f"{S}/fonts/{n}", s)
YL = (247, 231, 51); W = (255, 255, 255); K = (12, 12, 12)
beats = [b - spec["music_ss"] for b in json.load(open(S + "/music_trend/beats.json"))[spec["music_key"]] if b >= spec["music_ss"] - 0.02]
def src(c):
    for p in (f"{S}/footage/stk/{c}.mp4", f"{S}/drive2/proxy/{c}.mp4", f"{S}/footage/proxy/{c}.mp4", f"{S}/footage/{c}.mp4"):
        if os.path.exists(p): return p
def dims(p):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", p], capture_output=True, text=True).stdout.strip().split(",")
    return int(o[0]), int(o[1])
# cut points on beats
idx = 0; starts = [0.0]
for c, ss, nb in spec["shots"]:
    idx += nb; starts.append(beats[idx])
T = starts[-1] + spec.get("tail", 0)
segs = []
GRADE = "eq=contrast=1.08:saturation=1.18:gamma=0.98,colorbalance=rs=-0.03:bs=0.04:rh=0.05:bh=-0.04,vignette=PI/5"
for i, (c, ss, nb) in enumerate(spec["shots"]):
    d = starts[i + 1] - starts[i] + (TD if i < len(spec["shots"]) - 1 else spec.get("tail", 0))
    p = src(c); w, h = dims(p)
    vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" if h >= w else \
         "split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2"
    vf += f",scale=w='trunc(1080*(1+0.13*max(0\\,1-t/0.22)+0.06*t/{d:.3f})/2)*2':h=-2:eval=frame,crop=1080:1920,fps={FPS},setsar=1,{GRADE}"
    o = f"{R}s{i:02d}.mp4"; segs.append((o, d))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-i", p, "-t", f"{d:.3f}", "-vf", vf, "-an", "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", o], check=True)
trs = spec.get("transitions", ["smoothleft", "zoomin", "smoothup", "slideright", "circleopen", "smoothdown"])
ins = []; fc = []; last = "[0:v]"
for k, (o, d) in enumerate(segs): ins += ["-i", o]
for k in range(1, len(segs)):
    t = trs[(k - 1) % len(trs)]; fc.append(f"{last}[{k}:v]xfade=transition={t}:duration={TD}:offset={starts[k]:.3f}[x{k}]"); last = f"[x{k}]"
fc.append(f"{last}noise=alls=6:allf=t[vout]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", "[vout]", "-t", f"{T:.3f}", "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", "-pix_fmt", "yuv420p", R + "base.mp4"], check=True)
# kinetic text overlay
def txt(t, f, fill, box=None):
    d0 = ImageDraw.Draw(Image.new("RGBA", (1, 1))); bb = d0.textbbox((0, 0), t, font=f); w, h = bb[2] - bb[0], bb[3] - bb[1]; px, py = (28, 16) if box else (6, 6)
    L = Image.new("RGBA", (w + px * 2 + 30, h + py * 2 + 30), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    if box: d.rectangle((15, 15, 15 + w + px * 2, 15 + h + py * 2), fill=box)
    else:
        sh = Image.new("RGBA", L.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).text((15 + px - bb[0] + 3, 15 + py - bb[1] + 6), t, font=f, fill=(0, 0, 0, 200)); L.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
    d.text((15 + px - bb[0], 15 + py - bb[1]), t, font=f, fill=fill); return L
def put(im, L, cx, cy, u):  # u = seconds since appear; slam-in
    if u < 0: return
    k = min(u / 0.16, 1); sc = 1.35 - 0.35 * (1 - (1 - k) ** 3); a = min(1, u / 0.08)
    l = L.resize((max(1, int(L.width * sc)), max(1, int(L.height * sc))), Image.BICUBIC)
    if a < 1: l.putalpha(l.split()[3].point(lambda v: int(v * a)))
    im.alpha_composite(l, (int(cx - l.width / 2), int(cy - l.height / 2)))
FONTS = {"anton": lambda s: F("Anton-Regular.ttf", s), "pi": lambda s: F("Poppins-Italic.woff", s), "pb": lambda s: F("Poppins-Bold.woff", s), "cinzel": lambda s: F("Cinzel-Bold.woff", s), "pxb": lambda s: F("Poppins-ExtraBold.ttf", s), "alig": lambda s: F("Aligano.ttf", s)}
items = []
for (t0, t1, txt_, font, size, color, y, *box) in spec["texts"]:
    t0 = beats[t0] if isinstance(t0, int) else t0; t1 = (beats[t1] if isinstance(t1, int) else t1) if t1 is not None else T
    col = {"Y": YL, "W": W, "K": K}[color]; bx = {"Y": YL, "W": W, "K": K}[box[0]] if box else None
    items.append((t0, t1, txt(txt_, FONTS[font](size), col, bx), y))
for f in os.listdir(R + "ov"): os.remove(R + "ov/" + f)
for n in range(int(T * FPS)):
    t = n / FPS; im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    for t0, t1, L, y in items:
        if t0 <= t < t1: put(im, L, 540, y, t - t0)
    im.save(f"{R}ov/{n:04d}.png", compress_level=1)
# audio: music + whoosh at each cut + boom at drop
sfx = []; ains = ["-ss", str(spec["music_ss"]), "-t", f"{T:.2f}", "-i", spec["music"]]
for k in range(1, len(starts) - 1):
    if k in spec.get("whoosh_at", []): sfx.append(("whoosh", starts[k] - 0.25))
for k in spec.get("boom_at", []): sfx.append(("boom", starts[k]))
afc = ["[2:a]volume=1.0[m]"]; lab = ["[m]"]
for j, (nm, at) in enumerate(sfx):
    ains += ["-i", f"{S}/music_trend/{nm}.wav"]; ms = int(max(0, at) * 1000); afc.append(f"[{3+j}:a]adelay={ms}|{ms},volume={0.35 if nm=='whoosh' else 0.6}[s{j}]"); lab.append(f"[s{j}]")
afc.append(f"{''.join(lab)}amix=inputs={len(lab)}:normalize=0,afade=t=out:st={T-1.2:.2f}:d=1.2,loudnorm=I=-14:TP=-1.5[a]")
out = f"{S}/render/pro/{spec['name']}.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", R + "base.mp4", "-framerate", str(FPS), "-i", R + "ov/%04d.png", *ains, "-filter_complex", "[0:v][1:v]overlay=0:0[v];" + ";".join(afc),
    "-map", "[v]", "-map", "[a]", "-t", f"{T:.2f}", "-c:v", "libx264", "-b:v", "10M", "-maxrate", "12M", "-bufsize", "20M", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
print(out, round(T, 2), [round(x, 2) for x in starts])
