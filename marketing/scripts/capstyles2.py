import sys
from PIL import Image,ImageDraw,ImageFont,ImageFilter
S=sys.argv[1]; D=S+"/render/capstyles/"
f=lambda n,s: ImageFont.truetype(S+"/fonts/"+n,s)
base=Image.open(D+"f.png").convert("RGBA")
Y=(255,214,10); G=(57,255,20)
def words(im,ws,fo,y,cols,stroke=0,sc=(0,0,0),boxidx=None,boxcol=None,boxtext=None,shadow=False,gap=None):
    d=ImageDraw.Draw(im); sp=gap or d.textlength(" ",font=fo)
    tw=sum(d.textlength(w,font=fo) for w in ws)+sp*(len(ws)-1); x=540-tw/2
    if shadow:
        sh=Image.new("RGBA",im.size,(0,0,0,0)); sd=ImageDraw.Draw(sh); xx=x
        for w in ws: sd.text((xx+5,y+7),w,font=fo,fill=(0,0,0,200),anchor="lm",stroke_width=stroke,stroke_fill=(0,0,0,200)); xx+=d.textlength(w,font=fo)+sp
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(5))); d=ImageDraw.Draw(im)
    for i,w in enumerate(ws):
        if i==boxidx:
            bb=d.textbbox((x,y),w,font=fo,anchor="lm"); d.rounded_rectangle((bb[0]-14,bb[1]-12,bb[2]+14,bb[3]+12),radius=14,fill=boxcol)
            d.text((x,y),w,font=fo,fill=boxtext,anchor="lm")
        else: d.text((x,y),w,font=fo,fill=cols[i],anchor="lm",stroke_width=stroke,stroke_fill=sc)
        x+=d.textlength(w,font=fo)+sp
outs=[]
im=base.copy(); words(im,["DELHI","SE","KANATAL"],f("BebasNeue-Regular.ttf",150),1300,["white","white",Y],shadow=True); outs.append(("1 Bebas",im))
im=base.copy(); words(im,["DELHI","SE","KANATAL"],f("Anton-Regular.ttf",120),1300,["white","white",Y],stroke=8); outs.append(("2 Anton",im))
im=base.copy(); words(im,["Delhi","se","Kanatal"],f("ArchivoBlack-Regular.ttf",86),1300,["white","white","x"],stroke=6,boxidx=2,boxcol=Y,boxtext="black"); outs.append(("3 Highlight box",im))
im=base.copy(); words(im,["DELHI","SE","KANATAL"],f("LuckiestGuy-Regular.ttf",110),1300,[Y,Y,Y],stroke=10); outs.append(("4 Fun cartoon",im))
im=base.copy(); words(im,["DELHI","SE","KANATAL"],f("Bangers-Regular.ttf",130),1300,["white","white",(255,70,70)],stroke=8,gap=26); outs.append(("5 Comic",im))
im=base.copy(); words(im,["delhi","se","kanatal"],f("Poppins-ExtraBold.ttf",96),1300,["white","white",G],stroke=7,shadow=True); outs.append(("6 Green pop",im))
W=330;IH=int(W*1220/1080);H=IH; sheet=Image.new("RGB",(W*3+40,(IH+80)*2+10),"white"); sd=ImageDraw.Draw(sheet)
for i,(n,im) in enumerate(outs):
    c,r=i%3,i//3; x=10+c*(W+10); y=10+r*(IH+80)
    sd.text((x+W//2,y+30),n,font=f("Poppins-ExtraBold.ttf",34),fill="black",anchor="mm")
    sheet.paste(im.convert("RGB").crop((0,700,1080,1920)).resize((W,int(W*1220/1080))),(x,y+60))
sheet.save(D+"roman_styles.jpg",quality=90)
