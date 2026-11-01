import sys
from PIL import Image,ImageDraw,ImageFont
S=sys.argv[1]; D=S+"/render/capstyles/"
P=ImageFont.truetype(S+"/fonts/Poppins-ExtraBold.ttf",1); 
def f(n,s): return ImageFont.truetype(S+"/fonts/"+n,s)
base=Image.open(D+"f.png").convert("RGBA")
outs=[]
# A: Hindi Devanagari, white w/ black outline
im=base.copy(); d=ImageDraw.Draw(im)
d.text((540,1350),"सिर्फ़ ₹6,800 में",font=f("NotoSansDevanagari.ttf",110),fill="white",anchor="mm",stroke_width=9,stroke_fill="black"); outs.append(("A  Hindi",im))
# B: one big word center
im=base.copy(); d=ImageDraw.Draw(im)
d.text((540,960),"₹6,800",font=f("Poppins-ExtraBold.ttf",210),fill=(255,214,10),anchor="mm",stroke_width=12,stroke_fill="black"); outs.append(("B  Big word",im))
# C: clean box, sentence case
im=base.copy(); ov=Image.new("RGBA",im.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
fo=f("Poppins-ExtraBold.ttf",64); t="Sirf ₹6,800 mein"
bb=d.textbbox((540,1450),t,font=fo,anchor="mm"); d.rounded_rectangle((bb[0]-34,bb[1]-24,bb[2]+34,bb[3]+24),radius=22,fill=(0,0,0,175))
d.text((540,1450),t,font=fo,fill="white",anchor="mm"); im.alpha_composite(ov); outs.append(("C  Clean box",im))
# D: keyword sticker only
im=base.copy(); d=ImageDraw.Draw(im); fo=f("Poppins-ExtraBold.ttf",120)
bb=d.textbbox((540,820),"₹6,800",font=fo,anchor="mm"); d.rounded_rectangle((bb[0]-40,bb[1]-30,bb[2]+40,bb[3]+30),radius=30,fill=(220,30,40))
d.text((540,820),"₹6,800",font=fo,fill="white",anchor="mm"); d.text((540,960),"ALL INCLUDED",font=f("Poppins-ExtraBold.ttf",60),fill="white",anchor="mm",stroke_width=6,stroke_fill="black"); outs.append(("D  Sticker only",im))
W=360;H=640; sheet=Image.new("RGB",(W*4+50,H+90),"white"); sd=ImageDraw.Draw(sheet)
for i,(n,im) in enumerate(outs):
    sheet.paste(im.convert("RGB").resize((W,H)),(10+i*(W+10),80)); sd.text((10+i*(W+10)+W//2,40),n,font=f("Poppins-ExtraBold.ttf",36),fill="black",anchor="mm")
sheet.save(D+"caption_styles.jpg",quality=90)
