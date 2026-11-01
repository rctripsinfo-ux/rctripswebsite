import subprocess,json,sys
from PIL import Image,ImageDraw,ImageFont
S=sys.argv[1]; P=S+"/footage/proxy/"; R=S+"/render/beat1/"; SONG=S+"/song/song.mp3"
meta=json.load(open(S+"/index/meta.json"))
B=[29.17+0.4185*i for i in range(90)]  # beat grid from detected drop
A0=28.33  # song start (just before drop)
# (clip, beats, offset fraction); first entry is intro before the drop
plan=[("kanA_021",0,.2),
("kanA_020",4,.1),("kanA_006",2,.3),("kanA_002",2,.1),("kanA_003",2,.3),("kanA_019",2,.2),("kanA_022",2,.1),("kanB_017",2,.2),("kanA_009",2,.3),("kanA_007",2,.4),
("kanA_017",2,.15),("kanA_018",2,.4),("kanA_000",2,.3),("kanA_015",4,.55),("kanB_006",2,.3),("kanB_001",2,.3),("kanB_003",2,.4),("kanB_008",2,.4),("kanA_032",2,.3),("kanA_033",2,.2),
("kanB_020",2,.3),("kanB_022",2,.2),("kanB_024",2,.4),("kanB_026",2,.3),("tehri_009",2,.1),("tehri_009",2,.5),("tehri_003",2,.4),("tehri_008",2,.4),
("kanA_023",2,.1),("kanA_010",4,.3),("kanB_018",2,.2),
("kanB_019",4,.0),("kanA_012",4,.3),("kanA_020",8,.4)]
times=[(0,B[0]-A0)]; k=0
for c,n,o in plan[1:]: times.append((B[k]-A0,B[k+n]-A0)); k+=n
T=times[-1][1]
segs=[]
for i,((c,n,off),(a,b)) in enumerate(zip(plan,times)):
    d=b-a; m=meta[c]; ss=min(m["dur"]*off,max(0,m["dur"]-d-0.1))
    if m["h"]>=m["w"]: vf="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    else: vf="split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=-2:1000,crop=1080:1000[fg];[bg][fg]overlay=0:(H-h)/2"
    vf+=",scale=w='trunc(1080*(1+0.08*max(0\\,1-t/0.3))/2)*2':h=-2:eval=frame,crop=1080:1920,fps=30,setsar=1,eq=saturation=1.15:contrast=1.05"
    o=f"{R}s{i:02d}.mp4"; segs.append(o)
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(ss),"-i",P+c+".mp4","-t",f"{d:.3f}","-vf",vf,"-an","-c:v","libx264","-crf","17","-preset","veryfast",o],check=True)
open(R+"list.txt","w").write("".join(f"file '{s}'\n" for s in segs))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",R+"list.txt","-c","copy",R+"base.mp4"],check=True)
F=S+"/fonts/Poppins-ExtraBold.ttf"; Y=(255,214,10); W=(255,255,255)
def png(lines,name):
    im=Image.new("RGBA",(1080,1920),(0,0,0,0)); dr=ImageDraw.Draw(im)
    for (txt,size,col,y,pill) in lines:
        f=ImageFont.truetype(F,size)
        if pill:
            bb=dr.textbbox((540,y),txt,font=f,anchor="mm"); dr.rounded_rectangle((bb[0]-40,bb[1]-25,bb[2]+40,bb[3]+25),radius=40,fill=(220,30,40))
            dr.text((540,y),txt,font=f,fill=W,anchor="mm")
        else: dr.text((540,y),txt,font=f,fill=col,anchor="mm",stroke_width=max(5,size//14),stroke_fill=(0,0,0))
    p=R+name+".png"; im.save(p); return p
ti=lambda j:times[j][0]
tags=[(ti(1),ti(5),[("KANATAL",190,Y,880,0),("TRIP",150,W,1060,0),("Delhi se Weekend Getaway",58,W,1220,1)]),
(ti(5),ti(10),[("Surkanda Devi Temple",72,Y,1500,0)]),
(ti(10),ti(13),[("Sky Cycling",80,Y,1500,0)]),(ti(13),ti(15),[("Sky Roller",80,Y,1500,0)]),
(ti(15),ti(18),[("Zipline",80,Y,1500,0)]),(ti(18),ti(20),[("Rope Bridge",80,Y,1500,0)]),
(ti(20),ti(24),[("Tehri Lake Speedboat",72,Y,1500,0)]),(ti(24),ti(28),[("Banana Ride",80,Y,1500,0)]),
(ti(28),ti(31),[("Bonfire Night",80,Y,1500,0)]),(ti(31),ti(33),[("Friends + Masti",80,Y,1500,0)]),
(ti(33),T,[("KANATAL TRIP",120,Y,760,0),("Weekend Trip ₹6,800",64,W,920,1),("Book Now",70,W,1130,0),("+91 72900 12474",80,Y,1240,0),("rctrips.com",60,W,1350,0)])]
ins=["-i",R+"base.mp4","-ss",str(A0),"-t",f"{T:.3f}","-i",SONG]; fc=[]; last="[0:v]"
for i,(a,b,l) in enumerate(tags):
    ins+=["-i",png(l,f"t{i}")]
    fc.append(f"{last}[{i+2}:v]overlay=0:0:enable='between(t,{a:.3f},{b-0.01:.3f})'[v{i}]"); last=f"[v{i}]"
fc.append(f"{last}fade=t=out:st={T-0.5:.3f}:d=0.5[vo]")
fc.append(f"[1:a]afade=t=in:d=0.15,afade=t=out:st={T-1.2:.3f}:d=1.2,loudnorm=I=-14:TP=-1.5[a]")
out=S+"/render/Kanatal_Beat_Reel_01.mp4"
subprocess.run(["ffmpeg","-v","error","-y",*ins,"-filter_complex",";".join(fc),"-map","[vo]","-map","[a]","-t",f"{T:.3f}","-c:v","libx264","-crf","20","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart",out],check=True)
print("done",T)
