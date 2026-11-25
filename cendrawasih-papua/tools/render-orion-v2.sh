#!/bin/bash
# Render ulang segmen 1,2,3,6 Cendrawasih v2 (SuperbBirdAsset direvisi) di orion-01.
# JALANKAN DI MESIN orion-01 SETELAH git pull (file ini + assets2d.tsx v1.22 sudah di repo).
# Prasyarat dari v1 (sudah ada di mesin): public/vo.wav + music.wav + sfx + font,
# node_modules + patch port-config 127.0.0.1, chrome-headless-shell.
# Segmen 4 & 5 TIDAK di-render ulang (tidak mengandung SuperbBirdAsset) — dipakai ulang dari v1.
set -e
cd ~/workspace/sekejap-tahu-renders/cendrawasih-papua
START=$(date +%s)
echo "== $(date) — mulai v2 =="

# Sanity: aset revisi ada di file yang ter-pull
grep -q "paruh kuning kecil di antara mata" src/assets2d.tsx || { echo "ASET V2 TIDAK KETEMU"; exit 1; }
mkdir -p out public public/sfx

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
render_seg "2750-3331" seg6 582

echo "== SEMUA SEGMEN V2 LOLOS, total $(( $(date +%s) - START )) dtk =="

# Push hanya 4 segmen baru (seg4/seg5 tetap versi v1 di repo)
git add -f out/seg1.mp4 out/seg2.mp4 out/seg3.mp4 out/seg6.mp4
git -c user.name="Orion" -c user.email="orion@sekejap.tahu" commit -m "Render segments v2 cendrawasih-papua (SuperbBirdAsset revised, seg 1/2/3/6)"
git push origin main
echo "== SELESAI $(date) — total $(( $(date +%s) - START )) dtk =="
