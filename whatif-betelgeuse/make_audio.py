import numpy as np
sr = 48000; dur = 93.0; N = int(sr*dur)
t = np.arange(N)/sr
def env_pluck(tt, decay=1.4):
    return np.exp(-tt*decay) * (tt >= 0)
# Langit malam Betelgeuse mood: Am, F, C, G — hangat, luas, sedikit misterius
# (resep V6 terkunci — hanya akor yang berubah, tidak pernah levelnya)
chords = [
 [110.00, 130.81, 164.81, 220.00, 261.63],   # A C E A C (Am)
 [87.31, 110.00, 130.81, 174.61, 220.00],    # F A C F A (F)
 [130.81, 164.81, 196.00, 261.63, 329.63],   # C E G C E (C)
 [98.00, 123.47, 146.83, 196.00, 246.94],    # G B D G B (G)
]
music = np.zeros(N); drums = np.zeros(N)
bar = 4.0; steps = 8  # 8th-note plucks
rng = np.random.default_rng(23)
for b in range(int(dur//bar)+1):
    ch = chords[b % 4]; t0 = b*bar
    # pad: soft sustained chord
    for f in ch[:3]:
        i0 = int(t0*sr); seg = np.arange(N-i0)/sr
        pad = 0.05*np.sin(2*np.pi*f*seg) * np.minimum(1, seg/1.2) * np.exp(-seg*0.12)
        music[i0:] += pad[:N-i0]
    # pluck arpeggio up-down
    pat = [0,1,2,3,4,3,2,1]
    for s_i, idx in enumerate(pat):
        tt0 = t0 + s_i*(bar/steps); i0 = int(tt0*sr)
        if i0 >= N: break
        seg = np.arange(min(N-i0, int(sr*1.2)))/sr
        f = ch[idx]*2
        note = (0.16*np.sin(2*np.pi*f*seg) + 0.06*np.sin(2*np.pi*f*2*seg)) * env_pluck(seg, 3.2)
        music[i0:i0+len(note)] += note
    # soft hat ticks on offbeats + gentle kick on 1
    for s_i in range(steps):
        tt0 = t0 + s_i*(bar/steps) + bar/steps/2; i0 = int(tt0*sr)
        seg = np.arange(int(sr*0.03))/sr
        hat = 0.05*(rng.random(len(seg))-0.5) * np.exp(-seg*160)
        if i0+len(hat) <= N: drums[i0:i0+len(hat)] += hat
    i0 = int(t0*sr); seg = np.arange(int(sr*0.18))/sr
    kick = 0.20*np.sin(2*np.pi*58*seg) * np.exp(-seg*16)
    if i0+len(kick) <= N: drums[i0:i0+len(kick)] += kick
fade = np.minimum(1, np.minimum(t/1.5, (dur-t)/3.5 + 0.0)); fade = np.clip(fade, 0, 1)
music *= fade; drums *= fade
def norm(x, peak=0.9):
    m = np.max(np.abs(x)); return x*(peak/m) if m > 0 else x
music = norm(music); drums = norm(drums)
bed = 0.10/0.95*music + 0.07/0.95*drums  # recipe ratio vs SFX 0.95, baked; Remotion plays bed at 0.5
stereo = np.stack([bed, bed], axis=1)
pcm = (np.clip(stereo, -1, 1)*32767).astype(np.int16)
import wave
w = wave.open('public/music.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
w.writeframes(pcm.tobytes()); w.close()
print('music.wav written', dur, 's')
