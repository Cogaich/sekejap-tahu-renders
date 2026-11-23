#!/bin/bash
# Concat + loudnorm final Betelgeuse di orion-01 — JALANKAN DI MESIN orion-01
# SETELAH tools/render-orion.sh selesai (5 segmen terverifikasi + ter-push).
# JALANKAN DARI folder whatif-betelgeuse/ di repo sekejap-tahu-renders.
# Target: -14 LUFS ±1, TP final -1,2 (rentang final terkirim -0,3 s.d. -1,42).
# Pilihan loudnorm mengikuti preseden: raw memuncak > -1,0 dBFS -> dinamis 1-pass
# (TP -2,0); raw lebih pelan -> linear 2-pass (TP -1,2). Tanpa limiter tambahan.
set -e
cd ~/workspace/sekejap-tahu-renders/whatif-betelgeuse
START=$(date +%s)

# 1. Concat segmen (demuxer baca path relatif dari lokasi file list)
printf 'file seg1.mp4\nfile seg2.mp4\nfile seg3.mp4\nfile seg4.mp4\nfile seg5.mp4\n' > out/concat.txt
ffmpeg -y -v error -f concat -safe 0 -i out/concat.txt -c copy out/video-betelgeuse-raw.mp4
RAW_FRAMES=$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 out/video-betelgeuse-raw.mp4 | tr -dc '0-9')
echo "raw frames: $RAW_FRAMES (expect 2754)"
[ "$RAW_FRAMES" = "2754" ] || { echo "CONCAT GAGAL: frame != 2754"; exit 1; }

# 2. Ukur puncak raw (volumedetect) -> pilih linear vs dinamis
PEAK=$(ffmpeg -i out/video-betelgeuse-raw.mp4 -vn -af volumedetect -f null - 2>&1 | grep 'max_volume' | sed 's/.*max_volume: *//; s/ dB//')
echo "raw max_volume: $PEAK dBFS"
if echo "$PEAK" | awk '{exit ($1 > -1.0) ? 0 : 1}'; then
  MODE="dynamic"
  echo "peak dekat 0 dBFS -> loudnorm DINAMIS 1-pass, TP -2.0"
  ffmpeg -y -v error -i out/video-betelgeuse-raw.mp4 -af loudnorm=I=-14:TP=-2.0:LRA=11:linear=false:print_format=json -c:v copy -c:a aac -b:a 192k out/video-betelgeuse.mp4 2> out/loudnorm-final.json
else
  MODE="linear"
  echo "peak aman -> loudnorm LINEAR 2-pass, TP -1.2"
  ffmpeg -i out/video-betelgeuse-raw.mp4 -vn -af loudnorm=I=-14:TP=-1.2:LRA=11:linear=true:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p' > out/loudnorm-pass1.json
  python3 - <<'PY'
import json
m = json.load(open('out/loudnorm-pass1.json'))
vals = {k: m[k] for k in ('measured_I','measured_TP','measured_LRA','measured_thresh','offset')}
open('out/loudnorm-measured.txt','w').write(' '.join(f"{k}={v}" for k,v in vals.items()))
print('measured:', vals)
PY
  read -r MI MTP MLRA MTH OFF < <(python3 -c "
import json
m=json.load(open('out/loudnorm-pass1.json'))
print(m['measured_I'], m['measured_TP'], m['measured_LRA'], m['measured_thresh'], m['offset'])")
  ffmpeg -y -v error -i out/video-betelgeuse-raw.mp4 -af loudnorm=I=-14:TP=-1.2:LRA=11:linear=true:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:offset=$OFF:print_format=json -c:v copy -c:a aac -b:a 192k out/video-betelgeuse.mp4 2> out/loudnorm-final.json
fi

# 3. Verifikasi final
FINAL_FRAMES=$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 out/video-betelgeuse.mp4 | tr -dc '0-9')
echo "final frames: $FINAL_FRAMES (expect 2754) — mode: $MODE"
[ "$FINAL_FRAMES" = "2754" ] || { echo "FINAL GAGAL: frame != 2754"; exit 1; }
ffmpeg -i out/video-betelgeuse.mp4 -vn -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/{/,/}/p'
ls -la out/video-betelgeuse.mp4
echo "durasi total: $(( $(date +%s) - START )) dtk"

# 4. Push final ke repo (SSH)
git add -f out/video-betelgeuse.mp4
git -c user.name="Orion" -c user.email="orion@sekejap.tahu" commit -m "Final whatif-betelgeuse from orion-01 (2754f, loudnorm $MODE)"
git push origin main
echo "== SELESAI $(date) =="
