import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {MascotAsset, MoonAsset, SunAsset} from './assets2d';
import {Outro} from './Outro';
import cues from './cues.json';

const W = 1080, H = 1920, FPS = 30;
const GREEN = '#1F2A24', BEIGE = '#FEE5B2', CREAM = '#FFF6DE', AMBER = '#DE920C', SAGE = '#4E6B5B';
const NIGHT1 = '#070F1E', NIGHT2 = '#12233F', NIGHT3 = '#24365C', SAGE_L = '#A8BFA9';
const clampO = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const lin = (f: number, a: number, b: number, from = 0, to = 1, easing: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], {...clampO, easing});
const spr = (f: number, delay = 0, damping = 11, stiffness = 170) =>
  spring({frame: Math.max(0, f - delay), fps: FPS, config: {damping, stiffness, mass: 0.7}});

const useFonts = () => {
  React.useEffect(() => {
    const mk = (fam: string, file: string, wgt: string) => {
      const ff = new FontFace(fam, `url(${staticFile(file)})`, {weight: wgt});
      ff.load().then((l) => document.fonts.add(l)).catch(() => undefined);
    };
    mk('Pop', 'pop-600.woff2', '600'); mk('Pop', 'pop-900.woff2', '900');
  }, []);
};

const KejapAt: React.FC<{x: number; y: number; w: number; mood?: 'default' | 'takjub' | 'mikir' | 'skeptis' | 'senang'; from: number}> =
({x, y, w, mood = 'default', from}) => {
  const frame = useCurrentFrame();
  const t = (frame + from) / FPS;
  const talking = (cues.talkSegs as number[][]).some(([s, e]) => t >= s && t <= e);
  return <MascotAsset frame={frame + from} x={x} y={y} w={w} mood={mood} talk={talking} />;
};

const Chip: React.FC<{f: number; at: number; x: number; y: number; text: string; bg?: string; color?: string; size?: number}> =
({f, at, x, y, text, bg = CREAM, color = GREEN, size = 36}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) scale(${spr(f, at, 10, 190)})`,
    background: bg, color, fontFamily: 'Pop', fontWeight: 900, fontSize: size, letterSpacing: 1,
    padding: '14px 30px', borderRadius: 999, boxShadow: '0 10px 26px rgba(0,0,0,0.45)', whiteSpace: 'nowrap'}}>{text}</div>
);

const KineticWords: React.FC<{f: number; at: number; words: string[]; x: number; y: number; size?: number; color?: string; align?: 'left' | 'center'}> =
({f, at, words, x, y, size = 64, color = CREAM, align = 'left'}) => (
  <div style={{position: 'absolute', left: align === 'center' ? 0 : x, top: y, width: align === 'center' ? W : undefined,
    padding: align === 'center' ? '0 60px' : undefined, boxSizing: 'border-box'}}>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: size * 0.26, justifyContent: align === 'center' ? 'center' : 'flex-start',
      fontFamily: 'Pop', fontWeight: 900, fontSize: size, color, lineHeight: 1.12}}>
      {words.map((w, i) => {
        const p = spr(f, at + i * 4, 10, 190);
        return <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.1}}>
          <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 118}%) rotate(${(1 - p) * 4}deg)`}}>{w}</span></span>;
      })}
    </div>
  </div>
);

// Ombak Sekejap helpers (same as mars-jupiter / harimau / komodo / uranus / badak)
const waveY = (x: number, t: number, base: number, dir: 1 | -1) =>
  base + Math.sin(x * 0.011 + t * 2.6) * 15 + Math.sin(x * 0.0042 - t * 1.7) * 21;
const wavePath = (prog: number, t: number, dir: 1 | -1) => {
  const base = dir === 1 ? H + 140 - prog * (H + 300) : -140 + prog * (H + 300);
  let d = dir === 1 ? `M0 ${H} L0 ${waveY(0, t, base, dir)}` : `M0 0 L0 ${waveY(0, t, base, dir)}`;
  for (let x = 60; x <= W; x += 60) d += ` L${x} ${waveY(x, t, base, dir)}`;
  d += dir === 1 ? ` L${W} ${H} Z` : ` L${W} 0 Z`;
  return d;
};
const rimPath = (prog: number, t: number, dir: 1 | -1) => {
  const base = dir === 1 ? H + 140 - prog * (H + 300) : -140 + prog * (H + 300);
  let d = `M0 ${waveY(0, t, base, dir)}`;
  for (let x = 60; x <= W; x += 60) d += ` L${x} ${waveY(x, t, base, dir)}`;
  return d;
};
const WaveRim: React.FC<{prog: number; t: number; dir: 1 | -1}> = ({prog, t, dir}) => (
  <svg width={W} height={H} style={{position: 'absolute', pointerEvents: 'none'}}>
    <path d={rimPath(prog, t, dir)} fill="none" stroke={AMBER} strokeWidth={11} strokeLinecap="round" opacity={0.95} />
    {Array.from({length: 14}).map((_, i) => {
      const bx = 40 + i * 76 + Math.sin(i * 7.3) * 18;
      return <circle key={i} cx={bx} cy={waveY(bx, t, dir === 1 ? H + 140 - prog * (H + 300) : -140 + prog * (H + 300), dir) - 22 - (i % 4) * 12} r={4 + (i % 3) * 2.4} fill={CREAM} opacity={0.9} />;
    })}
  </svg>
);

/** Langit malam — kanvas tema seluruh video (amandemen latar 2, S1 ngikut tema).
    Dipakai ulang dari Uranus (tanpa perubahan): bintang berkelip + ufuk utara. */
const NightBg: React.FC<{drift?: number}> = ({drift = 0}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${NIGHT1} 0%, ${NIGHT2} 62%, ${NIGHT3} 100%)`}}>
      {Array.from({length: 70}).map((_, i) => {
        const sx = random(`nx${i}`) * W, sy = random(`ny${i}`) * 1150;
        const tw = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(f * 0.05 + i * 2.4));
        return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: 3 + random(`nr${i}`) * 4,
          height: 3 + random(`nr${i}`) * 4, borderRadius: '50%', background: '#FFEFC4', opacity: tw}} />;
      })}
      {Array.from({length: 8}).map((_, i) => {
        const sx = 80 + random(`bx${i}`) * (W - 160), sy = 120 + random(`by${i}`) * 900;
        return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: 7, height: 7, borderRadius: '50%',
          background: '#FFFFFF', opacity: 0.5 + 0.4 * Math.sin(f * 0.04 + i * 1.7),
          boxShadow: '0 0 14px rgba(255,255,255,0.7)'}} />;
      })}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 500,
        background: 'radial-gradient(ellipse 90% 100% at 50% 0%, rgba(90,140,200,0.22), transparent 70%)'}} />
      <div style={{position: 'absolute', left: -100, top: 500, width: 700, height: 260, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(150,180,220,0.06) 0%, rgba(150,180,220,0) 70%)'}} />
      <div style={{position: 'absolute', right: -150, top: 900, width: 800, height: 300, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(150,180,220,0.05) 0%, rgba(150,180,220,0) 70%)'}} />
      <svg width={W} height={220} style={{position: 'absolute', bottom: 0, left: 0, transform: `translateX(${drift}px)`}}>
        <path d="M0,220 L0,120 Q180,60 360,110 Q540,150 720,90 Q900,40 1080,100 L1080,220 Z" fill="#050A14" opacity={0.9} />
      </svg>
    </AbsoluteFill>
  );
};

/** Gugus Pleiades — 7 bintang bergerombol (dipakai ulang dari Uranus). */
const Pleiades: React.FC<{x: number; y: number; s?: number; opacity?: number}> = ({x, y, s = 1, opacity = 1}) => (
  <svg width={220 * s} height={170 * s} viewBox="0 0 220 170" style={{position: 'absolute', left: x, top: y, opacity}}>
    {[[60, 80, 9], [110, 45, 11], [150, 75, 8], [95, 105, 10], [140, 125, 7], [70, 130, 6], [175, 45, 5]].map(([cx, cy, r], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r={r + 7} fill="#BFE0FF" opacity={0.18} />
        <circle cx={cx} cy={cy} r={r} fill="#EAF4FF" />
      </g>
    ))}
  </svg>
);

/** Aldebaran — bintang oranye terang dengan pijar 4-titik (dipakai ulang dari Uranus). */
const Aldebaran: React.FC<{x: number; y: number; s?: number; opacity?: number}> = ({x, y, s = 1, opacity = 1}) => (
  <svg width={120 * s} height={120 * s} viewBox="0 0 120 120" style={{position: 'absolute', left: x, top: y, opacity}}>
    <circle cx={60} cy={60} r={26} fill="#FF9A3C" opacity={0.25} />
    <path d="M60,6 L68,52 L114,60 L68,68 L60,114 L52,68 L6,60 L52,52 Z" fill="#FFB35C" opacity={0.9} />
    <circle cx={60} cy={60} r={14} fill="#FFE1B0" />
  </svg>
);

// ---------- SCENE 1: HOOK — three-layer S1 ----------
// Lisan (V2): "Bulan malam ini lebih besar dan lebih terang — tapi kalau cuma
// lihat sekilas, kamu mungkin nggak sadar beda ukurannya." f 0-229.
// Teks layar: "24.000 KM LEBIH DEKAT" (angka yang tidak diucapkan di hook).
// Visual: Bulan purnama besar di langit malam + Kejap 440px ngintip. Bulan
// membesar 7% saat kalimat kedua (f 101-180) — visual "lebih besar".
const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const drift = lin(f, 0, 236, 1, 1.035, (t) => t);
  const grow = lin(f, 101, 180, 1, 1.07, (t) => t);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <div style={{transform: `scale(${drift})`, transformOrigin: '50% 46%', width: W, height: H}}>
        <NightBg />
      </div>
      {/* Bulan purnama — objek frame 0 (wrapper WAJIB absolute: transform
          bikin containing block; tanpa ini Bulan jatuh off-screen — pelajaran
          Uranus S2/S5) */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H,
        opacity: lin(f, 0, 15, 0, 1), transform: `scale(${grow})`, transformOrigin: '540px 680px'}}>
        <MoonAsset x={280} y={420} d={520} glow />
      </div>
      <div style={{position: 'absolute', left: 0, top: 1000, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 32, color: SAGE_L, letterSpacing: 4, opacity: lin(f, 100, 120, 0, 1)}}>
        SUPERMOON
      </div>
      <Chip f={f} at={0} x={540} y={300} text="24.000 KM LEBIH DEKAT" bg={AMBER} color={GREEN} size={52} />
      <div style={{opacity: lin(f, 60, 80, 0, 1)}}>
        <KejapAt x={860} y={1400} w={440} mood="takjub" from={0} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 2: DEFINISI + JARAK (data flat) ----------
// Narasi lokal (absStart 224): "Supermoon itu Bulan purnama yang kebetulan
// dekat dengan Bumi — di dekat titik terdekat orbitnya, yang disebut perigee."
// f 19-220 -> "Malam ini jaraknya tiga ratus enam puluh ribu kilometer, dari
// rata-rata tiga ratus delapan puluh empat ribu, dua puluh empat ribu kilometer
// lebih dekat." f 246-479.
// Visual: orbit elips (Bumi di fokus kiri) — Bulan berjalan dari ujung jauh
// (kanan) ke perigee (kiri, dekat Bumi); batang jarak 384.400 vs 360.000 km.
const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const CX = 540, CY = 560, RX = 360, RY = 200, EX = 241;
  const theta = lin(f, 19, 220, 0, Math.PI, (t) => t);
  const moonX = CX + RX * Math.cos(theta), moonY = CY - RY * Math.sin(theta);
  const kmAvg = Math.round(lin(f, 246, 400, 0, 384400, (t) => t));
  const kmNow = Math.round(lin(f, 246, 400, 0, 360000, (t) => t));
  const fmt = (n: number) => n.toLocaleString('id-ID');
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      {/* orbit elips + Bumi di fokus */}
      <div style={{opacity: lin(f, 0, 12, 0, 1)}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#FFEFC4" strokeWidth={3}
            strokeDasharray="14 12" opacity={0.55} />
          <circle cx={180} cy={CY} r={42} fill="none" stroke={AMBER} strokeWidth={4} strokeDasharray="10 8"
            opacity={lin(f, 150, 165, 0, 0.9)} />
        </svg>
        {/* Bumi (fokus kiri) */}
        <div style={{position: 'absolute', left: EX - 35, top: CY - 35, width: 70, height: 70, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 32%, #7FB8E8, #2B5C8A 65%)',
          boxShadow: '0 0 26px rgba(127,184,232,0.6)'}} />
        <div style={{position: 'absolute', left: EX - 60, top: CY + 48, width: 120, textAlign: 'center',
          fontFamily: 'Pop', fontWeight: 900, fontSize: 26, color: CREAM}}>BUMI</div>
        {/* Bulan berjalan ke perigee */}
        <div style={{position: 'absolute', left: moonX - 22, top: moonY - 22, width: 44, height: 44, borderRadius: '50%',
          background: '#FFF6DE', boxShadow: '0 0 22px rgba(255,246,222,0.9)'}} />
        <div style={{position: 'absolute', left: 860, top: 500, fontFamily: 'Pop', fontWeight: 600, fontSize: 26,
          color: SAGE_L, opacity: lin(f, 19, 40, 0, 1)}}>PALING JAUH</div>
        <div style={{position: 'absolute', left: 60, top: 440, fontFamily: 'Pop', fontWeight: 900, fontSize: 30,
          color: AMBER, opacity: lin(f, 150, 165, 0, 1)}}>PERIGEE</div>
      </div>
      {/* batang jarak */}
      <div style={{position: 'absolute', left: 60, top: 880, width: 960, opacity: lin(f, 246, 260, 0, 1)}}>
        <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 28, color: SAGE_L, marginBottom: 10}}>RATA-RATA</div>
        <div style={{position: 'relative', width: 800, height: 64, background: '#8A9A8A', borderRadius: 32}}>
          <div style={{position: 'absolute', right: 24, top: 12, fontFamily: 'Pop', fontWeight: 900, fontSize: 36, color: GREEN}}>
            {fmt(kmAvg)} KM
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, top: 1060, width: 960, opacity: lin(f, 246, 260, 0, 1)}}>
        <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 28, color: SAGE_L, marginBottom: 10}}>MALAM INI</div>
        <div style={{position: 'relative', width: 749, height: 64, background: AMBER, borderRadius: 32}}>
          <div style={{position: 'absolute', right: 24, top: 12, fontFamily: 'Pop', fontWeight: 900, fontSize: 36, color: GREEN}}>
            {fmt(kmNow)} KM
          </div>
        </div>
      </div>
      <Chip f={f} at={400} x={540} y={1300} text="SELISIH 24.000 KM" bg={AMBER} color={GREEN} size={36} />
      <div style={{opacity: lin(f, 440, 455, 0, 1)}}>
        <KejapAt x={-30} y={1620} w={220} mood="mikir" from={224} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 3: ANGKA + PANDUAN MELIHAT ----------
// Narasi lokal (absStart 702): "Hasilnya: sekitar tujuh persen lebih besar dan
// tiga belas persen lebih terang dari Bulan purnama biasa." f 22-186 ->
// "Puncaknya malam ini pukul sembilan lima tiga malam — tapi paling bagus dilihat
// pas baru terbit, sesaat setelah matahari terbenam, di langit timur."
// f 209-456 -> "Di dekat cakrawala, dia kelihatan lebih besar karena ilusi
// Bulan." f 472-584.
// Visual: kartu angka 7% / 13% (atas) + cakrawala: Matahari terbenam (kiri),
// Bulan terbit (kanan/timur).
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const pct7 = Math.round(lin(f, 22, 100, 0, 7, (t) => t));
  const pct13 = Math.round(lin(f, 100, 186, 0, 13, (t) => t));
  const moonGrow = lin(f, 22, 100, 1, 1.07, (t) => t);
  const glowO = lin(f, 100, 186, 0.3, 0.85, (t) => t);
  const sunSink = lin(f, 280, 456, 0, 60, (t) => t);
  const moonRise = lin(f, 280, 456, 0, -80, (t) => t);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      {/* kartu angka */}
      <div style={{position: 'absolute', left: 60, top: 180, width: 960, height: 560, background: CREAM,
        borderRadius: 32, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', opacity: lin(f, 0, 12, 0, 1)}}>
        <div style={{position: 'absolute', left: 30, top: 22, fontFamily: 'Pop', fontWeight: 900, fontSize: 36, color: GREEN}}>
          HASILNYA:
        </div>
        <div style={{position: 'absolute', left: 30, top: 110, display: 'flex', alignItems: 'center', gap: 30,
          opacity: lin(f, 22, 35, 0, 1)}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 120, color: AMBER, lineHeight: 1}}>
            +{pct7}%
          </div>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 40, color: GREEN, lineHeight: 1.15}}>
            LEBIH<br />BESAR
          </div>
          <div style={{transform: `scale(${moonGrow})`, transformOrigin: '60px 60px'}}>
            <MoonAsset x={0} y={0} d={120} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 30, top: 330, display: 'flex', alignItems: 'center', gap: 30,
          opacity: lin(f, 100, 115, 0, 1)}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 120, color: AMBER, lineHeight: 1}}>
            +{pct13}%
          </div>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 40, color: GREEN, lineHeight: 1.15}}>
            LEBIH<br />TERANG
          </div>
          {/* cakram terang — HARUS amber, bukan krem: krem di atas kartu krem
              tidak terlihat (temuan QA 23 Nov) */}
          <div style={{width: 120, height: 120, borderRadius: '50%', background: '#FFC93C', border: '4px solid #DE920C',
            boxShadow: `0 0 ${30 + glowO * 60}px rgba(222,146,12,${0.4 + glowO * 0.5})`}} />
        </div>
      </div>
      {/* panduan melihat */}
      <Chip f={f} at={209} x={540} y={820} text="PUNCAK 21:53 WIB" bg={AMBER} color={GREEN} size={40} />
      {/* Matahari terbenam (kiri) */}
      <div style={{opacity: lin(f, 280, 295, 0, 1), transform: `translateY(${sunSink}px)`}}>
        <SunAsset x={110} y={1180} d={170} />
      </div>
      {/* Bulan terbit (kanan = timur) */}
      <div style={{opacity: lin(f, 280, 295, 0, 1), transform: `translateY(${moonRise}px)`}}>
        <MoonAsset x={700} y={1250} d={280} glow />
      </div>
      <div style={{position: 'absolute', left: 700, top: 1560, width: 280, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 28, color: SAGE_L, opacity: lin(f, 300, 315, 0, 1)}}>
        LANGIT TIMUR
      </div>
      <Chip f={f} at={472} x={540} y={950} text="ILUSI BULAN" bg={CREAM} color={GREEN} size={34} />
      {/* garis cakrawala */}
      <div style={{position: 'absolute', left: 0, top: 1620, width: W, height: 300, background: '#050A14', opacity: 0.9}} />
    </AbsoluteFill>
  );
};

// ---------- SCENE 4: KEJUJURAN — PERIGEE BARU 30 JAM LAGI ----------
// Narasi lokal (absStart 1284): "Tapi jujur saja: Bulan malam ini belum di titik
// terdekatnya." f 21-112 -> "Perigee-nya baru tiga puluh jam lagi, di tiga ratus
// lima puluh sembilan ribu kilometer." f 127-259 -> "Dan tujuh persen sulit
// dilihat mata telanjang — yang paling terasa justru terangnya." f 280-418.
// Visual: garis waktu Purnama -> +30 jam -> Perigee; pengukur 7% (kecil sekali).
const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const dotX = lin(f, 127, 259, 200, 880, (t) => t);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      {/* garis waktu */}
      <div style={{position: 'absolute', left: 100, top: 600, width: 880, height: 6, background: '#FFEFC4',
        borderRadius: 3, opacity: lin(f, 21, 35, 0, 0.7)}} />
      <div style={{position: 'absolute', left: 200, top: 570, opacity: lin(f, 21, 35, 0, 1)}}>
        <div style={{width: 60, height: 60, borderRadius: '50%', background: '#FFF6DE',
          boxShadow: '0 0 24px rgba(255,246,222,0.8)', marginLeft: -30}} />
        <div style={{position: 'absolute', left: -90, top: -90, width: 180, textAlign: 'center',
          fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM}}>PURNAMA</div>
        <div style={{position: 'absolute', left: -90, top: 80, width: 180, textAlign: 'center',
          fontFamily: 'Pop', fontWeight: 600, fontSize: 26, color: SAGE_L}}>SELASA 21:53</div>
      </div>
      <div style={{position: 'absolute', left: 880, top: 570, opacity: lin(f, 180, 195, 0, 1)}}>
        <div style={{width: 60, height: 60, borderRadius: '50%', background: AMBER,
          boxShadow: '0 0 24px rgba(222,146,12,0.8)', marginLeft: -30}} />
        <div style={{position: 'absolute', left: -90, top: -90, width: 180, textAlign: 'center',
          fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: AMBER}}>PERIGEE</div>
        <div style={{position: 'absolute', left: -110, top: 80, width: 220, textAlign: 'center',
          fontFamily: 'Pop', fontWeight: 600, fontSize: 26, color: SAGE_L}}>KAMIS 04:01</div>
      </div>
      {/* titik Bulan berjalan sepanjang garis waktu */}
      <div style={{position: 'absolute', left: dotX - 25, top: 578, width: 50, height: 50, borderRadius: '50%',
        background: '#FFF6DE', boxShadow: '0 0 20px rgba(255,246,222,0.9)',
        opacity: lin(f, 127, 140, 0, 1)}} />
      <Chip f={f} at={127} x={540} y={500} text="+30 JAM LAGI" bg={AMBER} color={GREEN} size={36} />
      <Chip f={f} at={180} x={540} y={760} text="359.000 KM" bg={CREAM} color={GREEN} size={36} />
      {/* pengukur 7% — isinya kecil sekali, itu poinnya */}
      <div style={{position: 'absolute', left: 0, top: 900, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 30, color: SAGE_L, opacity: lin(f, 280, 295, 0, 1)}}>
        7% — SULIT DILIHAT MATA TELANJANG
      </div>
      <div style={{position: 'absolute', left: 140, top: 960, width: 800, height: 40, background: '#2A3A31',
        borderRadius: 20, opacity: lin(f, 280, 295, 0, 1)}}>
        <div style={{width: 56, height: 40, background: AMBER, borderRadius: 20}} />
      </div>
      <Chip f={f} at={300} x={540} y={1080} text="YANG TERASA: TERANGNYA" bg={AMBER} color={GREEN} size={34} />
      <div style={{opacity: lin(f, 340, 355, 0, 1)}}>
        <KejapAt x={-30} y={1620} w={220} mood="skeptis" from={1284} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 5: NAMA + PETA LANGIT + TIGA SUPERMOON ----------
// Narasi lokal (absStart 1702): "Namanya Beaver Moon, Bulan Berang-berang,
// karena November itu musim berang-berang membangun bendungan buat musim
// dingin." f 25-215 -> "Malam ini dia ada di Taurus, dekat Pleiades dan
// Aldebaran." f 241-337 -> "Dan ini yang pertama dari tiga supermoon beruntun
// — Desember nanti lebih dekat lagi." f 359-505.
// Visual: kartu nama + bendungan kayu (atas); peta langit Taurus (tengah);
// strip 3 supermoon (bawah).
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      {/* kartu nama */}
      <div style={{position: 'absolute', left: 60, top: 180, width: 960, height: 380, background: CREAM,
        borderRadius: 32, boxShadow: '0 14px 30px rgba(0,0,0,0.45)', opacity: lin(f, 0, 12, 0, 1)}}>
        <div style={{position: 'absolute', left: 0, top: 36, width: '100%', textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 72, color: GREEN, opacity: lin(f, 25, 40, 0, 1)}}>
          BEAVER MOON
        </div>
        <div style={{position: 'absolute', left: 0, top: 140, width: '100%', textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 44, color: AMBER, opacity: lin(f, 50, 65, 0, 1)}}>
          BULAN BERANG-BERANG
        </div>
        <div style={{position: 'absolute', left: 0, top: 230, width: '100%', textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 30, color: SAGE, opacity: lin(f, 80, 95, 0, 1)}}>
          November — musim membangun bendungan
        </div>
      </div>
      {/* bendungan kayu + aliran air */}
      <div style={{position: 'absolute', left: 60, top: 600, width: 960, height: 200, opacity: lin(f, 60, 75, 0, 1)}}>
        <div style={{position: 'absolute', left: 0, top: 120, width: 960, height: 50, background: '#2B5C8A',
          borderRadius: 25, opacity: 0.7}} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{position: 'absolute', left: 40 + i * 30, top: 20 + i * 26, width: 880 - i * 60,
            height: 30, background: i % 2 === 0 ? '#6B4F2E' : '#7D5E38', borderRadius: 15,
            border: '2px solid #4A3520'}} />
        ))}
        <div style={{position: 'absolute', left: 0, top: 180, width: '100%', textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 26, color: SAGE_L}}>bendungan berang-berang</div>
      </div>
      {/* peta langit Taurus */}
      <div style={{position: 'absolute', left: 0, top: 850, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 32, color: CREAM, letterSpacing: 3, opacity: lin(f, 241, 255, 0, 1)}}>
        TAURUS
      </div>
      <svg width={W} height={H} style={{position: 'absolute', opacity: lin(f, 241, 260, 0, 0.55)}}>
        <line x1={330} y1={980} x2={540} y2={1010} stroke="#FFEFC4" strokeWidth={3} strokeDasharray="12 10" />
        <line x1={600} y1={1010} x2={800} y2={1030} stroke="#FFEFC4" strokeWidth={3} strokeDasharray="12 10" />
      </svg>
      <div style={{opacity: lin(f, 241, 255, 0, 1)}}>
        <Pleiades x={220} y={900} s={1} />
      </div>
      <div style={{opacity: lin(f, 260, 275, 0, 1)}}>
        <MoonAsset x={500} y={930} d={160} glow />
      </div>
      <div style={{opacity: lin(f, 280, 295, 0, 1)}}>
        <Aldebaran x={760} y={960} s={1} />
      </div>
      <div style={{position: 'absolute', left: 220, top: 1080, width: 220, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 26, color: SAGE_L, opacity: lin(f, 290, 305, 0, 1)}}>PLEIADES</div>
      <div style={{position: 'absolute', left: 500, top: 1100, width: 160, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 26, color: CREAM, opacity: lin(f, 290, 305, 0, 1)}}>BULAN</div>
      <div style={{position: 'absolute', left: 760, top: 1090, width: 120, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 26, color: SAGE_L, opacity: lin(f, 290, 305, 0, 1)}}>ALDEBARAN</div>
      {/* strip 3 supermoon */}
      <div style={{position: 'absolute', left: 60, top: 1480, width: 960, display: 'flex', gap: 20,
        opacity: lin(f, 359, 375, 0, 1)}}>
        <div style={{flex: 1, background: CREAM, borderRadius: 24, padding: '24px 0', textAlign: 'center'}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 32, color: GREEN}}>NOV 24</div>
          <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 26, color: SAGE, marginTop: 6}}>360.768 KM</div>
        </div>
        <div style={{flex: 1, background: AMBER, borderRadius: 24, padding: '24px 0', textAlign: 'center'}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 32, color: GREEN}}>DES 23</div>
          <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 26, color: GREEN, marginTop: 6}}>356.700 KM</div>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 22, color: GREEN, marginTop: 4}}>PALING DEKAT 2026</div>
        </div>
        <div style={{flex: 1, background: CREAM, borderRadius: 24, padding: '24px 0', textAlign: 'center'}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 32, color: GREEN}}>JAN 22</div>
          <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 26, color: SAGE, marginTop: 6}}>357.600 KM</div>
        </div>
      </div>
      <div style={{opacity: lin(f, 460, 475, 0, 1)}}>
        <KejapAt x={800} y={1700} w={220} mood="takjub" from={1702} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 6: BOOKEND + sign-off + sumber + Ombak pulang ke beige ----------
// Narasi lokal (absStart 2210): "Jadi malam ini, lihat ke timur pas matahari
// terbenam." f 17-104 -> "Bulan purnama yang lebih besar dan lebih terang dari
// biasanya bakal naik." f 133-229 -> "Aku, Kejap — sampai jumpa di video
// berikutnya!" f 251-287. Ombak naik f 200-260 (1×, pulang ke beige).
const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const waveProg = lin(f, 200, 260, 0, 1);
  const jump = waveProg > 0 && waveProg < 1 ? Math.abs(Math.sin(waveProg * Math.PI * 2)) * -46 : 0;
  const srcO = lin(f, 150, 165, 0, 1) * lin(f, 195, 210, 1, 0);
  const moonRise = lin(f, 17, 230, 0, -60, (t) => t);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      <div style={{opacity: lin(f, 17, 35, 0, 1)}}>
        <KineticWords f={f} at={17} words={['Jadi', 'malam', 'ini,', 'lihat', 'ke', 'timur', 'pas', 'matahari', 'terbenam.']} x={0} y={300} size={56} color={CREAM} align="center" />
      </div>
      {/* Bulan naik di timur */}
      <div style={{opacity: lin(f, 17, 35, 0, 1), transform: `translateY(${moonRise}px)`}}>
        <MoonAsset x={310} y={620} d={460} glow />
      </div>
      <Chip f={f} at={100} x={540} y={1140} text="LIHAT KE TIMUR" bg={AMBER} color={GREEN} size={40} />
      {/* baris sumber — resep Paus V6, fade-in di akhir adegan konten */}
      <div style={{position: 'absolute', left: 0, top: 1300, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 24, color: SAGE_L, opacity: srcO, lineHeight: 1.5}}>
        Sumber: U.S. Naval Observatory · NASA · EarthSky · Farmers' Almanac
      </div>
      {/* Ombak Sekejap pulang ke beige (1×) */}
      {waveProg > 0 && (
        <div style={{position: 'absolute', inset: 0, clipPath: `path('${wavePath(waveProg, f / FPS, 1)}')`, background: BEIGE}} />
      )}
      {waveProg > 0 && waveProg < 1 && <WaveRim prog={waveProg} t={f / FPS} dir={1} />}
      <div style={{position: 'absolute', transform: `translateY(${jump}px)`}}>
        <KejapAt x={320} y={1420} w={440} mood={f >= 251 ? 'senang' : 'default'} from={2210} />
      </div>
    </AbsoluteFill>
  );
};

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 10, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 60, file: 'sfx/pop.wav', vol: 0.95},
  {at: 224, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 243, file: 'sfx/pop.wav', vol: 0.95},
  {at: 374, file: 'sfx/pop.wav', vol: 0.95},
  {at: 470, file: 'sfx/pop.wav', vol: 0.95},
  {at: 500, file: 'sfx/tick.wav', vol: 0.9},
  {at: 530, file: 'sfx/tick.wav', vol: 0.9},
  {at: 624, file: 'sfx/pop.wav', vol: 0.95},
  {at: 702, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 724, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 802, file: 'sfx/pop.wav', vol: 0.95},
  {at: 911, file: 'sfx/pop.wav', vol: 0.95},
  {at: 982, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1174, file: 'sfx/ding.wav', vol: 0.95},
  {at: 1284, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1305, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1411, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1464, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1584, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1702, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1727, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1762, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1943, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2061, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 2210, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 2310, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2461, file: 'sfx/sting-kejap.wav', vol: 0.95},
  {at: 2537, file: 'sfx/whoosh.wav', vol: 0.9},
];

export const Main: React.FC = () => {
  useFonts();
  const S = cues.scenes as number[];
  const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <Audio src={staticFile('vo.wav')} volume={1} />
      <Audio src={staticFile('music.wav')} volume={0.5} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={40}>
          <Audio src={staticFile(s.file)} volume={s.vol} />
        </Sequence>
      ))}
      <TransitionSeries>
        {scenes.map((Sc, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={S[i]}>
              <Sc />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: cues.trans})} />
          </React.Fragment>
        ))}
        <TransitionSeries.Sequence durationInFrames={S[6]}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
