import sys,librosa,numpy as np
y,sr=librosa.load(sys.argv[1],sr=22050,offset=20,duration=55)
t,b=librosa.beat.beat_track(y=y,sr=sr,units='time')
on=librosa.onset.onset_strength(y=y,sr=sr)
print('tempo',t)
print(' '.join(f'{x+20:.2f}' for x in b))
rms=librosa.feature.rms(y=y)[0];tt=librosa.times_like(rms,sr=sr)+20
for s in range(20,75): print(s,round(float(rms[(tt>=s)&(tt<s+1)].mean()),3),end=' | ')
