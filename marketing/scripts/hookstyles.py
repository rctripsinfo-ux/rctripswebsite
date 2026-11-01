import sys
from PIL import Image,ImageDraw,ImageFont,ImageFilter
S=sys.argv[1]; D=S+"/render/hookst/"; FD=S+"/fonts/"
F=lambda n,s: ImageFont.truetype(FD+n,s)
EF=ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf",109)
def emoji(ch,h):
    im=Image.new("RGBA",(140,140),(0,0,0,0)); ImageDraw.Draw(im).text((0,0),ch,font=EF,embedded_color=True)
    im=im.crop(im.getbbox()); return im.resize((int(im.width*h/im.height),h))
def line(im,y,txt,fo,fg,bg=None,emo="",pad=(34,18),rad=26,shadow=False,stroke=0):
    d=ImageDraw.Draw(im); tw=d.textlength(txt,font=fo); asc,desc=fo.getmetrics(); th=asc+desc
    eh=int(th*0.62); ems=[emoji(c,eh) for c in emo]; ew=sum(e.width+8 for e in ems)+(10 if ems else 0)
    W=tw+ew; x=540-W/2
    if bg:
        box=(x-pad[0],y-pad[1],x+W+pad[0],y+th*0.86+pad[1]); 
        if shadow:
            sh=Image.new("RGBA",im.size,(0,0,0,0)); ImageDraw.Draw(sh).rounded_rectangle((box[0]+6,box[1]+8,box[2]+6,box[3]+8),radius=rad,fill=(0,0,0,120)); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8))); d=ImageDraw.Draw(im)
        d.rounded_rectangle(box,radius=rad,fill=bg)
    elif shadow:
        sh=Image.new("RGBA",im.size,(0,0,0,0)); ImageDraw.Draw(sh).text((x+5,y+7),txt,font=fo,fill=(0,0,0,200),stroke_width=stroke,stroke_fill=(0,0,0,200)); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6))); d=ImageDraw.Draw(im)
    d.text((x,y),txt,font=fo,fill=fg,stroke_width=stroke,stroke_fill=(0,0,0))
    ex=x+tw+12
    for e in ems: im.alpha_composite(e,(int(ex),int(y+th*0.43-eh/2))); ex+=e.width+8
L1="Delhi to Kanatal Weekend Trip"; L2="• Food • Hotel • Travel • Adventure • Bonfire • Captain"; L3="Sirf ₹6,800  •  Book on WhatsApp"
Y=(255,214,10)
def A(im):  # reference replica
    line(im,150,L1,F("Poppins-ExtraBoldItalic.ttf",50),"white",(0,0,0,235),"⛰🔥",shadow=True)
    line(im,262,L2,F("Poppins-SemiBold.ttf",30),"black",(255,255,255,245),pad=(24,10),rad=10)
    line(im,330,L3,F("Poppins-SemiBold.ttf",32),"white",shadow=True,stroke=2)
def B(im):  # white + yellow
    line(im,150,L1,F("Poppins-ExtraBoldItalic.ttf",50),"black",(255,255,255,245),"🏔✨",shadow=True)
    line(im,262,L2,F("Poppins-SemiBold.ttf",30),"black",Y,pad=(24,10),rad=10)
    line(im,330,L3,F("Poppins-SemiBold.ttf",32),"white",shadow=True,stroke=2)
def C(im):  # no box, bold shadow
    line(im,140,"Delhi to Kanatal",F("Poppins-ExtraBoldItalic.ttf",88),"white",emo="🏕",shadow=True,stroke=4)
    line(im,250,"WEEKEND TRIP",F("Poppins-ExtraBoldItalic.ttf",70),Y,shadow=True,stroke=4)
    line(im,350,L2,F("Poppins-SemiBold.ttf",30),"white",(0,0,0,150),pad=(24,10),rad=10)
    line(im,420,L3,F("Poppins-SemiBold.ttf",32),"white",shadow=True,stroke=2)
def Dd(im):  # red + translucent black
    line(im,150,L1,F("Poppins-ExtraBoldItalic.ttf",50),"white",(220,30,40,245),"⛰🔥",shadow=True)
    line(im,262,L2,F("Poppins-SemiBold.ttf",30),"white",(0,0,0,170),pad=(24,10),rad=10)
    line(im,330,L3,F("Poppins-SemiBold.ttf",32),Y,shadow=True,stroke=2)
outs=[]
for n,(fn,frame) in enumerate([(A,"kanA_020"),(B,"kanB_032"),(C,"kanA_015"),(Dd,"kanB_028")]):
    im=Image.open(D+frame+".png").convert("RGBA"); fn(im); outs.append(im.crop((0,0,1080,1100)))
W=400; H=int(W*1100/1080); sh=Image.new("RGB",(W*4+50,H+70),"white"); sd=ImageDraw.Draw(sh)
for i,im in enumerate(outs):
    x=10+i*(W+10); sh.paste(im.convert("RGB").resize((W,H)),(x,60)); sd.text((x+W//2,30),"ABCD"[i],font=F("Poppins-ExtraBold.ttf",40),fill="black",anchor="mm")
sh.save(D+"hook_styles.jpg",quality=90)
