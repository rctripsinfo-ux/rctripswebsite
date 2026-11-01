#!/bin/bash
# Re-render all 4 ads WITHOUT background music + add the Red Carpet logo at the end.
# Run from anywhere:  bash marketing/render_all.sh
set -e
S="$(cd "$(dirname "$0")" && pwd)"
r(){ # cfg vo srt end_time final_name
  python3 -I "$S/scripts/render_ad.py" "$S" "$S/vo/$2" "$3" "$S/cfg/$1.py"
  N=$(python3 -c "d={'S':'$S'};exec(open('$S/cfg/$1.py').read(),d);print(d['name'])")
  T=$4
  ffmpeg -v error -y -i "$S/render/$N.mp4" -loop 1 -i "$S/logo/rc.jpg" -filter_complex \
   "[1:v]scale=250:250,format=rgba,fade=t=in:st=$T:d=0.3:alpha=1[l];[0:v][l]overlay=415:270:shortest=1:enable='gte(t,$T)'" \
   -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a copy "$S/render/$5.mp4"
  echo "done -> $S/render/$5.mp4"
}
r k_nm     kanatal2.mp3   "$S/work/kanatal2_fixed.srt" 41.32 Kanatal_Ad_NO_MUSIC
r m_nm     manali.mp3     "$S/vo/manali.srt"           47.3  Manali_Ad_NO_MUSIC
r rish2_nm rishikesh2.mp3 "$S/vo/rishikesh2.srt"       61.56 Rishikesh_Ad_02_NO_MUSIC
r vrind    vrindavan.mp3  "$S/vo/vrindavan.srt"        30.85 Vrindavan_Ad_NO_MUSIC
