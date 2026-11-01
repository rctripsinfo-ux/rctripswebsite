import sys,glob,os,subprocess,json
from PIL import Image,ImageDraw
d=sys.argv[1]; out=sys.argv[2]
fs=sorted(glob.glob(d+"/*.mp4")); meta={}
cells=[]
for f in fs:
    n=os.path.basename(f)[:-4]
    p=json.loads(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration:stream=width,height","-select_streams","v:0","-of","json",f],capture_output=True,text=True).stdout)
    dur=float(p["format"]["duration"]); w=p["streams"][0]["width"]; h=p["streams"][0]["height"]
    meta[n]=dict(dur=round(dur,1),w=w,h=h)
    ims=[]
    for t in (0.15,0.5,0.85):
        r=subprocess.run(["ffmpeg","-v","error","-ss",str(dur*t),"-i",f,"-frames:v","1","-vf","scale=-2:150","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
        import io; ims.append(Image.open(io.BytesIO(r)).convert("RGB"))
    W=sum(i.width for i in ims); c=Image.new("RGB",(W,170),"white"); x=0
    for i in ims: c.paste(i,(x,20)); x+=i.width
    ImageDraw.Draw(c).text((3,3),f"{n} {dur:.0f}s {'V' if h>w else 'H'}",fill="black")
    cells.append(c)
json.dump(meta,open(out+"/meta.json","w"),indent=0)
per=24
for k in range(0,len(cells),per):
    g=cells[k:k+per]; cols=4; rows=(len(g)+cols-1)//cols
    cw=max(c.width for c in g); sheet=Image.new("RGB",(cw*cols,170*rows),"white")
    for i,c in enumerate(g): sheet.paste(c,((i%cols)*cw,(i//cols)*170))
    sheet.save(f"{out}/sheet{k//per}.jpg",quality=60)
print(len(cells))
