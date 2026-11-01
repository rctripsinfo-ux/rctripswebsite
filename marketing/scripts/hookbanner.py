import sys
src=open(sys.argv[0].replace("hookbanner.py","hookstyles.py")).read(); src=src[:src.index("L1=")]
sys.argv=[sys.argv[0],sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],sys.argv[7]]
g={"__name__":"x"}; exec(src.replace("S=sys.argv[1]","S=sys.argv[1]"),g)
from PIL import Image
S,out,t1,emo,t2,t3,t4=sys.argv[1:8]
im=Image.new("RGBA",(1080,560),(0,0,0,0)); F=g["F"]; line=g["line"]; Y=(255,214,10)
line(im,140,t1,F("Poppins-ExtraBoldItalic.ttf",88),"white",emo=emo,shadow=True,stroke=4)
line(im,250,t2,F("Poppins-ExtraBoldItalic.ttf",70),Y,shadow=True,stroke=4)
line(im,350,t3,F("Poppins-SemiBold.ttf",30),"white",(0,0,0,150),pad=(24,10),rad=10)
line(im,420,t4,F("Poppins-SemiBold.ttf",32),"white",shadow=True,stroke=2)
im.save(out)
