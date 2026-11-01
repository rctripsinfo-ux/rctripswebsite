import subprocess,json,os,sys
from PIL import Image,ImageDraw,ImageFont
S=sys.argv[1]; P=S+"/footage/proxy/"; X=S+"/footage/pexels/"; R=S+"/render/k01/"
VO=sys.argv[2]; T=46.29
meta=json.load(open(S+"/index/meta.json"))
# (start,end,clip,clip_offset_fraction)
shots=[(0,1.2,P+"kanA_015.mp4",.3),(1.2,2.4,P+"kanA_021.mp4",.2),(2.4,4.8,P+"kanB_018.mp4",.1),
(4.8,6.2,P+"kanA_009.mp4",.3),(6.2,8.0,X+"night2.mp4",.3),(8.0,11.2,X+"night1.mp4",.1),
(11.2,13.2,P+"kanB_019.mp4",0),(13.2,15.07,P+"kanA_010.mp4",.2),(15.07,16.2,P+"kanA_006.mp4",.4),
(16.2,17.1,X+"bfast.mp4",.2),(17.1,18.3,P+"kanA_019.mp4",.2),(18.3,19.57,P+"kanA_002.mp4",.1),
(19.57,22.09,P+"kanA_020.mp4",.1),(22.09,23.89,P+"kanA_017.mp4",.15),(23.89,24.6,P+"kanB_008.mp4",.4),
(24.6,25.5,P+"kanB_006.mp4",.3),(25.5,26.7,P+"kanA_018.mp4",.4),(26.7,27.87,P+"kanA_033.mp4",.2),
(27.87,30.59,P+"kanA_015.mp4",.6),(30.59,32.95,P+"kanA_014.mp4",.3),(32.95,34.6,P+"kanA_023.mp4",.1),
(34.6,38.11,P+"kanA_010.mp4",.5),(38.11,40.2,P+"tehri_009.mp4",.1),(40.2,42.0,P+"tehri_003.mp4",.4),
(42.0,T,P+"kanB_018.mp4",.5)]
caps=[(0,2.2,"Delhi se KANATAL"),(2.2,4.8,"Sirf ₹6,800 mein"),(4.8,6.2,"Poora plan suno"),
(6.2,8.75,"Friday night 10 baje"),(8.75,11.2,"Monday office se\npehle wapas"),(11.2,15.07,"Games, music,\nfull masti"),
(15.07,17.1,"Subah breakfast"),(17.1,19.57,"Surkanda Devi Temple"),(19.57,22.09,"Poora Himalaya view"),
(22.09,23.89,"ADVENTURE TIME"),(23.89,24.6,"Zipline"),(24.6,25.5,"Sky Roller"),(25.5,26.7,"Sky Cycling"),
(26.7,27.87,"Horizon Bridge"),(27.87,30.59,"Sab INCLUDED"),(30.59,32.95,"Dhanaulti\ndeodar forest"),
(32.95,35.7,"Bonfire + music"),(35.7,38.11,"Poori raat gappe"),(38.11,40.6,"Tehri Lake\nbanana ride"),
(40.6,42.0,"Phir wapas Delhi"),(42.0,T,"Comment 'KANATAL'\nPoora plan DM mein")]
segs=[]
for i,(a,b,f,off) in enumerate(shots):
    d=b-a; n=os.path.basename(f)[:-4]; cd=meta.get(n,{}).get("dur") or float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)
    ss=min(cd*off,max(0,cd-d-0.1))
    w,h=(meta[n]["w"],meta[n]["h"]) if n in meta else (720,1280)
    if h>=w: vf="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    else: vf="split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2"
    o=f"{R}s{i:02d}.mp4"; segs.append(o)
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(ss),"-i",f,"-t",f"{d:.3f}","-vf",vf+",fps=30,setsar=1,eq=saturation=1.12:contrast=1.04","-an","-c:v","libx264","-crf","18","-preset","veryfast",o],check=True)
open(R+"list.txt","w").write("".join(f"file '{s}'\n" for s in segs))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",R+"list.txt","-c","copy",R+"base.mp4"],check=True)
font=ImageFont.truetype(S+"/fonts/Poppins-ExtraBold.ttf",78)
ins=["-i",R+"base.mp4","-i",VO]; fc=[]; last="[0:v]"
for i,(a,b,t) in enumerate(caps):
    im=Image.new("RGBA",(1080,500),(0,0,0,0)); dr=ImageDraw.Draw(im)
    col=(255,214,10) if i!=len(caps)-1 else (255,255,255)
    dr.multiline_text((540,250),t,font=font,fill=col,anchor="mm",align="center",stroke_width=7,stroke_fill=(0,0,0),spacing=10)
    p=f"{R}c{i:02d}.png"; im.save(p); ins+=["-i",p]
    fc.append(f"{last}[{i+2}:v]overlay=0:1050:enable='between(t,{a},{b-0.01})'[v{i}]"); last=f"[v{i}]"
fc.append("[1:a]loudnorm=I=-14:TP=-1.5:LRA=9[a]")
subprocess.run(["ffmpeg","-v","error","-y",*ins,"-filter_complex",";".join(fc),"-map",last,"-map","[a]","-t",str(T),"-c:v","libx264","-crf","21","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart",S+"/render/Kanatal_Reel_01.mp4"],check=True)
print("done")
