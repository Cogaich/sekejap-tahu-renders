import json, re
FPS = 30
# Venus Paling Terang Besok Subuh — naskah TERKUNCI user 28 Nov 10:27 WIB
# (VO dikirim 10:27, adopsi teks final apa adanya; transkrip otomatis diabaikan).
# VO: Generated_Audio_November_28__2026_-_10_27AM.wav -> vo.wav, 90,99 dtk.
# Peta bicara dari silencedetect -40dB (public/silencedetect.txt).
# Kata per paragraf (naskah terkunci, tanpa em dash): [24, 34, 40, 41, 41, 30] = 210
# P6 dihitung 37 di audit tempo (30 kata naskah + 7 kata sign-off
# "Aku Kejap, sampai jumpa di video berikutnya!" — konvensi sama seperti
# Mars Magnet: sign-off masuk segmen bicara terakhir).
#
# Pemetaan paragraf -> segmen bicara (batas dipilih dari jeda TERPANJANG yang
# membuat tempo tiap paragraf masuk 2,0-3,5 kata/dtk; outlier >4 = batas salah).
#   P1 0.0000-9.5578     (jeda akhir 9.5578-10.5482, 0,99 dtk)
#   P2 10.5482-23.7010   (jeda akhir 23.7010-24.8200, 1,12 dtk)
#   P3 24.8200-41.4985   (jeda akhir 41.4985-42.4485, 0,95 dtk)
#   P4 42.4485-58.1041   (jeda akhir 58.1041-58.9940, 0,89 dtk)
#   P5 58.9940-75.2221   (jeda akhir 75.2221-76.2253, 1,00 dtk)
#   P6 76.2253-90.6819   (VO berakhir 90,99; bicara terakhir sampai 90,68)
# Batas kalimat di dalam paragraf (dari jeda internal silencedetect):
#   P1: S1 berakhir ~6.880 ("...di langit."), S2 7.129-9.558
#       ("Dan itu bukan bintang, itu Venus — di terang-terangnya.").
#   P2: S1 berakhir ~17.011 ("...minus empat koma sembilan."), S2 17.506-23.701
#       ("Dia terbit sekitar jam tiga, dan sejam sebelum Matahari terbit
#       dia sudah dua puluh tiga derajat di langit timur.").
#   P3: S1 berakhir ~28.058 ("...saat dia purnama."), S2 28.620-32.487
#       ("...dua puluh tujuh persennya yang kena cahaya."), S3 33.038-38.500
#       ("...enam puluh juta kilometer."), S4 39.128-41.499
#       ("Sabit besar yang dekat — itu resepnya.").
#   P4: S1 berakhir ~43.663 ("Ini soal timbang-menimbang."), S2 44.088-48.572
#       ("...Venus menjauh."), S3 48.956-52.047 ("...makin membesar."),
#       S4 52.666-58.104 ("...sudah cukup tebal.").
#   P5: S1 berakhir ~60.784 ("Dua tetangga di langit yang sama."),
#       S2 61.278-68.023 ("...lebih dari seratus kali lebih redup."),
#       S3 68.390-75.222 ("...kelihatan tanpa teropong.").
#   P6: S1 berakhir ~79.524 ("...lihat ke timur."), S2 80.084-87.638
#       ("...dan besok dia di terang-terangnya."), sign-off 88.333-90.682
#       ("Aku Kejap, sampai jumpa di video berikutnya!" — 7 kata / 2,02 dtk
#       aktif = 3,47 kata/dtk — dalam rentang sign-off 3,42-3,83 — diterima).
#
# BATAS ADEGAN — potong di tengah jeda ANTAR paragraf (transisi 12f=0,40 dtk
# harus muat di dalam jeda).
#   S1->S2: jeda 9.5578-10.5482 -> 10.05 -> 302. S1 = hook P1 (V1) murni.
#   S2->S3: jeda 23.7010-24.8200 -> 24.26 -> 728. S2 = AKSI: Venus terbit +
#           naik ke 23 derajat (profil ketinggian + jam).
#   S3->S4: jeda 41.4985-42.4485 -> 41.97 -> 1259. S3 = paradoks sabit P3
#           (teropong + perbandingan fase).
#   S4->S5: jeda 58.1041-58.9940 -> 58.55 -> 1756. S4 = mekanisme P4
#           (peta orbit + luas terang maksimum).
#   S5->S6: jeda 75.2221-76.2253 -> 75.72 -> 2272. S5 = tetangga P5
#           (Spica + Merkurius menjelang fajar).
#   S6->outro: VO berakhir 90.68; outro tampil penuh 91.10 dtk -> 2733
talk = [[0.0, 9.557833], [10.548167, 23.700958], [24.819958, 41.4985],
        [42.448542, 58.104083], [58.994042, 75.222125], [76.225333, 90.681917]]
words = [24, 34, 40, 41, 41, 37]

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
cuts = [fmid(9.557833, 10.548167), fmid(23.700958, 24.819958), fmid(41.4985, 42.448542),
        fmid(58.104083, 58.994042), fmid(75.222125, 76.225333), int((90.681917 + 0.42) * FPS + 0.5)]
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
