"""Re-download the Pexels stock clips used by the ads.
Usage: python3 fetch_pexels.py <S>   (S = this marketing/ folder)
Needs a Pexels API key in env PEXELS_API_KEY (free at pexels.com/api),
or a proxy that injects it. Reads footage/pexels_clips.txt (lines like "man/p27852530").
Saves footage/<dir>/p<ID>.mp4 at 1080x1920 (or the closest portrait file)."""
import json, os, sys, urllib.request
S = sys.argv[1]
key = os.environ.get("PEXELS_API_KEY", "")
for line in open(os.path.join(S, "footage/pexels_clips.txt")):
    rel = line.strip()
    if not rel or rel.startswith("#"): continue
    out = os.path.join(S, "footage", rel + ".mp4")
    if os.path.exists(out): continue
    os.makedirs(os.path.dirname(out), exist_ok=True)
    vid = rel.split("/p")[-1]
    req = urllib.request.Request(f"https://api.pexels.com/videos/videos/{vid}", headers={"Authorization": key} if key else {})
    d = json.load(urllib.request.urlopen(req))
    files = [f for f in d["video_files"] if f.get("height") and f.get("width")]
    port = [f for f in files if f["height"] >= f["width"]] or files
    best = min(port, key=lambda f: abs(f["height"] - 1920))
    urllib.request.urlretrieve(best["link"], out)
    print("ok", rel, best["width"], best["height"], flush=True)
