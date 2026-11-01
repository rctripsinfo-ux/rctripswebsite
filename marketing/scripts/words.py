import sys,subprocess,numpy as np,json
from faster_whisper import WhisperModel
m=WhisperModel("small",device="cpu",compute_type="int8")
for f in sys.argv[1:]:
    raw=subprocess.run(["ffmpeg","-v","error","-i",f,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
    a=np.frombuffer(raw,np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(a,language="hi",word_timestamps=True)
    W=[]
    print("===",f.split('/')[-1])
    for s in segs:
        print("[%.1f-%.1f] %s"%(s.start,s.end,s.text.strip()))
        W+= [dict(w=x.word.strip(),s=round(x.start,2),e=round(x.end,2)) for x in s.words]
    json.dump(W,open(f+".words.json","w"),ensure_ascii=False)
