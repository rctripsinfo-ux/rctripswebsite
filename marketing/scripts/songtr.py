import sys,subprocess,numpy as np
from faster_whisper import WhisperModel
raw=subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-t','100','-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.int16).astype(np.float32)/32768
m=WhisperModel('small',compute_type='int8')
segs,_=m.transcribe(a,language='hi')
for s in segs: print(f"{s.start:6.1f} {s.end:6.1f} {s.text}")
