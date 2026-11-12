# Organic reel: real clips, fast cuts, one serif line (one *yellow* word), small logo. Exported WITHOUT music
# (trending audio is added inside Instagram). Usage: python3 organic_reel.py S spec.py
import sys, os, re, json, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S = sys.argv[1]; spec = {"S": S}; exec(open(sys.argv[2]).read(), spec)
name = spec["name"]; R = f"{S}/render/organic/{name}/"; os.makedirs(R, exist_ok=True)
Y = (255, 214, 10); W = (255, 255, 255)
def src(c):
    for p in (f"{S}/drive2/proxy/{c}.mp4", f"{S}/footage/proxy/{c}.mp4", f"{S}/footage/{c}.mp4"):
        if os.path.exists(p): return p
    raise SystemExit("missing " + c)
def dims(p):
    o = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", p], capture_output=True, text=True).stdout.strip().split(",")
    return int(o[0]), int(o[1])
segs = []; t = 0; cuts = []
for i, (c, ss, d, *opt) in enumerate(spec["shots"]):
    p = src(c); w, h = dims(p); fx = opt[0] if opt else ""
    vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" if h >= w else \
         "split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2"
    vf += f",scale=w='trunc(1080*(1+0.06*t/{d:.3f})/2)*2':h=-2:eval=frame,crop=1080:1920,fps=30,setsar=1,eq=saturation=1.12:contrast=1.04"
    if "dark" in fx: vf += ",eq=brightness=-0.25:saturation=0.3,boxblur=6:1"
    o = f"{R}s{i:02d}.mp4"; segs.append(o); cuts.append(t); t += d
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-i", p, "-t", f"{d:.3f}", "-vf", vf, "-an", "-c:v", "libx264", "-crf", "17", "-preset", "veryfast", o], check=True)
T = t
open(R + "l.txt", "w").write("".join(f"file '{s}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", R + "l.txt", "-c", "copy", R + "base.mp4"], check=True)
# text PNGs
def text_png(lines, out, y0, size, font="DMSerif.woff", box=None):
    im = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); d = ImageDraw.Draw(im); f = ImageFont.truetype(f"{S}/fonts/{font}", size)
    y = y0
    band = Image.new("RGBA", im.size, (0, 0, 0, 0)); bh = int(len(lines) * size * 1.22)
    ImageDraw.Draw(band).rounded_rectangle((90, y0 - 40, 990, y0 + bh + 30), 60, fill=(0, 0, 0, 105))
    im.alpha_composite(band.filter(ImageFilter.GaussianBlur(28)))
    for line in lines:
        toks = re.split(r"(\*[^*]+\*)", line); parts = [(x.strip("*"), Y if x.startswith("*") else W) for x in toks if x]
        tw = sum(d.textlength(p, font=f) for p, _ in parts); x = (1080 - tw) / 2
        if box:
            d.rounded_rectangle((x - 26, y - 10, x + tw + 26, y + size * 1.18), 18, fill=box)
        sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(sh); xx = x
        for p, c in parts: sd.text((xx + 3, y + 4), p, font=f, fill=(0, 0, 0, 200)); xx += d.textlength(p, font=f)
        if not box: im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(5)))
        for p, c in parts: d.text((x, y), p, font=f, fill=(c if not box else (0, 0, 0) if c == W else (200, 30, 40))); x += d.textlength(p, font=f)
        y += int(size * 1.22)
    im.save(out)
ins = ["-i", R + "base.mp4"]; fc = []; last = "[0:v]"; k = 1
for j, (t0, t1, lines, y0, size, *o) in enumerate(spec["texts"]):
    png = f"{R}t{j}.png"; text_png(lines, png, y0, size, *(o or []))
    t1 = T if t1 is None else t1
    ins += ["-loop", "1", "-t", f"{T:.2f}", "-i", png]
    fc.append(f"[{k}:v]format=rgba,fade=t=in:st={t0}:d=0.2:alpha=1[x{k}];{last}[x{k}]overlay=enable='between(t,{t0},{t1})'[v{k}]"); last = f"[v{k}]"; k += 1
# small logo top-right inside safe zone
lg = Image.open(S + "/logo/rc.jpg").convert("RGB").resize((86, 86)); lg.save(R + "logo.png")
ins += ["-loop", "1", "-t", f"{T:.2f}", "-i", R + "logo.png"]
fc.append(f"{last}[{k}:v]overlay=850:262[vout]")
out = f"{S}/render/organic/{name}.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(fc), "-map", "[vout]", "-t", f"{T:.2f}", "-c:v", "libx264", "-crf", "19", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], check=True)
print(out, round(T, 2), "cuts", [round(c, 2) for c in cuts])
