#!/bin/bash
# Render What If Mars Magnet Mati di orion-01 (Instabox) — JALANKAN DI MESIN orion-01.
# Ditulis baru dari skill instabox_remotion_render (2026-11-27).
# Repo transfer: Cogaich/sekejap-tahu-renders (public, main), project di folder whatif-mars-magnet/.
# Prasyarat di mesin: git + SSH key GitHub (orion-01-instabox), ffmpeg + python3-numpy, Node 22, npm.
# Total frame 2962 (98,73 dtk) — 6 segmen @ ~550 frame, concurrency 2.
set -e
if [ ! -d ~/workspace/sekejap-tahu-renders ]; then
  git clone git@github.com:Cogaich/sekejap-tahu-renders.git ~/workspace/sekejap-tahu-renders
fi
cd ~/workspace/sekejap-tahu-renders
git pull origin main

# Repo hanya menampung project yang SEDANG jalan — hapus folder project sebelumnya.
if [ -d cendrawasih-papua ]; then
  git rm -r cendrawasih-papua
  git -c user.name="Orion" -c user.email="orion@sekejap.tahu" commit -m "Remove cendrawasih-papua (project selesai, arsip lokal + git history)"
  git push origin main
fi

cd whatif-mars-magnet
START=$(date +%s)
echo "== $(date) — mulai setup =="

# 1. Decode biner dari file .b64 (di-push via GitHub karena VM tidak bisa git push)
#    vo.wav ditransfer sebagai FLAC lossless (PCM round-trip md5-identik), lalu di-decode kembali ke WAV.
mkdir -p public public/sfx
cat b64/vo.flac.b64.* | base64 -d > /tmp/vo.flac
ffmpeg -y -v error -i /tmp/vo.flac public/vo.wav
rm -f /tmp/vo.flac
cat b64/logo.png.b64.* | base64 -d > public/logo.png
for f in b64/sfx/*.wav.b64; do
  base64 -d "$f" > "public/sfx/$(basename "$f" .wav.b64).wav"
done
ls -la public/vo.wav public/logo.png public/sfx/
ffprobe -v error -show_entries format=duration -of csv=p=0 public/vo.wav

# 2. Dependensi (tanpa package-lock.json -> npm install; package.json pin EXACT semua dep)
npm install --no-audit --no-fund
cp node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2 public/pop-600.woff2
cp node_modules/@fontsource/poppins/files/poppins-latin-900-normal.woff2 public/pop-900.woff2
# Patch host Remotion (sama seperti di VM Muse): paksa 127.0.0.1
echo "exports.getHostsToTry = () => ['127.0.0.1'];" >> node_modules/@remotion/renderer/dist/port-config.js

# 3. Regenerasi music.wav (make_audio.py butuh numpy saja, resep V6 terkunci)
python3 make_audio.py
ls -la public/music.wav

# 4. Chrome headless shell untuk Remotion
npx remotion browser install chrome-headless-shell || true

# 5. Render 6 segmen + verifikasi ffprobe tiap segmen SEBELUM lanjut
mkdir -p out
render_seg() {
  local frames="$1" name="$2" expect="$3"
  local t0=$(date +%s)
  echo "== $(date) — render $name (frames $frames, expect $expect) =="
  npx remotion render src/index.ts Main "out/$name.mp4" --frames="$frames" --concurrency=2 --log=verbose
  local actual
  actual=$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of csv=p=0 "out/$name.mp4" | tr -dc '0-9')
  echo "$name: expect $expect, got $actual, durasi $(( $(date +%s) - t0 )) dtk"
  [ "$actual" = "$expect" ] || { echo "SEGMENT $name GAGAL (expect $expect, got $actual)"; exit 1; }
}
render_seg "0-549"     seg1 550
render_seg "550-1099"  seg2 550
render_seg "1100-1649" seg3 550
render_seg "1650-2199" seg4 550
render_seg "2200-2749" seg5 550
render_seg "2750-2961" seg6 212

echo "== SEMUA SEGMEN LOLOS, total $(( $(date +%s) - START )) dtk =="

# 6. Push segmen ke repo (SSH — key orion-01-instabox)
git add -f out/seg1.mp4 out/seg2.mp4 out/seg3.mp4 out/seg4.mp4 out/seg5.mp4 out/seg6.mp4
git -c user.name="Orion" -c user.email="orion@sekejap.tahu" commit -m "Render segments whatif-mars-magnet from orion-01 (6 segmen, ffprobe-verified)"
git push origin main
echo "== SELESAI $(date) — total $(( $(date +%s) - START )) dtk =="
