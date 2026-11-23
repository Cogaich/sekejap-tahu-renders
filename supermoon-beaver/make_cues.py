import json, re
FPS = 30
# Supermoon Beaver — naskah TERKUNCI user 23 Nov 13:10 ("Oke, ini dia" + VO).
# VO: Generated_Audio_November_23__2026_-_1_09PM.wav -> vo.wav, 84.56 dtk.
# Peta bicara dari silencedetect -40dB (public/silencedetect.txt).
# Kata per paragraf (dihitung dari naskah terkunci): [19, 41, 48, 36, 38, 28] = 210.
#
# Pemetaan paragraf -> segmen bicara (batas dipilih dari jeda TERPANJANG yang
# membuat tempo tiap paragraf masuk 2,0-3,5 kata/dtk; outlier >4 = batas salah).
#   P1 0.0000-7.6474    (jeda akhir 7.6474-8.0980, 0,45 dtk)
#   P2 8.0980-23.4381   (jeda akhir 23.4381-24.1523, 0,71 dtk)
#   P3 24.1523-42.8718  (jeda akhir 42.8718-43.5020, 0,63 dtk)
#   P4 43.5020-56.7190  (jeda akhir 56.7190-57.5550, 0,84 dtk)
#   P5 57.5550-73.5572  (jeda akhir 73.5572-74.5935, 1,04 dtk)
#   P6 74.5935-84.5600  (VO berakhir 84.56; bicara terakhir sampai akhir file)
# Audit tempo (kata / detik bicara aktif, jeda internal dikeluarkan):
#   P1 19/7.22=2.63 | P2 41/13.83=2.96 | P3 48/15.90=3.02 |
#   P4 36/11.10=3.24 | P5 38/13.06=2.91 | P6 28/8.18=3.42 (sign-off cepat,
#   seperti P6 video sebelumnya 3,58-3,83 — diterima).
# Catatan P6 kalimat 2 ("Bulan purnama yang lebih besar...") 13 kata / 3,21 dtk
# = 4,05 kata/dtk per kalimat — tapi audit PARAGRAF 3,42 (dalam rentang); batas
# kalimatnya diapit jeda padat 0,63 + 0,76 dtk, jadi bukan batas salah.
# Hipotesis P2/P3: potongan "Hasilnya:" (24.15-24.74) milik P3, bukan ekor P2 —
# tempo kalimat pertama P3 3,30 (vs 3,73 kalau "Hasilnya:" dihitung ke P2).
#
# BATAS ADEGAN — pola Megalodon v2: potong di jeda ANTAR paragraf (semua jeda
# antar paragraf di sini 0,45-1,04 dtk, cukup menampung transisi 12f=0,40 dtk
# di dalam jeda). TIDAK dipakai potongan di dalam paragraf berikut karena
# kalimat pertama tiap paragraf berikut adalah beat visual kuncinya:
#   S1->S2: jeda 7.6474-8.0980 -> 7.87 -> 236. S1 = hook P1 murni.
#   S2->S3: jeda 23.4381-24.1523 -> 23.80 -> 714. S2 = definisi + jarak P2;
#           kalimat pertama P3 ("Hasilnya: 7%...") adalah beat angka S3.
#   S3->S4: jeda 42.8718-43.5020 -> 43.19 -> 1296. S3 = angka + panduan P3;
#           kalimat pertama P4 ("Tapi jujur saja...") adalah beat kejujuran S4.
#   S4->S5: jeda 56.7190-57.5550 -> 57.14 -> 1714. S4 = kejujuran P4;
#           kalimat pertama P5 ("Namanya Beaver Moon...") adalah beat nama S5.
#   S5->S6: jeda 73.5572-74.5935 -> 74.08 -> 2222. S5 = nama + peta langit P5;
#           kalimat pertama P6 ("Jadi malam ini...") adalah ajakan + bookend S6.
#   S6->outro: VO berakhir 84.56; outro tampil penuh 84.98 dtk -> 2549
talk = [[0.0, 7.647375], [8.098042, 23.438125], [24.152292, 42.871833],
        [43.501958, 56.719], [57.555042, 73.557208], [74.5935, 84.56]]
words = [19, 41, 48, 36, 38, 28]

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
cuts = [fmid(7.647375, 8.098042), fmid(23.438125, 24.152292), fmid(42.871833, 43.501958),
        fmid(56.719, 57.555042), fmid(73.557208, 74.5935), int((84.56 + 0.42) * FPS + 0.5)]
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
