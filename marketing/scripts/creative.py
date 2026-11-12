import sys, random, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
from rembg import remove, new_session
S=sys.argv[1]; K3=S+"/kv3/"; F=lambda n,s: ImageFont.truetype(f"{S}/fonts/{n}",s)
YL=(247,231,51); W=(255,255,255); K=(15,15,15); RED=(226,35,26); CREAM=(250,243,228)
sess=new_session("u2net_human_seg")
def fit(p):
    im=Image.open(p).convert("RGBA"); im=ImageOps.exif_transpose(im); w,h=im.size; s=max(1080/w,1920/h); im=im.resize((int(w*s),int(h*s)),Image.LANCZOS)
    return im.crop(((im.width-1080)//2,(im.height-1920)//2,(im.width-1080)//2+1080,(im.height-1920)//2+1920))
def logo(im,xy=(850,262),s=86): im.paste(Image.open(f"{S}/logo/rc.jpg").convert("RGB").resize((s,s)),xy)
def ctext(d,y,t,f,fill,x=None):
    w=d.textlength(t,font=f); d.text(((1080-w)/2 if x is None else x,y),t,font=f,fill=fill); return w
# 1 TEXT BEHIND SUBJECT
im=fit(S+"/drive2/img/IMG_9582_c.jpg"); cut=remove(im,session=sess)
d=ImageDraw.Draw(im); g=F("Gloock.woff",280)
w=d.textlength("Manali",font=g); d.text(((1080-w)/2,350),"Manali",font=g,fill=YL)
im.alpha_composite(cut); d=ImageDraw.Draw(im)
it=F("Poppins-MediumItalic.woff",50); ctext(d,300,"strangers in",it,W)
b=F("Montserrat-ExtraBold.woff",54); t="27 NOV – 1 DEC"; w=d.textlength(t,font=b); d.rectangle(((1080-w)/2-26,1400,(1080+w)/2+26,1488),fill=RED); ctext(d,1410,t,b,W)
logo(im); im.convert("RGB").save(K3+"c1_text_behind.jpg",quality=90)
# 2 STICKER CUT-OUT SCRAPBOOK
base=Image.new("RGBA",(1080,1920),YL); d=ImageDraw.Draw(base)
for y in range(0,1920,60): d.line((0,y,1080,y),fill=(235,218,40),width=2)
src=fit(S+"/drive2/img/IMG_9565_c.jpg"); c=remove(src,session=sess); bb=c.getbbox(); c=c.crop(bb)
a=c.split()[3].filter(ImageFilter.MaxFilter(25)); stick=Image.new("RGBA",c.size,(255,255,255,0)); stick.paste((255,255,255,255),(0,0),a); stick.alpha_composite(c)
sc=min(1000/stick.width,1000/stick.height); stick=stick.resize((1000,int(stick.height*sc))); stick=stick.rotate(-4,expand=True,resample=Image.BICUBIC)
sh=Image.new("RGBA",stick.size,(0,0,0,0)); sh.paste((0,0,0,110),(0,0),stick.split()[3]); base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(14)),(70,700)); base.alpha_composite(stick,((1080-stick.width)//2,680))
d=ImageDraw.Draw(base); cv=F("Caveat-Bold.woff",96); b=F("Montserrat-ExtraBold.woff",96)
d.text((90,300),"2 din pehle:",font=cv,fill=K); w=d.textlength("STRANGERS",font=b); d.rectangle((80,410,110+w,530),fill=K); d.text((95,418),"STRANGERS",font=b,fill=YL)
d.text((420,560),"ab: ye gang 💛".replace(" 💛",""),font=cv,fill=K); d.line([(700,690),(760,750),(745,700)],fill=K,width=7); d.line([(760,750),(705,735)],fill=K,width=7)
d.text((90,1720),"Manali • 27 Nov",font=F("Montserrat-ExtraBold.woff",58),fill=K)
logo(base); base.convert("RGB").save(K3+"c2_sticker.jpg",quality=90)
# 3 BOARDING PASS
im=fit(S+"/kv3/f_fog.png"); im.alpha_composite(Image.new("RGBA",im.size,(0,0,0,70))); d=ImageDraw.Draw(im)
card=Image.new("RGBA",(900,560),(0,0,0,0)); cd=ImageDraw.Draw(card); cd.rounded_rectangle((0,0,899,559),36,fill=CREAM)
cd.rectangle((0,0,899,90),fill=RED); cd.rounded_rectangle((0,0,899,120),36,fill=RED); cd.rectangle((0,80,899,120),fill=CREAM)
cd.text((40,22),"BOARDING PASS",font=F("Montserrat-ExtraBold.woff",44),fill=W); cd.text((640,30),"RC TRIPS",font=F("Montserrat-ExtraBold.woff",36),fill=W)
cd.text((40,150),"DEL",font=F("Montserrat-ExtraBold.woff",120),fill=K); cd.text((560,150),"KNT",font=F("Montserrat-ExtraBold.woff",120),fill=K)
cd.text((40,280),"Delhi",font=F("Poppins-MediumItalic.woff",34),fill=(90,90,90)); cd.text((560,280),"Kanatal",font=F("Poppins-MediumItalic.woff",34),fill=(90,90,90))
cd.line((330,215,520,215),fill=K,width=4); cd.polygon([(520,215),(495,200),(495,230)],fill=K)
small=F("Montserrat-Medium.woff",26); big=F("Montserrat-ExtraBold.woff",38)
for i,(k,v) in enumerate([("PASSENGER","You + 20"),("DATE","27 NOV"),("SEAT","Window ;)")]):
    x=40+i*290; cd.text((x,350),k,font=small,fill=(110,110,110)); cd.text((x,385),v,font=big if i else big,fill=K)
cd.line((40,460,860,460),fill=(180,170,150),width=2)
for i in range(60):
    x=40+i*13.5; cd.rectangle((x,480,x+random.choice([3,5,8]),530),fill=K)
card=card.rotate(5,expand=True,resample=Image.BICUBIC)
s=Image.new("RGBA",card.size,(0,0,0,0)); s.paste((0,0,0,120),(0,0),card.split()[3]); im.alpha_composite(s.filter(ImageFilter.GaussianBlur(18)),(95,770)); im.alpha_composite(card,(80,750))
d=ImageDraw.Draw(im); g=F("Gloock.woff",110); ctext(d,420,"Your seat is",F("Poppins-MediumItalic.woff",54),W); ctext(d,490,"confirmed.",g,YL)
ctext(d,1440,"₹6,800 • Comment KANATAL",ImageFont.truetype(S+"/fonts/Poppins-ExtraBold.ttf",50),W)
logo(im); im.convert("RGB").save(K3+"c3_boarding.jpg",quality=90)
# 4 WHATSAPP GROUP CHAT
im=fit(S+"/kv3/f_bus.png").filter(ImageFilter.GaussianBlur(3)); im.alpha_composite(Image.new("RGBA",im.size,(0,0,0,90))); d=ImageDraw.Draw(im)
d.rounded_rectangle((120,300,960,400),24,fill=(7,94,84)); d.text((150,318),"Kanatal Trip 27 Nov 🏔".replace(" 🏔",""),font=F("Montserrat-ExtraBold.woff",40),fill=W); d.text((150,362),"21 members",font=F("Montserrat-Medium.woff",24),fill=(200,230,225))
msgs=[("l","Riya","Hi sab, main Noida se 👋".replace(" 👋","")),("l","Aman","Kisi ko jaanta nahi yaha 😅".replace(" 😅","")),("r","","same 😂".replace(" 😂","")),("l","Captain","Bas 2 ghante ruko...")]
y=440; mf=F("Poppins-Bold.woff",40); nf=F("Montserrat-ExtraBold.woff",24)
for side,n,t in msgs:
    w=d.textlength(t,font=mf)+50; h=110 if n else 80
    x=140 if side=="l" else 940-w
    d.rounded_rectangle((x,y,x+w,y+h),22,fill=(255,255,255) if side=="l" else (220,248,198))
    if n: d.text((x+25,y+10),n,font=nf,fill=(7,140,120)); d.text((x+25,y+42),t,font=mf,fill=K)
    else: d.text((x+25,y+14),t,font=mf,fill=K)
    y+=h+24
b=F("Montserrat-ExtraBold.woff",80); t="2 GHANTE BAAD:"; w=d.textlength(t,font=b); d.rectangle(((1080-w)/2-24,1100,(1080+w)/2+24,1210),fill=YL); ctext(d,1110,t,b,K)
ctext(d,1250,"👇 ye hua".replace("👇 ",""),F("Caveat-Bold.woff",90),W)
logo(im); im.convert("RGB").save(K3+"c4_whatsapp.jpg",quality=90)
# 5 POLAROID COLLAGE
base=Image.new("RGBA",(1080,1920),(242,236,224)); d=ImageDraw.Draw(base)
pics=[(S+"/drive2/img/IMG_9561_c.jpg",-8,(70,330),"Manali ❄"),(S+"/kv3/f_bonfire.png",6,(500,600),"bonfire nights"),(S+"/kv3/f_swing.png",-4,(60,1080),"dhundh + swing"),(S+"/kv3/f_bus.png",7,(520,1150),"bus = party")]
for p,rot,(x,y),cap in pics:
    ph=Image.open(p).convert("RGB"); ph=ImageOps.fit(ph,(440,440)); fr=Image.new("RGBA",(500,590),(255,255,255,255)); fr.paste(ph,(30,30))
    ImageDraw.Draw(fr).text((40,488),cap.replace(" ❄",""),font=F("Caveat-Bold.woff",60),fill=K)
    fr=fr.rotate(rot,expand=True,resample=Image.BICUBIC); s=Image.new("RGBA",fr.size,(0,0,0,0)); s.paste((0,0,0,90),(0,0),fr.split()[3])
    base.alpha_composite(s.filter(ImageFilter.GaussianBlur(12)),(x+10,y+14)); base.alpha_composite(fr,(x,y))
    tp=Image.new("RGBA",(160,50),(255,236,150,200)).rotate(rot+random.choice([-20,15]),expand=True); base.alpha_composite(tp,(x+170,y-15))
d=ImageDraw.Draw(base); ctext(d,240,"November dump",F("Gloock.woff",110),K)
ctext(d,1820,"next page pe aap? • Comment TRIP",F("Montserrat-ExtraBold.woff",40),RED)
logo(base,(850,120)); base.convert("RGB").save(K3+"c5_polaroid.jpg",quality=90)
# 6 CAMCORDER Y2K
im=fit(S+"/kv3/f_road.png"); im=Image.blend(im,Image.new("RGBA",im.size,(255,170,90,255)),0.08); im.alpha_composite(Image.new("RGBA",im.size,(0,0,0,80))); d=ImageDraw.Draw(im)
m=F("SpaceMono-Bold.woff",46)
for (x,y,dx,dy) in [(130,300,1,1),(950,300,-1,1),(130,1560,1,-1),(950,1560,-1,-1)]:
    d.line((x,y,x+70*dx,y),fill=W,width=6); d.line((x,y,x,y+70*dy),fill=W,width=6)
d.ellipse((170,350,205,385),fill=RED); d.text((220,340),"REC",font=m,fill=W); d.text((700,340),"00:27:11",font=m,fill=W)
d.text((170,1470),"27 NOV 2026  06:12 AM",font=m,fill=W); d.text((170,1410),"KANATAL, UK",font=m,fill=YL)
d.rectangle((790,1480,900,1520),outline=W,width=4); d.rectangle((800,1490,870,1510),fill=W)
ctext(d,820,"POV:",F("Montserrat-ExtraBold.woff",70),W); ctext(d,910,"subah 6 baje",F("Gloock.woff",110),W); ctext(d,1030,"badalon ke andar",F("Gloock.woff",110),YL)
logo(im); im.convert("RGB").save(K3+"c6_camcorder.jpg",quality=90)
ims=[Image.open(K3+f).resize((360,640)) for f in ["c1_text_behind.jpg","c2_sticker.jpg","c3_boarding.jpg","c4_whatsapp.jpg","c5_polaroid.jpg","c6_camcorder.jpg"]]
shp=Image.new("RGB",(370*3,650*2),"white"); [shp.paste(x,((i%3)*370,(i//3)*650)) for i,x in enumerate(ims)]; shp.save(K3+"creative_preview.jpg",quality=88)
