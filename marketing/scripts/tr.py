import sys,glob,os,subprocess,numpy as np
from faster_whisper import WhisperModel
m=WhisperModel("small",device="cpu",compute_type="int8")
for f in sorted(glob.glob(sys.argv[1]+"/*.mp4")):
    raw=subprocess.run(["ffmpeg","-v","error","-i",f,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
    a=np.frombuffer(raw,np.int16).astype(np.float32)/32768
    segs,info=m.transcribe(a,language="hi",vad_filter=True)
    print("=== %s"%os.path.basename(f))
    for s in segs: print("[%.1f] %s"%(s.start,s.text.strip()))
