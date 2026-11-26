import json, re
FPS = 30
# What If Mars Magnet Mati — naskah TERKUNCI user 27 Nov 05:54 (VO dikirim 05:54).
# VO: Generated_Audio_November_27__2026_-_5_53AM.wav -> vo.wav, 92,07 dtk.
# Peta bicara dari silencedetect -40dB (public/silencedetect.txt).
# Kata per paragraf (naskah terkunci, tanpa em dash): [26, 42, 32, 39, 47, 22] = 208
# (210 bila 2 em dash P6 dihitung sebagai token — konvensi sama seperti Cendrawasih).
#
# Pemetaan paragraf -> segmen bicara (batas dipilih dari jeda TERPANJANG yang
# membuat tempo tiap paragraf masuk 2,0-3,5 kata/dtk; outlier >4 = batas salah).
#   P1 0.0000-12.2151    (jeda akhir 12.2151-12.9559, 0,74 dtk)
#   P2 12.9559-30.6352   (jeda akhir 30.6352-31.4357, 0,80 dtk)
#   P3 31.4357-45.4413   (jeda akhir 45.4413-46.0788, 0,64 dtk)
#   P4 46.0788-63.5314   (jeda akhir 63.5314-64.1961, 0,66 dtk)
#   P5 64.1961-82.8553   (jeda akhir 82.8553-83.4605, 0,61 dtk — dua jeda
#                          pendek berurutan 82.855-83.006 + 83.044-83.461)
#   P6 83.4605-91.6985   (VO berakhir 92.07; bicara terakhir sampai 91.70)
# Batas kalimat di dalam paragraf (dari jeda internal silencedetect):
#   P1: S1 berakhir ~3.610 ("...setiap detik."), S2 ~9.862 ("...bocor
#       terus."), S3 10.379-12.215 ("Bayangkan kalau perisai itu tidak
#       pernah padam.").
#   P2: S1 berakhir ~14.685 ("...bukan gurun merah."), S2 ~20.919 ("...kawah
#       Gale."), S3 ~27.676 ("...kawah Jezero."), S4 28.090-30.635.
#   P3: S1 berakhir ~37.548 ("...di inti Mars."), S2 38.104-45.441.
#   P4: S1 berakhir ~49.708 ("...empat miliar tahun lalu."), S2 ~57.693
#       ("...selama miliaran tahun."), S3 58.339-63.531.
#   P5: S1 berakhir ~68.820 ("...atmosfer Mars."), S2 ~74.204 ("...planet
#       biru kedua."), S3 75.961-82.855.
#   P6: S1 berakhir ~89.089 ("...pemicu utamanya."), S2 89.636-91.698
#       (sign-off, 7 kata / 1,91 dtk aktif = 3,66 kata/dtk — dalam rentang
#       sign-off 3,42-3,83 — diterima).
#
# BATAS ADEGAN — potong di tengah jeda ANTAR paragraf (transisi 12f=0,40 dtk
# harus muat di dalam jeda).
#   S1->S2: jeda 12.2151-12.9559 -> 12.59 -> 378. S1 = hook P1 (V1) murni.
#   S2->S3: jeda 30.6352-31.4357 -> 31.04 -> 931. S2 = Mars purba berair (AKSI).
#   S3->S4: jeda 45.4413-46.0788 -> 45.76 -> 1373. S3 = dinamo + perisai P3.
#   S4->S5: jeda 63.5314-64.1961 -> 63.86 -> 1916. S4 = dinamo mati + erosi P4.
#   S5->S6: jeda 82.8553-83.4605 -> 83.16 -> 2495. S5 = andaian + debat P5.
#   S6->outro: VO berakhir 91.70; outro tampil penuh 92.12 dtk -> 2764
talk = [[0.0, 12.215083], [12.955875, 30.635167], [31.435708, 45.441292],
        [46.078833, 63.531417], [64.196125, 82.85525], [83.4605, 91.6985]]
words = [26, 42, 32, 39, 47, 22]

# --- audit tempo: baca jeda dari silencedetect.txt, hitung detik bicara aktif ---
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
cuts = [fmid(12.215083, 12.955875), fmid(30.635167, 31.435708), fmid(45.441292, 46.078833),
        fmid(63.531417, 64.196125), fmid(82.85525, 83.4605), int((91.6985 + 0.42) * FPS + 0.5)]
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
