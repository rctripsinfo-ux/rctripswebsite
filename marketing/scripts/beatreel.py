# Beat-cut music-only reel: shots on every 2 beats, persistent overlay, end card.
import sys, json, subprocess, os
S = sys.argv[1]; cfg = {"S": S}; exec(open(sys.argv[2]).read(), cfg)
R = S + "/render/" + cfg["name"] + "/"; os.makedirs(R, exist_ok=True)
meta = json.load(open(S + "/index/meta.json")); FPS = 30
beats = [b - cfg["music_ss"] for b in cfg["beats"] if b >= cfg["music_ss"]]
shots = cfg["shots"]; step = cfg.get("step", 2)
cuts = [beats[i * step] for i in range(len(shots) + 1)]; cuts[0] = 0
CARD = cuts[-1]; T = CARD + cfg["card_dur"]
segs = []
for i, (c, off) in enumerate(shots + [cfg["card_bg"]]):
    a = cuts[i]; b = cuts[i + 1] if i < len(shots) else T; d = b - a
    src = S + "/footage/proxy/" + c + ".mp4"; m = meta[c]; ss = min(m["dur"] * off, max(0, m["dur"] - d - 0.1))
    if m["h"] >= m["w"]: vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    else: vf = "split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2"
    if i == len(shots): vf += ",boxblur=10:2"
    vf += f",scale=w='trunc(1080*(1+0.10*max(0\\,1-t/0.18)+0.06*t/{d:.3f})/2)*2':h=-2:eval=frame,crop=1080:1920,fps={FPS},setsar=1,eq=saturation=1.2:contrast=1.07"
    if i in cfg.get("flash", []): vf += ",eq=brightness='0.5*max(0\\,1-t/0.12)':eval=frame"
    o = f"{R}s{i:02d}.mp4"; segs.append(o)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ss:.2f}", "-i", src, "-t", f"{d:.3f}", "-vf", vf, "-an", "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", o], check=True)
open(R + "list.txt", "w").write("".join(f"file '{s}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", R + "list.txt", "-c", "copy", R + "base.mp4"], check=True)
fc = (f"[0:v][1:v]overlay=enable='lt(t,{CARD:.3f})'[v1];[2:v]format=rgba,fade=t=in:st={CARD:.3f}:d=0.25:alpha=1[cd];[v1][cd]overlay=enable='gte(t,{CARD:.3f})'[v]")
for tag, music in [("", True), ("_NO_MUSIC", False)]:
    ins = ["-i", R + "base.mp4", "-loop", "1", "-t", f"{T:.3f}", "-i", cfg["overlay"], "-loop", "1", "-t", f"{T:.3f}", "-i", cfg["card"]]
    amap = []
    if music:
        ins += ["-ss", str(cfg["music_ss"]), "-t", f"{T:.3f}", "-i", cfg["music"]]
        f2 = fc + f";[3:a]afade=t=in:d=0.15,afade=t=out:st={T-1.6:.3f}:d=1.6,loudnorm=I=-14:TP=-1.5[a]"; amap = ["-map", "[a]", "-c:a", "aac", "-b:a", "192k"]
    else: f2 = fc
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", f2, "-map", "[v]", *amap, "-t", f"{T:.3f}", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(FPS), "-movflags", "+faststart", S + "/render/" + cfg["name"] + tag + ".mp4"], check=True)
print("CARD", CARD, "T", T)
