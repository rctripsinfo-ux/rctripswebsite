import subprocess,json,sys
from PIL import Image,ImageDraw,ImageFont
S=sys.argv[1]; VO=sys.argv[2]; P=S+"/footage/proxy/"; R=S+"/render/k02/"; MUS=S+"/music/Life_of_Riley.mp3"
meta=json.load(open(S+"/index/meta.json")); T=26.12
shots=[(0,1.33,"kanB_032",.3),(1.33,3.45,"kanB_028",.2),(3.45,5.0,"kanB_000",.3),(5.0,6.15,"kanB_011",.3),
(6.15,7.2,"kanB_007",.3),(7.2,8.19,"kanB_002",.4),(8.19,9.8,"kanA_025",.2),(9.8,11.69,"kanB_030",.1),
(11.69,13.0,"kanA_004",.2),(13.0,14.35,"kanA_003",.7),(14.35,15.43,"kanB_005",.3),(15.43,16.33,"kanB_006",.75),
(16.33,17.57,"kanA_026",.4),(17.57,18.95,"kanA_023",.55),(18.95,20.2,"tehri_013",.3),(20.2,21.51,"tehri_000",.4),
(21.51,22.93,"tehri_007",.3),(22.93,T,"kanB_029",.3)]
segs=[]
for i,(a,b,c,off) in enumerate(shots):
    d=b-a; m=meta[c]; ss=min(m["dur"]*off,max(0,m["dur"]-d-0.1))
    if m["h"]>=m["w"]: vf="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    else: vf="split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];[b]scale=-2:1000,crop=1080:1000[fg];[bg][fg]overlay=0:(H-h)/2"
    vf+=",scale=w='trunc(1080*(1+0.06*max(0\\,1-t/0.3))/2)*2':h=-2:eval=frame,crop=1080:1920,fps=30,setsar=1,eq=saturation=1.15:contrast=1.05"
    o=f"{R}s{i:02d}.mp4"; segs.append(o)
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(ss),"-i",P+c+".mp4","-t",f"{d:.3f}","-vf",vf,"-an","-c:v","libx264","-crf","17","-preset","veryfast",o],check=True)
open(R+"list.txt","w").write("".join(f"file '{s}'\n" for s in segs))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",R+"list.txt","-c","copy",R+"base.mp4"],check=True)
F=S+"/fonts/Poppins-ExtraBold.ttf"; Y=(255,214,10); W=(255,255,255); RED=(220,30,40)
def png(items,name):
    im=Image.new("RGBA",(1080,1920),(0,0,0,0)); dr=ImageDraw.Draw(im)
    for (txt,size,col,y,box) in items:
        f=ImageFont.truetype(F,size)
        if box:
            bb=dr.multiline_textbbox((540,y),txt,font=f,anchor="mm",align="center",spacing=8)
            dr.rounded_rectangle((bb[0]-36,bb[1]-22,bb[2]+36,bb[3]+22),radius=28,fill=box)
            dr.multiline_text((540,y),txt,font=f,fill=col,anchor="mm",align="center",spacing=8)
        else: dr.multiline_text((540,y),txt,font=f,fill=col,anchor="mm",align="center",spacing=8,stroke_width=max(5,size//14),stroke_fill=(0,0,0))
    p=R+name+".png"; im.save(p); return p
CY=1380
caps=[(0,1.33,[("DELHI SE",80,W,780,0),("KANATAL",170,Y,920,0)]),
(1.33,3.45,[("SIRF",80,W,800,0),("₹6,800",170,W,960,RED)]),
(3.45,6.15,[("Hotel + Khana + Travel",66,(0,0,0),CY,Y)]),
(6.15,8.19,[("Adventure\nALL INCLUDED",72,(0,0,0),CY,Y)]),
(8.19,11.69,[("Friday raat jao\nMonday se pehle wapas",62,(0,0,0),CY,Y)]),
(11.69,14.35,[("Surkanda Devi Temple\nHimalaya View",64,(0,0,0),CY,Y)]),
(14.35,15.43,[("Zipline",80,(0,0,0),CY,Y)]),(15.43,16.33,[("Sky Roller",80,(0,0,0),CY,Y)]),
(16.33,17.57,[("Sky Cycling",80,(0,0,0),CY,Y)]),(17.57,18.95,[("Bonfire Night",80,(0,0,0),CY,Y)]),
(18.95,21.51,[("Tehri Lake\nBanana Ride",72,(0,0,0),CY,Y)]),
(21.51,22.93,[("SEATS LIMITED!",96,W,CY,RED)]),
(22.93,T,[("KANATAL",150,Y,700,0),("Weekend Trip ₹6,800",66,W,860,RED),("WhatsApp karo",70,W,1080,0),("+91 72900 12474",86,Y,1190,0),("rctrips.com",60,W,1300,0)])]
caps.append((1.33,22.93,[("Kanatal Weekend • ₹6,800",44,W,250,(0,0,0,150))]))
ins=["-i",R+"base.mp4","-i",VO,"-stream_loop","-1","-i",MUS]; fc=[]; last="[0:v]"
for i,(a,b,l) in enumerate(caps):
    ins+=["-i",png(l,f"c{i:02d}")]
    fc.append(f"{last}[{i+3}:v]overlay=0:0:enable='between(t,{a:.3f},{b-0.01:.3f})'[v{i}]"); last=f"[v{i}]"
fc.append(f"[2:a]atrim=0:{T},asetpts=PTS-STARTPTS,loudnorm=I=-18:TP=-2,afade=t=in:d=0.3,afade=t=out:st={T-1.2}:d=1.2[m];[1:a]apad,atrim=0:{T},asplit[vo][sc];[m][sc]sidechaincompress=threshold=0.06:ratio=2.5:attack=30:release=350[md];[vo][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]")
out=S+"/render/Kanatal_Ad_02.mp4"
subprocess.run(["ffmpeg","-v","error","-y",*ins,"-filter_complex",";".join(fc),"-map",last,"-map","[a]","-t",str(T),"-c:v","libx264","-crf","20","-preset","medium","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart",out],check=True)
print("done")
