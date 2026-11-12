import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S=sys.argv[1]; F=lambda n,s: ImageFont.truetype(f"{S}/fonts/{n}",s)
def bg(p):
    im=Image.open(p).convert("RGBA"); w,h=im.size; s=max(1080/w,1920/h); im=im.resize((int(w*s),int(h*s))); return im.crop(((im.width-1080)//2,(im.height-1920)//2,(im.width-1080)//2+1080,(im.height-1920)//2+1920))
def shadow(im,draw_fn,blur=8,a=150):
    sh=Image.new("RGBA",im.size,(0,0,0,0)); draw_fn(ImageDraw.Draw(sh),(0,0,0,a)); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))
def ctext(d,y,t,f,fill,**k):
    w=d.textlength(t,font=f); d.text(((1080-w)/2,y),t,font=f,fill=fill,**k); return (1080-w)/2,w
CREAM=(246,235,217); Y=(255,214,10); ORG=(255,178,91); W=(255,255,255)
def s1(im):  # minimal aesthetic
    f=F("InstrumentSerif-Italic.woff",104); f2=F("Montserrat-Medium.woff",28)
    shadow(im,lambda d,c:(ctext(d,430,"real trips,",f,c),ctext(d,540,"real strangers.",f,c)))
    d=ImageDraw.Draw(im); ctext(d,430,"real trips,",f,W); ctext(d,540,"real strangers.",f,W)
    ctext(d,680,"K A N A T A L   ·   M A N A L I   ·   U D A I P U R",f2,CREAM)
def s2(im):  # editorial cream
    f=F("Playfair-BoldItalic.woff",110); f2=F("Montserrat-Medium.woff",30)
    shadow(im,lambda d,c:ctext(d,420,"Real trips.",f,c))
    d=ImageDraw.Draw(im); ctext(d,420,"Real trips.",f,CREAM)
    d.line((390,585,690,585),fill=CREAM,width=2); ctext(d,605,"N O   S T O C K   V I D E O S",f2,CREAM)
def s3(im):  # handwritten
    f=F("Caveat-Bold.woff",130)
    shadow(im,lambda d,c:ctext(d,420,"real trips, real people",f,c),blur=6)
    d=ImageDraw.Draw(im); x,w=ctext(d,420,"real trips, real people",f,W)
    d.arc((x+w*0.52,560,x+w,600),190,350,fill=Y,width=9)
def s4(im):  # bold modern
    f=F("Montserrat-ExtraBold.woff",96)
    d=ImageDraw.Draw(im); shadow(im,lambda d,c:ctext(d,420,"REAL TRIPS.",f,c))
    d=ImageDraw.Draw(im); ctext(d,420,"REAL TRIPS.",f,W)
    w=d.textlength("STRANGERS.",font=f); d.rectangle(((1080-w)/2-18,540,(1080+w)/2+18,655),fill=Y); ctext(d,542,"STRANGERS.",f,(20,20,20))
def s5(im):  # IG label (Book of Trips style)
    f=F("SpaceMono-Bold.woff",44); d=ImageDraw.Draw(im)
    for i,t in enumerate(["Real trips | Real strangers","Kanatal · Manali · Udaipur"]):
        w=d.textlength(t,font=f); y=440+i*86; d.rounded_rectangle(((1080-w)/2-24,y-12,(1080+w)/2+24,y+60),10,fill=(255,255,255,240)); ctext(d,y,t,f,(15,15,15))
def s6(im):  # sunset accent serif
    f=F("Cormorant-SemiBoldItalic.woff",120); f2=F("Cormorant-SemiBoldItalic.woff",120)
    shadow(im,lambda d,c:(ctext(d,400,"Pehle strangers,",f,c),ctext(d,525,"phir family.",f2,c)))
    d=ImageDraw.Draw(im); ctext(d,400,"Pehle strangers,",f,W); ctext(d,525,"phir family.",f2,ORG)
styles=[("1 Minimal",s1),("2 Editorial cream",s2),("3 Handwritten",s3),("4 Bold modern",s4),("5 IG label",s5),("6 Sunset serif",s6)]
for bgp,out in [(sys.argv[2],sys.argv[3]),(sys.argv[4],sys.argv[5])]:
    tiles=[]
    for name,fn in styles:
        im=bg(bgp); fn(im); im=im.convert("RGB").resize((360,640)); t=Image.new("RGB",(360,690),"white"); t.paste(im,(0,50))
        ImageDraw.Draw(t).text((10,8),name,font=F("Montserrat-ExtraBold.woff",28),fill="black"); tiles.append(t)
    sh=Image.new("RGB",(360*3+20,690*2+10),"white")
    for i,t in enumerate(tiles): sh.paste(t,((i%3)*370,(i//3)*700))
    sh.save(out,quality=88)
