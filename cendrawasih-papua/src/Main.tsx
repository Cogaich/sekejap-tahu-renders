import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {MascotAsset, SuperbBirdAsset, FemaleBirdAsset, AstrapiaAsset, PlumeBirdAsset} from './assets2d';
import {Outro} from './Outro';
import cues from './cues.json';

const W = 1080, H = 1920, FPS = 30;
const GREEN = '#1F2A24', BEIGE = '#FEE5B2', CREAM = '#FFF6DE', AMBER = '#DE920C', SAGE = '#4E6B5B';
const FOREST1 = '#0B2115', FOREST2 = '#123B24', FOREST3 = '#1C5A33', SAGE_L = '#A8BFA9';
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

/** Hutan Papua — kanvas tema video ini (amandemen latar 2, S1 ngikut tema).
    Tanpa filter blur (pelajaran Badak Jawa): bayangan pakai radial-gradient. */
const ForestBg: React.FC<{drift?: number}> = ({drift = 0}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${FOREST1} 0%, ${FOREST2} 55%, ${FOREST3} 100%)`}}>
      <div style={{position: 'absolute', left: -120, top: -80, width: 700, height: 420, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(46,122,70,0.55) 0%, rgba(46,122,70,0) 70%)'}} />
      <div style={{position: 'absolute', right: -160, top: -40, width: 760, height: 460, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(28,90,51,0.6) 0%, rgba(28,90,51,0) 70%)'}} />
      <div style={{position: 'absolute', left: 180, top: -40, width: 120, height: 1400,
        background: 'linear-gradient(180deg, rgba(255,244,200,0.20), rgba(255,244,200,0))',
        transform: 'rotate(12deg)', transformOrigin: 'top center'}} />
      <div style={{position: 'absolute', left: 640, top: -40, width: 80, height: 1200,
        background: 'linear-gradient(180deg, rgba(255,244,200,0.14), rgba(255,244,200,0))',
        transform: 'rotate(-8deg)', transformOrigin: 'top center'}} />
      {Array.from({length: 26}).map((_, i) => {
        const sx = random(`fx${i}`) * W, sy = 200 + random(`fy${i}`) * 1300;
        const tw = 0.2 + 0.5 * (0.5 + 0.5 * Math.sin(f * 0.05 + i * 2.1));
        return <div key={i} style={{position: 'absolute', left: sx, top: sy, width: 5, height: 5,
          borderRadius: '50%', background: '#FFF3C4', opacity: tw}} />;
      })}
      <svg width={W} height={260} style={{position: 'absolute', bottom: 0, left: 0, transform: `translateX(${drift}px)`}}>
        <path d="M0,260 L0,140 Q240,80 480,130 Q720,170 1080,100 L1080,260 Z" fill="#071708" opacity={0.92} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- SCENE 1: HOOK — three-layer S1 ----------
// Lisan (V1): "Selama ratusan tahun, Eropa percaya burung ini tidak punya kaki
// — makhluk dari surga yang tidak pernah menyentuh tanah. Padahal kakinya ada.
// Dipakai buat nari." f 0-374 (S1 berakhir f 242, S2 f 328, S3 f 374).
// Teks layar: "TANPA KAKI?" (celah baru — lisan: "tidak pernah menyentuh tanah").
// Visual: superb pose wajah senyum mengembang + Kejap 440px ngintip kanan
// bawah. Beat: display 0->1 pas kalimat pertama, melipat ke 0.3 pas "Padahal
// kakinya ada" (kaki kelihatan), lompat pas "Dipakai buat nari".
const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const d1 = lin(f, 60, 160, 0, 1);
  const d2 = lin(f, 242, 300, 1, 0.3);
  const d3 = lin(f, 300, 340, 0.3, 0.8);
  const display = f < 242 ? d1 : f < 300 ? d2 : d3;
  const hop = f >= 328 ? Math.abs(Math.sin((f - 328) * 0.35)) * 26 : 0;
  return (
    <AbsoluteFill style={{background: FOREST1}}>
      <ForestBg />
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 20, 0, 1)}}>
        <SuperbBirdAsset x={290} y={560} w={500} display={display} hop={hop} />
      </div>
      <Chip f={f} at={0} x={540} y={120} text="TANPA KAKI?" bg={AMBER} color={GREEN} size={52} />
      <div style={{opacity: lin(f, 60, 80, 0, 1)}}>
        <KejapAt x={860} y={1400} w={440} mood="takjub" from={0} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 2: TARIAN (AKSI — S2 wajib tontonan) ----------
// Narasi lokal (absStart 381): S1 "Yang nari itu cendrawasih superb, jantan."
// f 0-110 -> S2 "Begitu betina datang, jubah hitam dan perisai biru di dada
// mengembang — berubah jadi wajah senyum yang melayang." f 110-350 -> S3
// "Lalu melompat ke kiri-kanan sambil menjentikkan ekor sampai betina mau."
// f 350-479 -> S4 "Betina menolak lima belas sampai dua puluh pejantan
// sebelum memilih satu." f 479-624.
// Visual: lantai dansa (batang kayu), jantan menari di tengah, betina
// menonton dari dahan atas. Jubah mengembang f 110-276, senyum penuh f 276+,
// lompat kiri-kanan f 350-479, chip penolakan f 479.
const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const display = lin(f, 110, 276, 0, 1);
  const hopX = f >= 350 && f < 479 ? Math.sin((f - 350) * 0.28) * 46 : 0;
  const hopY = f >= 350 && f < 479 ? Math.abs(Math.sin((f - 350) * 0.28)) * 30 : 0;
  return (
    <AbsoluteFill style={{background: FOREST1}}>
      <ForestBg />
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 40, 60, 0, 1)}}>
        <FemaleBirdAsset x={90} y={180} w={300} />
      </div>
      <div style={{position: 'absolute', left: 60, top: 1420, width: 960, height: 34, borderRadius: 17, background: '#5A4632'}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 20, 0, 1)}}>
        <SuperbBirdAsset x={290 + hopX} y={900 - hopY} w={500} display={display} />
      </div>
      <Chip f={f} at={479} x={540} y={300} text="15–20 PEJANTAN DITOLAK" bg={AMBER} color={GREEN} size={32} />
      <div style={{opacity: lin(f, 520, 535, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={381} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 3: SELEKSI SEKSUAL + BULU ----------
// Narasi lokal (absStart 1010): S1+S2+S3 triplet cepat 4 kata f 0-171 ->
// S4 "Hitamnya menyerap sembilan puluh sembilan koma sembilan lima persen
// cahaya — termasuk yang paling gelap di alam." f 171-377 -> S5 "Birunya
// bukan pigmen, tapi struktur bulu pemantul cahaya." f 377-588.
// Visual: (1) betina di atas + jantan di bawah + 3 chip cepat; (2) hitung
// 99,95% + super-black (tanpa highlight) vs hitam biasa (ada highlight);
// (3) bulu biru berkilau + chip "BUKAN PIGMEN" / "STRUKTUR BULU".
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const pct = lin(f, 171, 330, 0, 99.95, (t) => t);
  const pctText = pct.toFixed(2).replace('.', ',');
  const shimmer = 0.5 + 0.5 * Math.sin(f * 0.09);
  return (
    <AbsoluteFill style={{background: FOREST1}}>
      <ForestBg />
      {/* beat 1: triplet cepat */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 15, 0, 1) * lin(f, 171, 190, 1, 0)}}>
        <FemaleBirdAsset x={120} y={240} w={280} />
        <SuperbBirdAsset x={640} y={900} w={340} display={0.85} />
      </div>
      <div style={{opacity: lin(f, 0, 15, 0, 1) * lin(f, 171, 190, 1, 0)}}>
        <Chip f={f} at={10} x={540} y={560} text="BETINA MENILAI" bg={CREAM} color={GREEN} size={36} />
        <Chip f={f} at={76} x={540} y={680} text="JANTAN PAMER" bg={CREAM} color={GREEN} size={36} />
        <Chip f={f} at={120} x={540} y={800} text="BULUNYA DIBUAT UNTUK ITU" bg={AMBER} color={GREEN} size={32} />
      </div>
      {/* beat 2: 99,95% + super-black */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 171, 186, 0, 1) * lin(f, 377, 392, 1, 0)}}>
        <div style={{position: 'absolute', left: 0, top: 280, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 44, color: CREAM}}>HITAMNYA MENYERAP</div>
        <div style={{position: 'absolute', left: 0, top: 360, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 150, color: AMBER, lineHeight: 1}}>{pctText}%</div>
        <div style={{position: 'absolute', left: 0, top: 540, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 30, color: SAGE_L}}>CAHAYA</div>
        <div style={{position: 'absolute', left: 180, top: 700, width: 280, height: 280, borderRadius: '50%', background: '#000000'}} />
        <div style={{position: 'absolute', left: 180, top: 1000, width: 280, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 28, color: CREAM}}>SUPER-BLACK</div>
        <div style={{position: 'absolute', left: 620, top: 700, width: 280, height: 280, borderRadius: '50%', background: '#3A3A44'}}>
          <div style={{position: 'absolute', left: 52, top: 46, width: 74, height: 46, borderRadius: '50%',
            background: 'rgba(255,255,255,0.35)', transform: 'rotate(-18deg)'}} />
        </div>
        <div style={{position: 'absolute', left: 620, top: 1000, width: 280, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 28, color: CREAM}}>HITAM BIASA</div>
      </div>
      {/* beat 3: biru struktural — bulu asli (ujung runcing + barbs), bukan oval */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 377, 392, 0, 1)}}>
        <svg width={520} height={860} style={{position: 'absolute', left: 280, top: 320, transform: 'rotate(-8deg)'}} viewBox="0 0 520 860">
          <defs>
            <linearGradient id="featherG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6FE3FF" />
              <stop offset="55%" stopColor="#35D6FF" />
              <stop offset="100%" stopColor="#1E9FD8" />
            </linearGradient>
          </defs>
          <path d="M260,10 C400,140 470,360 440,560 C420,700 340,790 260,810 C180,790 100,700 80,560 C50,360 120,140 260,10 Z" fill="url(#featherG)" />
          {[110, 150, 175, 185, 180, 165, 140, 110, 75].map((half, i) => {
            const y = 140 + i * 70;
            return (
              <g key={i} stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeLinecap="round">
                <line x1={260} y1={y} x2={260 - half} y2={y + 44} />
                <line x1={260} y1={y} x2={260 + half} y2={y + 44} />
              </g>
            );
          })}
          <line x1={260} y1={845} x2={260} y2={40} stroke="#12384A" strokeWidth={12} strokeLinecap="round" />
          <ellipse cx={185} cy={300} rx={42} ry={150} fill="#FFFFFF" opacity={0.35 + shimmer * 0.3} transform="rotate(-12 185 300)" />
        </svg>
        <Chip f={f} at={377} x={540} y={1260} text="BUKAN PIGMEN" bg={AMBER} color={GREEN} size={40} />
        <Chip f={f} at={450} x={540} y={1380} text="STRUKTUR BULU" bg={CREAM} color={GREEN} size={36} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 4: KELUARGA 45 JENIS ----------
// Narasi lokal (absStart 1610): S1 "Superb cuma satu dari empat puluh lima
// jenis cendrawasih — hampir semuanya hidup di Pulau Papua dan sekitarnya."
// f 0-212 -> S2 "Ada yang ekornya sepanjang satu meter, ada yang menari
// bareng-bareng di satu pohon." f 212-374 -> S3 "Jantannya warna-warni;
// betinanya cokelat polos, yang justru pegang keputusan." f 374-547.
// Visual: (1) hitung 45 + peta Pulau Papua stilasi + titik sebaran;
// (2) astrapia ekor pita + batang perbandingan badan vs ekor;
// (3) lek — 3 jantan Paradisaea di dahan + betina menonton + chip.
const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const n45 = Math.round(lin(f, 20, 212, 0, 45, (t) => t));
  const dots: [number, number][] = [[300, 150], [430, 120], [560, 170], [690, 130], [790, 190], [220, 210]];
  return (
    <AbsoluteFill style={{background: FOREST1}}>
      <ForestBg />
      {/* beat 1: 45 jenis + peta */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 15, 0, 1) * lin(f, 212, 227, 1, 0)}}>
        <div style={{position: 'absolute', left: 0, top: 180, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 40, color: CREAM}}>SUPERB CUMA SATU DARI</div>
        <div style={{position: 'absolute', left: 0, top: 250, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 190, color: AMBER, lineHeight: 1}}>{n45}</div>
        <div style={{position: 'absolute', left: 0, top: 460, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 32, color: SAGE_L}}>JENIS CENDRAWASIH</div>
        <svg width={960} height={360} style={{position: 'absolute', left: 60, top: 620}} viewBox="0 0 960 360">
          <path d="M40,200 Q120,120 260,140 Q340,90 420,130 Q560,100 700,130 Q860,120 920,180 Q940,240 860,260 Q700,300 520,270 Q360,300 220,260 Q80,260 40,200 Z"
            fill="#2E7A46" stroke="#A8BFA9" strokeWidth={4} />
          {dots.map(([dx, dy], i) => (
            <circle key={i} cx={dx} cy={dy} r={13} fill={AMBER} opacity={lin(f, 60 + i * 22, 75 + i * 22, 0, 1)} />
          ))}
        </svg>
        <div style={{position: 'absolute', left: 0, top: 1000, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 30, color: CREAM, opacity: lin(f, 150, 165, 0, 1)}}>
          HAMPIR SEMUANYA DI PULAU PAPUA
        </div>
      </div>
      {/* beat 2: astrapia ekor 1 meter */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 212, 227, 0, 1) * lin(f, 374, 389, 1, 0)}}>
        <AstrapiaAsset x={90} y={420} w={360} tail={1 + 0.06 * Math.sin(f * 0.08)} />
        <div style={{position: 'absolute', left: 520, top: 560, width: 480}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM, marginBottom: 8}}>BADAN</div>
          <div style={{width: 200, height: 36, background: '#3A3A44', borderRadius: 18}} />
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM, marginTop: 30, marginBottom: 8}}>EKOR</div>
          <div style={{width: 460, height: 36, background: '#F4F1E6', borderRadius: 18}} />
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 34, color: AMBER, marginTop: 16}}>1 METER</div>
        </div>
        <Chip f={f} at={240} x={540} y={1420} text="EKOR LEBIH PANJANG DARI BADAN" bg={CREAM} color={GREEN} size={32} />
      </div>
      {/* beat 3: lek */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 374, 389, 0, 1)}}>
        <FemaleBirdAsset x={380} y={280} w={320} />
        <PlumeBirdAsset x={110} y={820} w={260} plume="#E8483F" />
        <PlumeBirdAsset x={410} y={860} w={240} plume="#F2C94C" flip />
        <PlumeBirdAsset x={700} y={820} w={260} plume="#35D6FF" />
        <Chip f={f} at={400} x={540} y={620} text="BETINA PEGANG KEPUTUSAN" bg={AMBER} color={GREEN} size={36} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 5: ASAL MITOS + PERDAGANGAN BULU ----------
// Narasi lokal (absStart 2156): S1 "Kenapa Eropa percaya mereka tidak punya
// kaki?" f 0-88 -> S2 "Karena kulit yang sampai ke Eropa dipotong kakinya,
// biar bulunya kelihatan." f 88-257 -> S3 "Tahun lima belas dua dua, awak
// Magellan membawa kulit itu ke Spanyol; Linnaeus menamainya apoda, tanpa
// kaki." f 257-507 -> S4 "Bulunya lalu jadi mode topi — puluhan ribu kulit
// tiap tahun, sampai populasinya anjlok." f 507-645.
// Visual: bab sejarah — latar cokelat hangat. (1) kartu vintage: kulit
// dagang tanpa kaki; (2) garis potong merah + chip "KAKI DIPOTONG";
// (3) 1522 + kapal + "APODA = TANPA KAKI" + "1758 LINNAEUS";
// (4) topi + hitung 30.000–80.000 + batang populasi menurun.
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const count = lin(f, 507, 600, 30000, 80000, (t) => t);
  const popW = lin(f, 560, 640, 960, 320, (t) => t);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #2A1E12 0%, #4A3220 60%, #5E4028 100%)'}}>
      {/* beat 1: kartu vintage */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 15, 0, 1) * lin(f, 88, 103, 1, 0)}}>
        <div style={{position: 'absolute', left: 190, top: 300, width: 700, height: 980, background: '#F4E8C8',
          borderRadius: 24, boxShadow: '0 18px 40px rgba(0,0,0,0.5)'}}>
          <div style={{position: 'absolute', left: 0, top: 60, width: 700, textAlign: 'center', fontFamily: 'Pop',
            fontWeight: 900, fontSize: 34, color: '#4A3220'}}>KULIT DAGANG, 1500-AN</div>
          <svg width={700} height={700} style={{position: 'absolute', top: 140, left: 0}} viewBox="0 0 700 700">
            <ellipse cx={350} cy={330} rx={150} ry={120} fill="#7A3B2E" />
            <circle cx={450} cy={220} r={70} fill="#F2C94C" />
            <ellipse cx={420} cy={290} rx={46} ry={30} fill="#1FA37A" />
            <g fill="#E8483F" opacity={0.95}>
              <ellipse cx={230} cy={420} rx={40} ry={140} transform="rotate(28 230 420)" />
              <ellipse cx={180} cy={380} rx={34} ry={120} transform="rotate(40 180 380)" />
            </g>
            <circle cx={350} cy={560} r={46} fill="none" stroke="#C0392B" strokeWidth={6} strokeDasharray="12 10" />
            <text x={350} y={578} textAnchor="middle" fontFamily="Pop, sans-serif" fontWeight={900} fontSize={52} fill="#C0392B">?</text>
          </svg>
          <div style={{position: 'absolute', left: 0, top: 880, width: 700, textAlign: 'center', fontFamily: 'Pop',
            fontWeight: 600, fontSize: 28, color: '#4A3220'}}>tanpa sayap, tanpa kaki</div>
        </div>
      </div>
      {/* beat 2: kaki dipotong */}
      <div style={{opacity: lin(f, 88, 103, 0, 1) * lin(f, 257, 272, 1, 0)}}>
        <Chip f={f} at={100} x={540} y={240} text="KAKI DIPOTONG" bg="#C0392B" color={CREAM} size={40} />
        <div style={{position: 'absolute', left: 0, top: 1420, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 30, color: '#F4E8C8', opacity: lin(f, 130, 145, 0, 1)}}>
          biar bulunya makin kelihatan
        </div>
      </div>
      {/* beat 3: 1522 + apoda */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 257, 272, 0, 1) * lin(f, 507, 522, 1, 0)}}>
        <div style={{position: 'absolute', left: 0, top: 300, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 170, color: AMBER, lineHeight: 1}}>1522</div>
        <div style={{position: 'absolute', left: 0, top: 500, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 30, color: '#F4E8C8'}}>awak Magellan membawa kulit itu ke Spanyol</div>
        <svg width={360} height={220} style={{position: 'absolute', left: 360, top: 640}} viewBox="0 0 360 220">
          <path d="M60,180 L300,180 L270,215 L90,215 Z" fill="#3A2E22" />
          <path d="M180,170 L180,40 L280,150 Z" fill="#F4E8C8" />
          <path d="M168,160 L168,60 L100,150 Z" fill="#E8D9B0" />
          <rect x={176} y={20} width={8} height={160} fill="#3A2E22" />
        </svg>
        <Chip f={f} at={330} x={540} y={980} text="APODA = TANPA KAKI" bg={AMBER} color={GREEN} size={40} />
        <div style={{position: 'absolute', left: 0, top: 1100, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 34, color: CREAM, opacity: lin(f, 380, 395, 0, 1)}}>
          1758 · LINNAEUS MENAMAINYA
        </div>
      </div>
      {/* beat 4: mode topi + populasi anjlok */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 507, 522, 0, 1)}}>
        {/* topi — cokelat terang supaya terbaca di latar cokelat gelap */}
        <div style={{position: 'absolute', left: 240, top: 320, width: 600, height: 90, borderRadius: '50%',
          background: '#8A6B3F'}} />
        <div style={{position: 'absolute', left: 390, top: 180, width: 300, height: 170, borderRadius: '150px 150px 20px 20px',
          background: '#B08D57'}} />
        <div style={{position: 'absolute', left: 390, top: 318, width: 300, height: 28, background: '#3A2E22'}} />
        <div style={{position: 'absolute', left: 620, top: 150, width: 90, height: 190, borderRadius: '50%',
          background: '#E8483F', transform: 'rotate(24deg)'}} />
        <div style={{position: 'absolute', left: 0, top: 560, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 130, color: AMBER, lineHeight: 1}}>{fmt(count)}</div>
        <div style={{position: 'absolute', left: 0, top: 710, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 30, color: '#F4E8C8'}}>KULIT TERJUAL TIAP TAHUN</div>
        <div style={{position: 'absolute', left: 60, top: 900, width: 960}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM, marginBottom: 10}}>POPULASI</div>
          <div style={{position: 'relative', width: 960, height: 44, background: 'rgba(244,232,200,0.25)', borderRadius: 22, overflow: 'hidden'}}>
            <div style={{width: popW, height: 44, background: '#C0392B', borderRadius: 22}} />
          </div>
        </div>
        <Chip f={f} at={560} x={540} y={1120} text="POPULASI ANJLOK" bg="#C0392B" color={CREAM} size={40} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 6: BOOKEND + sign-off + sumber (TANPA ombak) ----------
// Narasi lokal (absStart 2797): S1 "Jadi burung surga itu ternyata punya kaki,
// dan kakinya dipakai buat nari." f 0-225 -> S2 "Aku, Kejap — sampai jumpa di
// video berikutnya!" f 253-327.
// TANPA Ombak Sekejap — pelajaran revisi v2 Betelgeuse (23 Nov 22:36): ombak
// di akhir menutupi adegan dengan beige dan menyisakan layar kosong ±4,5 dtk.
// S6 ini pendek (337f) dan sign-off menempel di ekor — ombak hanya akan
// mengulang masalah itu. Langit hutan + burung tetap kelihatan sampai outro.
const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const echoO = lin(f, 20, 35, 0, 1) * lin(f, 210, 225, 1, 0);
  const srcO = lin(f, 120, 135, 0, 1) * lin(f, 215, 230, 1, 0);
  const hop = f >= 20 ? Math.abs(Math.sin(f * 0.18)) * 12 : 0;
  return (
    <AbsoluteFill style={{background: FOREST1}}>
      <ForestBg />
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 15, 0, 1)}}>
        <SuperbBirdAsset x={180} y={620} w={420} display={0.9} hop={hop} />
        <FemaleBirdAsset x={640} y={700} w={280} flip />
      </div>
      <div style={{position: 'absolute', left: 0, top: 240, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 46, color: CREAM, opacity: echoO}}>
        PUNYA KAKI, DIPAKAI BUAT NARI
      </div>
      <div style={{position: 'absolute', left: 0, top: 1420, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 24, color: SAGE_L, opacity: srcO, lineHeight: 1.5}}>
        Sumber: Wikipedia · Britannica · National Geographic · Smithsonian Libraries
      </div>
      <KejapAt x={320} y={1460} w={440} mood={f >= 253 ? 'senang' : 'default'} from={2797} />
    </AbsoluteFill>
  );
};

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 10, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 60, file: 'sfx/pop.wav', vol: 0.95},
  {at: 242, file: 'sfx/pop.wav', vol: 0.95},
  {at: 328, file: 'sfx/pop.wav', vol: 0.95},
  {at: 391, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 491, file: 'sfx/pop.wav', vol: 0.95},
  {at: 581, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 731, file: 'sfx/pop.wav', vol: 0.95},
  {at: 860, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1020, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1086, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1181, file: 'sfx/ding.wav', vol: 0.95},
  {at: 1387, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1620, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1630, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1822, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1984, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 2166, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 2244, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2413, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 2663, file: 'sfx/ding.wav', vol: 0.95},
  {at: 2807, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 2820, file: 'sfx/pop.wav', vol: 0.95},
  {at: 3050, file: 'sfx/sting-kejap.wav', vol: 0.95},
  {at: 3132, file: 'sfx/whoosh.wav', vol: 0.9},
];

export const Main: React.FC = () => {
  useFonts();
  const S = cues.scenes as number[];
  const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
  return (
    <AbsoluteFill style={{background: FOREST1}}>
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
