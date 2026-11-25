import json, re
FPS = 30
# Cendrawasih Papua — naskah TERKUNCI user 25 Nov 22:40 (VO dikirim 22:40).
# VO: Generated_Audio_November_25__2026_-_10_37PM.wav -> vo.wav, 104,42 dtk.
# Peta bicara dari silencedetect -40dB (public/silencedetect.txt).
# Kata per paragraf (dihitung dari naskah terkunci): [24, 44, 36, 39, 48, 19] = 210.
#
# Pemetaan paragraf -> segmen bicara (batas dipilih dari jeda TERPANJANG yang
# membuat tempo tiap paragraf masuk 2,0-3,5 kata/dtk; outlier >4 = batas salah).
# Kandidat batas P4/P5/P6 diuji 5 kombinasi; pemenang dipilih dari tempo
# KALIMAT (bukan cuma paragraf): P6 harus mulai 93.94 supaya sign-off
# 101.67-104.05 = 3,82 kata/dtk (rentang sign-off video sebelumnya 3,42-3,83);
# P6 mulai 96.52 bikin sign-off 5,26 kata/dtk (mustahil) -> gugur.
#   P1 0.0000-12.4787    (jeda akhir 12.4787-13.7105, 1,23 dtk)
#   P2 13.7105-33.4769   (jeda akhir 33.4769-34.6285, 1,15 dtk)
#   P3 34.6285-53.2819   (jeda akhir 53.2819-54.8449, 1,56 dtk — ganda)
#   P4 54.8449-71.8848   (jeda akhir 71.8848-72.6538, 0,77 dtk)
#   P5 72.6538-93.3524   (jeda akhir 93.3524-93.9391, 0,59 dtk)
#   P6 93.9391-104.0518  (VO berakhir 104.42; bicara terakhir sampai 104.05)
# Tempo paragraf: P1 1,92? (dihitung di bawah — audit assert 2,0-3,5;
# P1 24 kata / bicara aktif — lihat output).
# Batas kalimat di dalam paragraf (dari jeda internal silencedetect):
#   P1: S1 berakhir ~8.068 ("...menyentuh tanah."), S2 ~10.943 ("Padahal
#       kakinya ada."), S3 11.315-12.479 ("Dipakai buat nari.").
#   P2: S1 berakhir ~16.371 ("...superb, jantan."), S2 ~24.337 ("...wajah
#       senyum yang melayang."), S3 ~28.641 ("...betina mau."), S4 29.607-33.477.
#   P3: S1+S2+S3 triplet cepat 34.629-39.362 (12 kata, 3,46 kata/dtk),
#       S4 berakhir ~46.247 ("...paling gelap di alam."), S5 47.039-53.282.
#   P4: S1 berakhir ~60.718, S2 ~66.134, S3 66.898-71.885.
#   P5: S1 berakhir ~74.785, S2 ~80.423, S3 ~88.766, S4 89.764-93.352
#       (S4 13 kata / 3,15 dtk aktif = 4,13 kata/dtk — kalimat ekor cepat;
#       tempo PARAGRAF P5 tetap 3,22 (dalam rentang) — diterima, dicatat).
#   P6: S1 berakhir ~100.725 ("...dipakai buat nari."), S2 101.673-104.052
#       (sign-off, 7 kata / 1,83 dtk = 3,82 kata/dtk — dalam rentang
#       sign-off 3,42-3,83 — diterima).
#
# BATAS ADEGAN — potong di tengah jeda ANTAR paragraf (transisi 12f=0,40 dtk
# harus muat di dalam jeda).
#   S1->S2: jeda 12.4787-13.7105 -> 13.09 -> 393. S1 = hook P1 (V1) murni.
#   S2->S3: jeda 33.4769-34.6285 -> 34.05 -> 1022. S2 = tarian P2 (AKSI).
#   S3->S4: jeda 53.2819-54.8449 -> 54.06 -> 1622. S3 = seleksi + bulu P3.
#   S4->S5: jeda 71.8848-72.6538 -> 72.27 -> 2168. S4 = keluarga 45 jenis P4.
#   S5->S6: jeda 93.3524-93.9391 -> 93.65 -> 2809. S5 = asal mitos + bulu P5.
#   S6->outro: VO berakhir 104.05; outro tampil penuh 104.47 dtk -> 3134
talk = [[0.0, 12.478667], [13.7105, 33.476917], [34.628542, 53.281875],
        [54.844917, 71.884792], [72.65375, 93.352375], [93.939083, 104.051792]]
words = [24, 44, 36, 39, 48, 19]

# --- audit tempo: baca jeda dari silencedetect.txt, hitung detik bicara aktif ---
gaps = []
with open('public/silencedetect.txt') as fh:
    lines = fh.read().splitlines()
starts = [float(re.search(r'silence_start: ([\d.]+)', l).group(1)) for l in lines if 'silence_start' in l]
ends = [float(re.search(r'silence_end: ([\d.]+)', l).group(1)) for l in lines if 'silence_end' in l]
gaps = list(zip(starts, ends))
for i, ((s, e), w) in enumerate(zip(talk, words)):
    speech = (e - s) - sum(max(0.0, min(ge, e) - max(gs, s)) for gs, ge in gaps)
    tempo = w / speech
    print(f'P{i+1}: {w} kata / {speech:.2f} dtk bicara = {tempo:.2f} kata/dtk')
    assert 2.0 <= tempo <= 3.5, f'P{i+1} tempo outlier!'

def fmid(a, b):
    return int((a + b) / 2 * FPS + 0.5)
cuts = [fmid(12.478667, 13.7105), fmid(33.476917, 34.628542), fmid(53.281875, 54.844917),
        fmid(71.884792, 72.65375), fmid(93.352375, 93.939083), int((104.051792 + 0.42) * FPS + 0.5)]
trans = 12
scenes = [cuts[0]] + [cuts[i] - cuts[i-1] + trans for i in range(1, len(cuts))] + [210]
abs_starts, acc = [], 0
for i, d in enumerate(scenes):
    abs_starts.append(acc); acc += d - (trans if i < len(scenes) - 1 else 0)
total = abs_starts[-1] + scenes[-1]
json.dump({"fps": FPS, "scenes": scenes, "trans": trans, "absStarts": abs_starts,
           "total": total, "totalFrames": total, "talkSegs": talk},
          open("src/cues.json", "w"), indent=1)
print("cuts:", cuts)
print("scenes:", scenes, "abs:", abs_starts, "total:", total, f"= {total/FPS:.2f} s")
