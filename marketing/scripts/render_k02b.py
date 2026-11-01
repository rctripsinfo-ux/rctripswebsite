import subprocess,json,sys,re
from PIL import Image,ImageDraw,ImageFont,ImageFilter
S=sys.argv[1]; VO=sys.argv[2]; SRT=sys.argv[3]; P=S+"/footage/proxy/"; R=S+"/render/k02b/"
meta=json.load(open(S+"/index/meta.json")); T=26.12; FPS=30
# word timings from SRT, merged "6" + ",800"
ts=[]
for blk in open(SRT,encoding="utf-8").read().strip().split("\n\n"):
    l=blk.split("\n"); a,b=l[1].split(" --> ")
    f=lambda x:int(x[:2])*3600+int(x[3:5])*60+float(x[6:].replace(",","."))
    ts.append([f(a),f(b)])
ts[4][1]=ts[5][1]; del ts[5]
ts[41][1]=ts[42][1]; del ts[42]; ts[32][1]=ts[33][1]; del ts[33]
words="Delhi se Kanatal | Sirf 6,800 rupaye mein | Hotel, khaana, travel | aur adventure activities, | sab included! | Friday raat Delhi se niklo, | Monday office se pehle wapas! | Surkanda Devi Temple | se Himalaya ka view, | Zipline, sky roller | aur sky cycling, | raat ko bonfire | aur agle din | Tehri Lake pe banana ride! | Seats limited hain! | Neeche button dabao | aur WhatsApp pe | abhi details lo!"
groups=[g.split() for g in words.split("|")]
flat=[w for g in groups for w in g]; assert len(flat)==len(ts),(len(flat),len(ts))
# split groups longer than 3 words
G=[]
for g in groups:
    while len(g)>3: G.append(g[:3]) if len(g)!=4 else G.append(g[:2]); g=g[3:] if len(g)!=4 else g[2:]
    G.append(g)
shots=[(0,0.71,"kanB_032",.25),(0.71,1.33,"kanB_029",.5),(1.33,2.13,"kanB_028",.2),(2.13,3.45,"kanB_020",.4),
(3.45,4.35,"kanB_000",.3),(4.35,5.0,"kanA_037",.4),(5.0,6.15,"kanB_011",.3),(6.15,7.2,"kanB_007",.3),(7.2,8.19,"kanB_002",.4),
(8.19,9.81,"kanA_025",.2),(9.81,11.69,"kanB_030",.1),(11.69,12.79,"kanA_004",.2),(12.79,14.35,"kanA_003",.7),
(14.35,15.43,"kanB_005",.3),(15.43,16.33,"kanB_006",.75),(16.33,17.57,"kanA_026",.4),(17.57,18.95,"kanA_023",.55),
(18.95,20.2,"tehri_013",.3),(20.2,21.51,"tehri_000",.4),(21.51,22.93,"tehri_007",.3),(22.93,T,"kanB_018",.3)]
flash={0,2,9,11,13,17,20}
segs=[]
for i,(a,b,c,off) in enumerate(shots):
    d=b-a; m=meta[c]; ss=min(m["dur"]*off,max(0,m["dur"]-d-0.1))
    if m["h"]>=m["w"]: vf="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    else: vf="split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=-2:1100,crop=1080:1100[fg];[bg][fg]overlay=0:(H-h)/2"
    vf+=f",scale=w='trunc(1080*(1+0.07*max(0\\,1-t/0.25)+0.05*t/{d:.3f})/2)*2':h=-2:eval=frame,crop=1080:1920,fps={FPS},setsar=1,eq=saturation=1.18:contrast=1.06"
    if i in flash: vf+=",eq=brightness='0.45*max(0\\,1-t/0.15)':eval=frame"
    o=f"{R}s{i:02d}.mp4"; segs.append(o)
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(ss),"-i",P+c+".mp4","-t",f"{d:.3f}","-vf",vf,"-an","-c:v","libx264","-crf","17","-preset","veryfast",o],check=True)
open(R+"list.txt","w").write("".join(f"file '{s}'\n" for s in segs))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",R+"list.txt","-c","copy",R+"base.mp4"],check=True)
# caption frames (word-by-word highlight with pop)
F=S+"/fonts/Poppins-ExtraBold.ttf"; Y=(255,214,10); W=(255,255,255)
fonts={}
def font(s):
    if s not in fonts: fonts[s]=ImageFont.truetype(F,s)
    return fonts[s]
wi=[]; k=0
for gi,g in enumerate(G):
    for j in range(len(g)): wi.append((gi,j)); k+=1
END=22.93; CH=520
def draw(t):
    im=Image.new("RGBA",(1080,CH),(0,0,0,0))
    if t>=END-0.02: return im
    cur=None
    for n,(a,b) in enumerate(ts):
        nb=ts[n+1][0] if n+1<len(ts) else b+0.3
        if a<=t<max(b,nb): cur=n
    if cur is None: return im
    gi,j=wi[cur]; g=G[gi]; age=t-ts[cur][0]
    base=84 if sum(len(w) for w in g)<18 else 72
    fo=font(base); AF=S+"/fonts/ArchivoBlack-Regular.ttf"
    fo=fonts.setdefault(("A",base),ImageFont.truetype(AF,base))
    dr=ImageDraw.Draw(im); sp=dr.textlength(" ",font=fo)+6
    lines=[[]]; wsum=0
    for n,w in enumerate(g):
        ww=dr.textlength(w,font=fo)+sp
        if wsum+ww>940 and lines[-1]: lines.append([]); wsum=0
        lines[-1].append(n); wsum+=ww
    y=CH//2-(len(lines)-1)*base*0.65
    sh=Image.new("RGBA",(1080,CH),(0,0,0,0)); sd=ImageDraw.Draw(sh)
    pop=1+0.12*max(0,1-age/0.12)
    for L in lines:
        tw=sum(dr.textlength(g[n],font=fo) for n in L)+sp*(len(L)-1); x=540-tw/2
        for n in L:
            w=g[n]; wl=dr.textlength(w,font=fo)
            if n==j:
                bb=dr.textbbox((x,y),w,font=fo,anchor="lm"); cx=(bb[0]+bb[2])/2; cy=(bb[1]+bb[3])/2
                hw=((bb[2]-bb[0])/2+16)*pop; hh=((bb[3]-bb[1])/2+14)*pop
                sd.rounded_rectangle((cx-hw+4,cy-hh+7,cx+hw+4,cy+hh+7),radius=16,fill=(0,0,0,150))
                dr.rounded_rectangle((cx-hw,cy-hh,cx+hw,cy+hh),radius=16,fill=Y)
                dr.text((x,y),w,font=fo,fill=(0,0,0),anchor="lm")
            else:
                sd.text((x+4,y+6),w,font=fo,fill=(0,0,0,170),anchor="lm",stroke_width=6,stroke_fill=(0,0,0,170))
                dr.text((x,y),w,font=fo,fill=W,anchor="lm",stroke_width=6,stroke_fill=(0,0,0))
            x+=wl+sp
        y+=base*1.3
    sh=sh.filter(ImageFilter.GaussianBlur(5)); sh.alpha_composite(im); return sh
N=int(T*FPS)
for n in range(N): draw(n/FPS).save(f"{R}cap/{n:04d}.png",compress_level=1)
# end card
card=Image.new("RGBA",(1080,1920),(0,0,0,115)); dr=ImageDraw.Draw(card)
def ct(txt,s,col,y,box=None):
    f=font(s)
    if box:
        bb=dr.textbbox((540,y),txt,font=f,anchor="mm"); dr.rounded_rectangle((bb[0]-40,bb[1]-24,bb[2]+40,bb[3]+24),radius=34,fill=box)
        dr.text((540,y),txt,font=f,fill=col,anchor="mm")
    else: dr.text((540,y),txt,font=f,fill=col,anchor="mm",stroke_width=max(5,s//14),stroke_fill=(0,0,0))
ct("KANATAL",170,Y,700); ct("Weekend Trip  ₹6,800",64,W,880,(220,30,40)); ct("WhatsApp karo",66,W,1100); ct("+91 72900 12474",92,Y,1210,); ct("rctrips.com",58,W,1330)
card.save(R+"card.png")
# whoosh SFX at key cuts
hits=[1.33,8.19,11.69,14.35,18.95,22.93]
subprocess.run(["ffmpeg","-v","error","-y","-f","lavfi","-i","anoisesrc=d=0.4:c=pink:a=0.6","-af","highpass=f=600,lowpass=f=6000,afade=t=in:d=0.25,afade=t=out:st=0.25:d=0.15,volume=0.35","-ar","44100","-ac","2",R+"whoosh.wav"],check=True)
ins=["-i",R+"base.mp4","-framerate",str(FPS),"-i",R+"cap/%04d.png","-loop","1","-t",str(T),"-i",R+"card.png","-i",VO]
fc=[f"[0:v][1:v]overlay=0:1180[v1]",f"[v1][2:v]overlay=0:0:enable='gte(t,{END})'[v2]"]
mix=["[3:a]apad,atrim=0:%s,aformat=channel_layouts=stereo:sample_rates=44100[vo]"%T]; lab=["[vo]"]
for n,h in enumerate(hits):
    ins+=["-i",R+"whoosh.wav"]; d=int((h-0.25)*1000)
    mix.append(f"[{4+n}:a]adelay={d}|{d}[w{n}]"); lab.append(f"[w{n}]")
mix.append("".join(lab)+f"amix=inputs={len(lab)}:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]")
out=S+"/render/Kanatal_Ad_02_style3.mp4"
subprocess.run(["ffmpeg","-v","error","-y",*ins,"-filter_complex",";".join(fc+mix),"-map","[v2]","-map","[a]","-t",str(T),"-c:v","libx264","-crf","20","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart",out],check=True)
print("done")
