import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {MascotAsset, VenusAsset, SunAsset} from './assets2d';
import {Outro} from './Outro';
import cues from './cues.json';

const W = 1080, H = 1920, FPS = 30;
const GREEN = '#1F2A24', BEIGE = '#FEE5B2', CREAM = '#FFF6DE', AMBER = '#DE920C', SAGE = '#4E6B5B';
const SPACE1 = '#0B1020', SPACE2 = '#141B2E', SPACE3 = '#1E2A44', SAGE_L = '#A8BFA9';
const DAWN1 = '#131A33', DAWN2 = '#3A2B58', DAWN3 = '#8A4A5A', HORIZ = '#E8A34C';
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

const Starfield: React.FC<{fadeOut?: number; transparent?: boolean}> = ({fadeOut = 1, transparent = false}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: transparent ? 'transparent' : `linear-gradient(180deg, ${SPACE1} 0%, ${SPACE2} 62%, ${SPACE3} 100%)`, opacity: fadeOut}}>
      {Array.from({length: 70}).map((_, i) => {
        const sx = random(`mx${i}`) * W, sy = random(`my${i}`) * 1150;
        const tw = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(f * 0.05 + i * 2.4));
        return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: 3 + random(`mr${i}`) * 4,
          height: 3 + random(`mr${i}`) * 4, borderRadius: '50%', background: '#FFEFC4', opacity: tw}} />;
      })}
      {Array.from({length: 8}).map((_, i) => {
        const sx = 80 + random(`bx${i}`) * (W - 160), sy = 120 + random(`by${i}`) * 900;
        return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: 7, height: 7, borderRadius: '50%',
          background: '#FFFFFF', opacity: 0.5 + 0.4 * Math.sin(f * 0.04 + i * 1.7),
          boxShadow: '0 0 14px rgba(255,255,255,0.7)'}} />;
      })}
    </AbsoluteFill>
  );
};

const DawnSky: React.FC<{glow?: number}> = ({glow = 0}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${DAWN1} 0%, ${DAWN2} 55%, ${DAWN3} 78%, ${HORIZ} 100%)`}}>
    <div style={{position: 'absolute', left: 0, bottom: 0, width: W, height: 420,
      background: `radial-gradient(ellipse 90% 100% at 50% 100%, rgba(232,163,76,${0.25 + 0.55 * glow}) 0%, rgba(232,163,76,0) 70%)`}} />
  </AbsoluteFill>
);

// Bintang 4 ujung (Spica) — flat, tanpa emoji
const FourStar: React.FC<{x: number; y: number; s: number; color?: string; opacity?: number}> =
({x, y, s, color = '#FFFFFF', opacity = 1}) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, opacity}}>
    <path d="M50,0 L58,42 L100,50 L58,58 L50,100 L42,58 L0,50 L42,42 Z" fill={color} />
    <circle cx="50" cy="50" r="10" fill={color} />
  </svg>
);

// ---------- SCENE 1: HOOK — three-layer S1 ----------
// Lisan (V1): "Besok subuh, satu titik cahaya dua puluh kali lebih terang
// dari bintang paling terang di langit." f 0-206 -> "Dan itu bukan bintang,
// itu Venus — di terang-terangnya." f 214-287. Teks layar: "−4,9".
// Visual: langit subuh + Venus sabit besar bersinar + Kejap ngintip tepi.
const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(f * 0.08);
  const glowO = 0.75 + 0.25 * Math.sin(f * 0.08);
  return (
    <AbsoluteFill style={{background: SPACE1}}>
      <Starfield />
      <div style={{position: 'absolute', left: 540 - 260 * pulse, top: 560 - 260 * pulse, width: 520 * pulse, height: 520 * pulse,
        borderRadius: '50%', background: `radial-gradient(circle, rgba(255,240,200,${0.35 * glowO}) 0%, rgba(255,240,200,0) 68%)`}} />
      <div style={{opacity: lin(f, 0, 15, 0, 1)}}>
        <VenusAsset x={540 - 260} y={560 - 260} d={520} phase={0.27} glow />
      </div>
      <Chip f={f} at={0} x={540} y={120} text="−4,9" bg={AMBER} color={GREEN} size={64} />
      <div style={{position: 'absolute', left: 0, top: 1330, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 40, color: CREAM, opacity: lin(f, 214, 229, 0, 1)}}>
        BUKAN BINTANG — ITU VENUS
      </div>
      <div style={{opacity: lin(f, 60, 75, 0, 1)}}>
        <KejapAt x={860} y={1400} w={440} mood="takjub" from={0} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 2: AKSI — VENUS TERBIT + NAIK KE 23° ----------
// Narasi lokal (absStart 290): S1 "Venus mencapai puncak terangnya sekitar
// dua puluh sembilan November, dengan magnitudo minus empat koma sembilan."
// f 23-220 -> S2 "Dia terbit sekitar jam tiga, dan sejam sebelum Matahari
// terbit dia sudah dua puluh tiga derajat di langit timur." f 235-421.
// Visual: cakrawala + Venus terbit & naik sepanjang busur ketinggian,
// jam berjalan 03.00 -> 04.20 WIB, angka hero −4,9 mendarat pas
// "magnitudo minus empat koma sembilan" diucapkan.
const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const rise = lin(f, 235, 420, 0, 1, (t) => t);
  const venusY = 1560 - rise * 640;
  const venusO = lin(f, 235, 255, 0, 1);
  const hero = spr(f, 190, 10, 190);
  const clock2 = lin(f, 375, 390, 0, 1);
  const glowFajar = lin(f, 400, 438, 0, 1, (t) => t);
  return (
    <AbsoluteFill style={{background: DAWN1}}>
      <DawnSky glow={glowFajar} />
      <Starfield fadeOut={1 - 0.5 * rise} transparent />
      {/* angka hero magnitudo */}
      <div style={{position: 'absolute', left: 0, top: 150, width: W, textAlign: 'center',
        transform: `scale(${hero})`, opacity: hero}}>
        <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 150, color: AMBER, lineHeight: 1}}>−4,9</div>
        <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 34, color: CREAM, letterSpacing: 3, marginTop: 6}}>MAGNITUDO · 29 NOV</div>
      </div>
      {/* busur ketinggian (garis putus-putus) */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: lin(f, 235, 250, 0, 1)}}>
        <path d="M540,1560 C540,1350 540,1150 540,920" fill="none" stroke="#FFEFC4" strokeWidth={4} strokeDasharray="16 14" opacity={0.55} />
        <circle cx={540} cy={920} r={10} fill="#FFEFC4" />
      </svg>
      <div style={{position: 'absolute', left: 580, top: 880, fontFamily: 'Pop', fontWeight: 900, fontSize: 40,
        color: CREAM, opacity: lin(f, 395, 410, 0, 1)}}>23°</div>
      {/* Venus naik */}
      <div style={{opacity: venusO}}>
        <VenusAsset x={540 - 140} y={venusY - 140} d={280} phase={0.27} glow />
      </div>
      {/* siluet atap + pepohonan di cakrawala */}
      <svg width={W} height={420} style={{position: 'absolute', bottom: 0, left: 0}}>
        <path d="M0,420 L0,300 L120,300 L120,260 L240,260 L240,300 L420,300 L420,230 L560,230 L560,300 L760,300 L760,270 L900,270 L900,300 L1080,300 L1080,420 Z" fill="#0E1526" />
        <path d="M80,300 Q130,220 180,300 Z" fill="#0E1526" />
        <path d="M880,300 Q930,210 980,300 Z" fill="#0E1526" />
      </svg>
      {/* jam berjalan */}
      <div style={{position: 'absolute', left: 0, top: 1640, width: W, textAlign: 'center', opacity: 1 - clock2}}>
        <span style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 44, color: CREAM, background: 'rgba(11,16,32,0.55)',
          padding: '10px 28px', borderRadius: 999}}>03.00 WIB</span>
      </div>
      <div style={{position: 'absolute', left: 0, top: 1640, width: W, textAlign: 'center', opacity: clock2}}>
        <span style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 44, color: CREAM, background: 'rgba(11,16,32,0.55)',
          padding: '10px 28px', borderRadius: 999}}>04.20 WIB · SEJAM SEBELUM TERBIT</span>
      </div>
      <div style={{opacity: lin(f, 400, 415, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={290} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 3: PARADOKS SABIT ----------
// Narasi lokal (absStart 716): S1 "Anehnya, Venus paling terang bukan saat
// dia purnama." f 24-126 -> S2 "Lewat teropong dia cuma sabit, dua puluh
// tujuh persennya yang kena cahaya." f 148-259 -> S3 "Tapi cakramnya besar,
// empat puluh detik busur, dan jaraknya cuma enam puluh juta kilometer."
// f 278-439 -> S4 "Sabit besar yang dekat — itu resepnya." f 460-529.
// Visual: lingkaran teropong berisi sabit + perbandingan purnama kecil-jauh
// vs sabit besar-dekat + chip angka pas diucapkan.
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const cmp = spr(f, 278, 10, 190);
  return (
    <AbsoluteFill style={{background: SPACE1}}>
      <Starfield />
      {/* lingkaran teropong */}
      <div style={{position: 'absolute', left: 540 - 300, top: 250, width: 600, height: 600, borderRadius: '50%',
        border: '10px solid #FFEFC4', boxSizing: 'border-box', opacity: lin(f, 0, 15, 0, 1),
        boxShadow: '0 0 60px rgba(255,239,196,0.35)'}}>
        <div style={{position: 'absolute', left: 60, top: 60, width: 460, height: 460}}>
          <VenusAsset x={0} y={0} d={460} phase={0.27} glow />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 890, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 30, color: SAGE_L, opacity: lin(f, 0, 15, 0, 1)}}>LEWAT TEROPONG</div>
      <Chip f={f} at={148} x={540} y={1000} text="27% TERANG" bg={AMBER} color={GREEN} size={40} />
      {/* perbandingan: purnama kecil-jauh vs sabit besar-dekat */}
      <div style={{position: 'absolute', left: 0, top: 1140, width: W, transform: `scale(${cmp})`, opacity: cmp}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: 90, alignItems: 'flex-end'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{width: 150, height: 150, borderRadius: '50%', background: '#FFF6DE', margin: '0 auto',
              boxShadow: '0 0 24px rgba(255,246,222,0.4)'}} />
            <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM, marginTop: 14}}>PURNAMA</div>
            <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 26, color: SAGE_L}}>jauh · kecil</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{width: 260, height: 260, margin: '0 auto', position: 'relative'}}>
              <VenusAsset x={0} y={0} d={260} phase={0.27} glow />
            </div>
            <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: AMBER, marginTop: 14}}>SABIT</div>
            <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 26, color: SAGE_L}}>dekat · besar</div>
          </div>
        </div>
      </div>
      <Chip f={f} at={330} x={540} y={1620} text="40 DETIK BUSUR · 60 JUTA KM" bg={CREAM} color={GREEN} size={30} />
      <div style={{opacity: lin(f, 460, 475, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="senang" from={716} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 4: MEKANISME — PETA ORBIT ----------
// Narasi lokal (absStart 1247): S1 "Ini soal timbang-menimbang." f 24-63
// -> S2 "Sejak lewat di antara Bumi dan Matahari dua puluh empat Oktober
// lalu, Venus menjauh." f 84-210 -> S3 "Cakramnya mengecil, tapi bagian
// yang terang makin membesar." f 230-314 -> S4 "Di titik inilah bagian
// yang terang itu paling luas — cakram masih besar, sabitnya sudah cukup
// tebal." f 344-496.
// Visual: peta orbit atas-bawah — Matahari, orbit Bumi, orbit Venus;
// titik Venus bergerak dari konjungsi bawah (24 Okt) menjauh; pengukur
// "luas terang" naik ke maksimum.
const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const ang = lin(f, 84, 314, 0, -62, (t) => t); // Venus bergerak menjauh dari konjungsi (derajat)
  const rad = (ang * Math.PI) / 180;
  const vx = 540 + 200 * Math.cos(rad), vy = 820 + 200 * Math.sin(rad);
  const gauge = lin(f, 230, 440, 0.12, 1, (t) => t);
  const disc = lin(f, 84, 314, 1, 0.62, (t) => t);
  const lit = lin(f, 84, 314, 0.06, 0.27, (t) => t);
  return (
    <AbsoluteFill style={{background: SPACE1}}>
      <Starfield />
      {/* orbit */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: lin(f, 0, 15, 0, 1)}}>
        <circle cx={540} cy={820} r={380} fill="none" stroke="#FFEFC4" strokeWidth={3} strokeDasharray="10 12" opacity={0.4} />
        <circle cx={540} cy={820} r={200} fill="none" stroke={AMBER} strokeWidth={4} strokeDasharray="10 12" opacity={0.75} />
        <circle cx={920} cy={820} r={26} fill="#7FB8E8" />
        <rect x={880} y={852} width={80} height={34} rx={17} fill="rgba(11,16,32,0.8)" />
        <text x={920} y={876} textAnchor="middle" fill={CREAM} fontFamily="Pop" fontWeight={900} fontSize={26}>BUMI</text>
      </svg>
      <SunAsset x={540 - 65} y={820 - 65} d={130} />
      <div style={{position: 'absolute', left: 452, top: 958, width: 176, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 26, color: CREAM, background: 'rgba(11,16,32,0.8)', padding: '6px 0',
        borderRadius: 999}}>MATAHARI</div>
      {/* Venus bergerak di orbitnya */}
      <div style={{position: 'absolute', left: vx - 26 * disc, top: vy - 26 * disc, opacity: lin(f, 84, 99, 0, 1)}}>
        <VenusAsset x={0} y={0} d={52 * disc} phase={Math.max(0.06, lit)} glow />
      </div>
      <div style={{position: 'absolute', left: 740, top: 300, fontFamily: 'Pop', fontWeight: 900, fontSize: 30,
        color: AMBER, opacity: lin(f, 84, 99, 0, 1)}}>24 OKTOBER</div>
      <div style={{position: 'absolute', left: 740, top: 340, fontFamily: 'Pop', fontWeight: 600, fontSize: 26,
        color: SAGE_L, opacity: lin(f, 84, 99, 0, 1)}}>konjungsi bawah</div>
      <Chip f={f} at={24} x={540} y={150} text="TIMBANG-MENIMBANG" bg={AMBER} color={GREEN} size={36} />
      {/* pengukur luas terang */}
      <div style={{position: 'absolute', left: 60, top: 1330, width: 960, opacity: lin(f, 230, 245, 0, 1)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM}}>
          <span>LUAS BAGIAN YANG TERANG</span><span>{Math.round(gauge * 100)}%</span>
        </div>
        <div style={{width: 960, height: 44, background: 'rgba(255,246,222,0.15)', borderRadius: 22, marginTop: 10, overflow: 'hidden'}}>
          <div style={{width: 960 * gauge, height: 44, background: AMBER, borderRadius: 22}} />
        </div>
        <div style={{textAlign: 'center', fontFamily: 'Pop', fontWeight: 900, fontSize: 34, color: AMBER, marginTop: 22,
          opacity: lin(f, 440, 455, 0, 1)}}>MAKSIMUM — GREATEST BRILLIANCY</div>
      </div>
      <div style={{opacity: lin(f, 460, 475, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={1247} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 5: TETANGGA — SPICA + MERKURIUS ----------
// Narasi lokal (absStart 1744): S1 "Dua tetangga di langit yang sama."
// f 24-80 -> S2 "Di kanan atas Venus, Spica, bintang paling terang di
// rasi Virgo, kalah jauh — lebih dari seratus kali lebih redup."
// f 95-296 -> S3 "Dan menjelang fajar, jauh di bawahnya Merkurius
// mengintip dekat cakrawala, kecil tapi masih kelihatan tanpa teropong."
// f 320-512.
// Visual: Venus kiri + Spica kanan atas + batang perbandingan terang,
// lalu fajar naik & Merkurius muncul rendah di cakrawala (bukan jam 4!).
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const bars = spr(f, 150, 10, 190);
  const merc = lin(f, 330, 345, 0, 1, (t) => t);
  const fajar = lin(f, 320, 460, 0, 1, (t) => t);
  return (
    <AbsoluteFill style={{background: DAWN1}}>
      <DawnSky glow={fajar} />
      <Starfield fadeOut={1 - 0.4 * fajar} transparent />
      {/* Venus kiri */}
      <div style={{opacity: lin(f, 0, 15, 0, 1)}}>
        <VenusAsset x={140} y={420} d={300} phase={0.27} glow />
      </div>
      <div style={{position: 'absolute', left: 140, top: 740, width: 300, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 30, color: CREAM, opacity: lin(f, 0, 15, 0, 1)}}>VENUS · −4,9</div>
      {/* Spica kanan atas */}
      <div style={{opacity: lin(f, 95, 110, 0, 1)}}>
        <FourStar x={820} y={330} s={110} />
        <div style={{position: 'absolute', left: 820 - 110, top: 400, width: 220, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 30, color: CREAM}}>SPICA · +1,0</div>
      </div>
      {/* batang perbandingan terang */}
      <div style={{position: 'absolute', left: 60, top: 1000, width: 960, opacity: lin(f, 150, 165, 0, 1)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM}}>
          <span>VENUS</span><span>−4,9</span>
        </div>
        <div style={{width: 960 * bars, height: 44, background: AMBER, borderRadius: 22, marginTop: 8}} />
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM, marginTop: 26}}>
          <span>SPICA</span><span>+1,0</span>
        </div>
        <div style={{width: Math.max(16, 960 * 0.004 * bars), height: 44, background: '#7FB8E8', borderRadius: 22, marginTop: 8}} />
      </div>
      <Chip f={f} at={250} x={540} y={1330} text=">100× LEBIH REDUP" bg={CREAM} color={GREEN} size={32} />
      {/* Merkurius menjelang fajar — rendah di cakrawala */}
      <div style={{opacity: merc}}>
        <div style={{position: 'absolute', left: 700 - 14, top: 1470, width: 28, height: 28, borderRadius: '50%',
          background: '#E8D9A8', boxShadow: '0 0 22px rgba(232,217,168,0.9)'}} />
        <div style={{position: 'absolute', left: 700 - 130, top: 1510, width: 260, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 28, color: CREAM}}>MERKURIUS · −0,7</div>
      </div>
      <svg width={W} height={120} style={{position: 'absolute', bottom: 0, left: 0, opacity: merc}}>
        <path d="M0,120 L0,70 Q300,30 620,60 Q880,85 1080,55 L1080,120 Z" fill="#0E1526" />
      </svg>
      <div style={{opacity: lin(f, 460, 475, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={1744} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 6: BOOKEND + sign-off + sumber ----------
// Narasi lokal (absStart 2260): S1 "Jadi besok subuh jam empat WIB, lihat
// ke timur." f 27-126 -> S2 "Titik paling terang di langit itu Venus, dua
// puluh kali lebih terang dari bintang paling terang — dan besok dia di
// terang-terangnya." f 141-369 -> sign-off "Aku Kejap, sampai jumpa di
// video berikutnya!" f 390-460.
// Bookend: "DUA PULUH KALI LEBIH TERANG". Sumber fade-in di akhir adegan.
const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const srcO = lin(f, 120, 135, 0, 1) * lin(f, 260, 275, 1, 0);
  return (
    <AbsoluteFill style={{background: DAWN1}}>
      <DawnSky glow={0.6} />
      <Starfield fadeOut={0.6} transparent />
      <div style={{opacity: lin(f, 10, 25, 0, 1)}}>
        <VenusAsset x={540 - 170} y={430} d={340} phase={0.27} glow />
      </div>
      <Chip f={f} at={21} x={540} y={1000} text="DUA PULUH KALI LEBIH TERANG" bg={AMBER} color={GREEN} size={32} />
      <Chip f={f} at={60} x={540} y={1100} text="BESOK SUBUH · JAM 4 WIB" bg={CREAM} color={GREEN} size={32} />
      {/* baris sumber — resep Paus V6, fade-in di akhir adegan konten */}
      <div style={{position: 'absolute', left: 0, top: 1260, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 24, color: SAGE_L, opacity: srcO, lineHeight: 1.5}}>
        Sumber: Astronomy.com · EarthSky · timeanddate.com · Star Walk · TheSkyLive
      </div>
      <KejapAt x={320} y={1460} w={440} mood={f >= 390 ? 'senang' : 'default'} from={2260} />
    </AbsoluteFill>
  );
};

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 10, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 60, file: 'sfx/pop.wav', vol: 0.95},
  {at: 240, file: 'sfx/ding.wav', vol: 0.95},
  {at: 290, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 490, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 525, file: 'sfx/pop.wav', vol: 0.95},
  {at: 690, file: 'sfx/pop.wav', vol: 0.95},
  {at: 716, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 900, file: 'sfx/pop.wav', vol: 0.95},
  {at: 976, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1156, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1247, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1310, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1561, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1744, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1904, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2044, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 2100, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2260, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 2281, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2320, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2650, file: 'sfx/sting-kejap.wav', vol: 0.95},
  {at: 2721, file: 'sfx/whoosh.wav', vol: 0.9},
];

export const Main: React.FC = () => {
  useFonts();
  const S = cues.scenes as number[];
  const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
  return (
    <AbsoluteFill style={{background: SPACE1}}>
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
