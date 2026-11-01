import gdown,sys,os,subprocess
out=sys.argv[1]
for a in sys.argv[2:]:
    tag,fid=a.split("=")
    fs=gdown.download_folder(id=fid,skip_download=True,quiet=True)
    vids=[f for f in fs if f.path.lower().endswith(('.mp4','.mov'))]
    for i,f in enumerate(vids):
        raw=f"{out}/raw/{tag}_{i:03d}"+os.path.splitext(f.path)[1].lower()
        prox=f"{out}/proxy/{tag}_{i:03d}.mp4"
        if os.path.exists(prox): continue
        try:
            gdown.download(id=f.id,output=raw,quiet=True)
            # 1080-wide high quality working copy, drop original to save disk
            r=subprocess.run(["ffmpeg","-v","error","-y","-i",raw,"-vf","scale='min(1080,iw)':-2","-c:v","libx264","-crf","20","-preset","veryfast","-c:a","aac","-b:a","128k",prox])
            if r.returncode==0: os.remove(raw)
            print(tag,i,"ok",flush=True)
        except Exception as e: print(tag,i,"ERR",str(e)[:100],flush=True)
