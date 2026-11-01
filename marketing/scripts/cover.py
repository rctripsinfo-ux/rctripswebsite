import sys
from PIL import Image,ImageDraw,ImageFont,ImageEnhance,ImageFilter
S=sys.argv[1]; C=S+"/cover/"
def fill(im,w,h,cy=.5):
    r=max(w/im.width,h/im.height); im=im.resize((round(im.width*r),round(im.height*r)),Image.LANCZOS)
    x=(im.width-w)//2; y=int((im.height-h)*cy); return im.crop((x,y,x+w,y+h))
top=fill(Image.open(C+"top.png").convert("RGB"),1080,900,.55)
bot=fill(Image.open(C+"bot.png").convert("RGB"),1080,1020,.35)
c=Image.new("RGB",(1080,1920)); c.paste(top,(0,0)); c.paste(bot,(0,900))
c=ImageEnhance.Color(c).enhance(1.2); c=ImageEnhance.Contrast(c).enhance(1.06)
# dark band behind title
ov=Image.new("RGBA",(1080,1920),(0,0,0,0)); d=ImageDraw.Draw(ov)
for i in range(260): d.line([(0,770+i),(1080,770+i)],fill=(0,0,0,int(170*min(1,(130-abs(i-130))/60))))
c=Image.alpha_composite(c.convert("RGBA"),ov)
d=ImageDraw.Draw(c); F=S+"/fonts/Poppins-ExtraBold.ttf"
d.text((540,735),"DELHI SE",font=ImageFont.truetype(F,64),fill="white",anchor="mm",stroke_width=6,stroke_fill="black")
d.text((540,855),"KANATAL",font=ImageFont.truetype(F,190),fill=(255,214,10),anchor="mm",stroke_width=10,stroke_fill="black")
# price pill
pf=ImageFont.truetype(F,62); t="Weekend Trip  ₹6,800"
bb=d.textbbox((540,1010),t,font=pf,anchor="mm"); d.rounded_rectangle((bb[0]-34,bb[1]-18,bb[2]+34,bb[3]+18),radius=40,fill=(230,30,50))
d.text((540,1010),t,font=pf,fill="white",anchor="mm")
c.convert("RGB").save(C+"Kanatal_Reel_01_cover.jpg",quality=92)
