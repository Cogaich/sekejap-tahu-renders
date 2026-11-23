import json, re
FPS = 30
# Betelgeuse Meledak Besok — naskah TERKUNCI user 23 Nov 22:06 (VO dikirim 22:06).
# VO: Generated_Audio_November_23__2026_-_10_04PM.wav -> vo.wav, 85,08 dtk.
# Peta bicara dari silencedetect -40dB (public/silencedetect.txt).
# Kata per paragraf (dihitung dari naskah terkunci): [16, 47, 33, 35, 37, 42] = 210.
#
# Pemetaan paragraf -> segmen bicara (batas dipilih dari jeda TERPANJANG yang
# membuat tempo tiap paragraf masuk 2,0-3,5 kata/dtk; outlier >4 = batas salah).
#   P1 0.0000-7.7937    (jeda akhir 7.7937-8.2890, 0,50 dtk)
#   P2 8.2890-26.8110   (jeda akhir 26.8110-27.1563, 0,35 dtk)
#   P3 27.1563-41.6669  (jeda akhir 41.6669-42.2122, 0,55 dtk)
#   P4 42.2122-54.5910  (jeda akhir 54.5910-55.4048, 0,81 dtk)
#   P5 55.4048-68.7431  (jeda akhir 68.7431-69.3636, 0,62 dtk)
#   P6 69.3636-84.7678  (VO berakhir 85.08; bicara terakhir sampai 84.77)
# Batas kalimat di dalam paragraf (dari jeda internal silencedetect):
#   P2: S1 berakhir ~15.099 ("...delapan ratus kali Matahari."), S2 ~21.007
#       ("...Bumi, dan Mars."), S3 21.328-26.811 (umur + "hidupnya cepat").
#   P3: S1 berakhir ~33.972 ("...buat sampai ke kita."), S2 34.229-41.667.
#   P5: S1 berakhir ~58.651 ("...cuma andaian."), S2 58.930-68.743.
#   P6: S1 berakhir ~75.148 ("...selamanya."), S2 ~82.432 ("...tahun lalu."),
#       S3 82.745-84.768 (sign-off, 7 kata / 2,02 dtk = 3,47 kata/dtk —
#       sign-off cepat, seperti P6 video sebelumnya 3,42-3,83 — diterima).
#
# BATAS ADEGAN — pola Megalodon v2 / Supermoon: potong di tengah jeda ANTAR
# paragraf (semua jeda antar paragraf 0,35-0,81 dtk, cukup menampung transisi
# 12f=0,40 dtk di dalam jeda).
#   S1->S2: jeda 7.7937-8.2890 -> 8.04 -> 241. S1 = hook P1 (V2) murni.
#   S2->S3: jeda 26.8110-27.1563 -> 26.98 -> 810. S2 = definisi + skala P2.
#   S3->S4: jeda 41.6669-42.2122 -> 41.94 -> 1258. S3 = perjalanan cahaya P3.
#   S4->S5: jeda 54.5910-55.4048 -> 55.00 -> 1650. S4 = tontonan P4.
#   S5->S6: jeda 68.7431-69.3636 -> 69.05 -> 2072. S5 = kejujuran P5.
#   S6->outro: VO berakhir 84.77; outro tampil penuh 85.19 dtk -> 2556
talk = [[0.0, 7.793667], [8.288958, 26.811042], [27.15625, 41.666875],
        [42.212167, 54.590958], [55.404792, 68.743083], [69.363625, 84.767792]]
words = [16, 47, 33, 35, 37, 42]

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
cuts = [fmid(7.793667, 8.288958), fmid(26.811042, 27.15625), fmid(41.666875, 42.212167),
        fmid(54.590958, 55.404792), fmid(68.743083, 69.363625), int((84.767792 + 0.42) * FPS + 0.5)]
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
