import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {MascotAsset, MoonAsset, SunAsset, RedSupergiantAsset, OrionAsset} from './assets2d';
import {Outro} from './Outro';
import cues from './cues.json';

const W = 1080, H = 1920, FPS = 30;
const GREEN = '#1F2A24', BEIGE = '#FEE5B2', CREAM = '#FFF6DE', AMBER = '#DE920C', SAGE = '#4E6B5B';
const NIGHT1 = '#070F1E', NIGHT2 = '#12233F', NIGHT3 = '#24365C', SAGE_L = '#A8BFA9';
const DAY1 = '#8FC3EC', DAY2 = '#D6EBFA';
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

/** Langit malam — kanvas tema seluruh video (amandemen latar 2, S1 ngikut tema).
    Dipakai ulang dari Uranus/Supermoon: bintang berkelip + ufuk utara. */
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

// ---------- SCENE 1: HOOK — three-layer S1 ----------
// Lisan (V2): "Bintang ini mungkin sudah meledak — sekitar enam ratus empat
// puluh tahun lalu. Cahayanya baru sampai besok." f 0-233.
// Teks layar: "TAHUN 1386" (celah baru yang dijawab P3).
// Visual: Orion + Betelgeuse merah besar (denyut pas "sudah meledak") +
// seberkas cahaya meluncur pas "Cahayanya baru sampai besok" + Kejap 440px
// ngintip kanan bawah. Batas kalimat: S1 berakhir ~f 148 (jeda 4.94-5.40).
const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const drift = lin(f, 0, 241, 1, 1.035, (t) => t);
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.12) * lin(f, 40, 60, 0, 1) * lin(f, 130, 148, 1, 0);
  const streak = lin(f, 150, 225, 0, 1, (t) => t);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <div style={{transform: `scale(${drift})`, transformOrigin: '50% 46%', width: W, height: H}}>
        <NightBg />
      </div>
      {/* Orion — Betelgeuse di (420, 388) absolut; cakram merah besar menutup
          titik kecil aset Orion di posisi yang sama */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 15, 0, 1)}}>
        <OrionAsset x={240} y={280} w={600} h={840} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 0, 15, 0, 1)}}>
        <RedSupergiantAsset x={290} y={258} d={260} glow pulse={pulse} />
      </div>
      {/* seberkas cahaya dari Betelgeuse meluncur ke bawah (f 150-225) */}
      {streak > 0 && (
        <div style={{position: 'absolute', left: 420, top: 388 + streak * 900, width: 14, height: 14,
          borderRadius: '50%', background: '#FFEFC4', boxShadow: '0 0 30px rgba(255,239,196,0.95)',
          transform: 'translateX(-50%)', opacity: 1 - streak * 0.4}} />
      )}
      <Chip f={f} at={0} x={540} y={120} text="TAHUN 1386" bg={AMBER} color={GREEN} size={52} />
      <div style={{opacity: lin(f, 60, 80, 0, 1)}}>
        <KejapAt x={860} y={1400} w={440} mood="takjub" from={0} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 2: DEFINISI + SKALA (data flat) ----------
// Narasi lokal (absStart 229): S1 "Andaikan saja: Betelgeuse, bintang merah
// raksasa di bahu Orion, lebarnya hampir delapan ratus kali Matahari."
// f 20-224 -> S2 "Kalau ditaruh di tempat Matahari, dia bakal menelan
// Merkurius, Venus, Bumi, dan Mars." f 224-401 -> S3 "Umurnya baru sekitar
// sepuluh juta tahun — bayi, dibanding Matahari yang empat setengah miliar
// tahun, tapi bintang besar hidupnya cepat." f 401-575.
// Visual: (1) Betelgeuse membesar + hitung "×800"; (2) cakram menelan 4
// planet di orbitnya satu per satu; (3) batang umur 10 jt vs 4,5 M tahun.
const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const x800 = Math.round(lin(f, 60, 224, 0, 800, (t) => t));
  const growD = lin(f, 60, 224, 120, 560, (t) => t);
  // beat 2: cakram pusat (540, 700) membesar 200 -> 800, menelan orbit 120/200/280/360
  const discD = lin(f, 224, 401, 200, 800, (t) => t);
  const discR = discD / 2;
  const orbits = [120, 200, 280, 360];
  const planetNames = ['MERKURIUS', 'VENUS', 'BUMI', 'MARS'];
  const planetCols = ['#B8B8B8', '#E8C97A', '#7FB8E8', '#D97B4A'];
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      {/* beat 1: perbandingan ukuran */}
      <div style={{position: 'absolute', left: 0, top: 200, width: W, opacity: lin(f, 20, 35, 0, 1) * lin(f, 224, 240, 1, 0)}}>
        <div style={{position: 'absolute', left: 60, top: 0, width: 960, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 40, color: CREAM}}>LEBARNYA HAMPIR</div>
        <div style={{position: 'absolute', left: 0, top: 70, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 150, color: AMBER, lineHeight: 1}}>×{x800}</div>
        <div style={{position: 'absolute', left: 0, top: 240, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 32, color: SAGE_L}}>KALI MATAHARI</div>
      </div>
      <div style={{position: 'absolute', left: 540 - growD / 2, top: 840 - growD / 2, width: growD, height: growD,
        opacity: lin(f, 20, 35, 0, 1) * lin(f, 224, 240, 1, 0)}}>
        <RedSupergiantAsset x={0} y={0} d={growD} glow />
      </div>
      {/* beat 2: cakram menelan planet */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 224, 240, 0, 1)}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {orbits.map((r, i) => (
            <circle key={i} cx={540} cy={700} r={r} fill="none" stroke="#FFEFC4" strokeWidth={2}
              strokeDasharray="10 10" opacity={discR > r ? 0.15 : 0.55} />
          ))}
        </svg>
        {/* Matahari kecil di tengah (diganti cakram) */}
        <div style={{position: 'absolute', left: 540 - 60, top: 700 - 60, width: 120, height: 120, borderRadius: '50%',
          background: '#FFC93C', opacity: lin(f, 260, 280, 1, 0)}} />
        <div style={{position: 'absolute', left: 540 - discD / 2, top: 700 - discD / 2, width: discD, height: discD,
          opacity: lin(f, 260, 280, 0, 1)}}>
          <RedSupergiantAsset x={0} y={0} d={discD} glow />
        </div>
        {orbits.map((r, i) => {
          const a = -0.9 + i * 0.55;
          const px = 540 + r * Math.cos(a), py = 700 + r * Math.sin(a);
          const swallowed = discR > r + 10;
          return (
            <g key={i}>
              <div style={{position: 'absolute', left: px - 16, top: py - 16, width: 32, height: 32, borderRadius: '50%',
                background: planetCols[i], boxShadow: `0 0 12px ${planetCols[i]}`,
                opacity: swallowed ? 0 : 1}} />
              <div style={{position: 'absolute', left: px - 70, top: py + 24, width: 140, textAlign: 'center',
                fontFamily: 'Pop', fontWeight: 900, fontSize: 22, color: CREAM, opacity: swallowed ? 0 : 1}}>
                {planetNames[i]}
              </div>
            </g>
          );
        })}
        <div style={{position: 'absolute', left: 0, top: 1160, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 600, fontSize: 30, color: SAGE_L, opacity: lin(f, 224, 240, 0, 1) * lin(f, 401, 415, 1, 0)}}>
          kalau ditaruh di tempat Matahari…
        </div>
      </div>
      {/* beat 3: batang umur */}
      <div style={{position: 'absolute', left: 60, top: 1330, width: 960, opacity: lin(f, 401, 415, 0, 1)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM}}>
          <span>BETELGEUSE</span><span>10 JUTA TAHUN</span>
        </div>
        <div style={{width: 40, height: 44, background: AMBER, borderRadius: 22, marginTop: 8}} />
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM, marginTop: 26}}>
          <span>MATAHARI</span><span>4,5 MILIAR TAHUN</span>
        </div>
        <div style={{width: 960, height: 44, background: '#2B5C8A', borderRadius: 22, marginTop: 8}} />
      </div>
      <Chip f={f} at={470} x={540} y={1620} text="BINTANG BESAR HIDUPNYA CEPAT" bg={AMBER} color={GREEN} size={32} />
      <div style={{opacity: lin(f, 500, 515, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={229} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 3: PERJALANAN CAHAYA (timeline) ----------
// Narasi lokal (absStart 798): S1 "Anehnya: cahaya butuh enam ratus empat
// puluh tahun buat sampai ke kita." f 20-221 -> S2 "Jadi kalau besok malam
// muncul bintang baru yang terang benderang, ledakannya sudah terjadi sekitar
// tahun seribu tiga ratus delapan puluh enam." f 221-460.
// Visual: (1) titik cahaya berangkat dari Betelgeuse (1386) menyusuri garis
// waktu ke Bumi (2026), angka tahun menghitung naik; (2) bintang baru
// meledak terang + chip "1386".
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const travel = lin(f, 30, 221, 0, 1, (t) => t);
  const dotX = 180 + travel * 720;
  const year = Math.round(lin(f, 30, 221, 1386, 2026, (t) => t));
  const newStar = lin(f, 221, 245, 0, 1);
  const newStarPulse = 0.5 + 0.5 * Math.sin(f * 0.15);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      {/* garis waktu cahaya */}
      <div style={{position: 'absolute', left: 100, top: 700, width: 880, height: 6, background: '#FFEFC4',
        borderRadius: 3, opacity: lin(f, 20, 35, 0, 0.7)}} />
      <div style={{position: 'absolute', left: 180, top: 620, opacity: lin(f, 20, 35, 0, 1)}}>
        <RedSupergiantAsset x={-90} y={-90} d={180} glow />
        <div style={{position: 'absolute', left: -90, top: 110, width: 180, textAlign: 'center',
          fontFamily: 'Pop', fontWeight: 900, fontSize: 28, color: '#FF8A5C'}}>BETELGEUSE</div>
      </div>
      <div style={{position: 'absolute', left: 900, top: 620, opacity: lin(f, 20, 35, 0, 1)}}>
        <div style={{width: 90, height: 90, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 32%, #7FB8E8, #2B5C8A 65%)',
          boxShadow: '0 0 26px rgba(127,184,232,0.6)'}} />
        <div style={{position: 'absolute', left: -15, top: 110, width: 120, textAlign: 'center',
          fontFamily: 'Pop', fontWeight: 900, fontSize: 28, color: CREAM}}>BUMI</div>
      </div>
      {/* titik cahaya berjalan */}
      <div style={{position: 'absolute', left: dotX - 14, top: 689, width: 28, height: 28, borderRadius: '50%',
        background: '#FFEFC4', boxShadow: '0 0 26px rgba(255,239,196,0.95)',
        opacity: lin(f, 30, 45, 0, 1) * lin(f, 200, 221, 1, 0)}} />
      {/* penghitung tahun */}
      <div style={{position: 'absolute', left: 0, top: 900, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 130, color: AMBER, opacity: lin(f, 30, 45, 0, 1)}}>
        {year}
      </div>
      <div style={{position: 'absolute', left: 0, top: 1060, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 30, color: SAGE_L, opacity: lin(f, 30, 45, 0, 1) * lin(f, 221, 240, 1, 0)}}>
        tahun cahaya itu berjalan…
      </div>
      {/* bintang baru meledak terang */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: newStar}}>
        <RedSupergiantAsset x={330} y={1150} d={420} glow pulse={newStarPulse} />
      </div>
      <Chip f={f} at={240} x={540} y={1700} text="LEDAKANNYA: TAHUN 1386" bg={AMBER} color={GREEN} size={40} />
      <div style={{opacity: lin(f, 380, 395, 0, 1)}}>
        <KejapAt x={-30} y={1620} w={220} mood="takjub" from={798} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 4: YANG BAKAL KITA LIHAT (siang hari) ----------
// Narasi lokal (absStart 1246): "Yang bakal kita lihat: titik cahaya yang
// ratusan kali lebih terang dari Venus, kelihatan bahkan di siang hari, selama
// dua sampai tiga bulan, sampai bikin bayangan di tanah. Bukan akhir dunia —
// cuma langit yang berubah."
// Visual: (1) Venus (titik kecil) vs supernova (cakram pijar + sinar) +
// chip "RATUSAN × LEBIH TERANG"; (2) batang durasi "2–3 BULAN"; (3) bayangan
// di tanah + kata penutup. Kanvas siang (kontras sengaja dengan malam).
const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const barW = lin(f, 250, 330, 0, 1, (t) => t);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${DAY1} 0%, ${DAY2} 100%)`}}>
      {/* matahari siang (kecil, kiri atas) */}
      <div style={{position: 'absolute', left: 90, top: 150, width: 130, height: 130, borderRadius: '50%',
        background: '#FFF3C4', boxShadow: '0 0 40px rgba(255,243,196,0.9)', opacity: lin(f, 0, 12, 0, 1)}} />
      <div style={{position: 'absolute', left: 90, top: 300, width: 130, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 26, color: GREEN, opacity: lin(f, 0, 12, 0, 1)}}>MATAHARI</div>
      {/* Venus — titik kecil */}
      <div style={{position: 'absolute', left: 0, top: 480, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 36, color: GREEN, opacity: lin(f, 20, 35, 0, 1)}}>
        VENUS
      </div>
      <div style={{position: 'absolute', left: 505, top: 560, width: 70, height: 70, borderRadius: '50%',
        background: '#FFF6DE', boxShadow: '0 0 20px rgba(255,246,222,0.9)', opacity: lin(f, 20, 35, 0, 1)}} />
      {/* supernova — jauh lebih besar + pijar */}
      <div style={{position: 'absolute', left: 0, top: 700, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 36, color: GREEN, opacity: lin(f, 60, 75, 0, 1)}}>
        SUPERNOVA BETELGEUSE
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 60, 75, 0, 1)}}>
        <RedSupergiantAsset x={340} y={780} d={400} glow pulse={0.5 + 0.5 * Math.sin(f * 0.12)} />
      </div>
      <Chip f={f} at={90} x={540} y={1260} text="RATUSAN × LEBIH TERANG" bg={AMBER} color={GREEN} size={40} />
      {/* batang durasi */}
      <div style={{position: 'absolute', left: 60, top: 1380, width: 960, opacity: lin(f, 250, 265, 0, 1)}}>
        <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 32, color: GREEN, marginBottom: 10}}>
          KELIHATAN DI SIANG HARI — 2 SAMPAI 3 BULAN
        </div>
        <div style={{position: 'relative', width: 960, height: 44, background: '#FFFFFF', borderRadius: 22, overflow: 'hidden'}}>
          <div style={{width: 960 * barW, height: 44, background: AMBER, borderRadius: 22}} />
        </div>
      </div>
      {/* bayangan di tanah */}
      <div style={{position: 'absolute', left: 0, top: 1560, width: W, height: 360, background: '#7A9A5B', opacity: lin(f, 330, 345, 0, 0.9)}} />
      <div style={{position: 'absolute', left: 140, top: 1580, width: 60, height: 200, background: '#1F2A24',
        borderRadius: 30, opacity: lin(f, 330, 345, 0, 0.85), transform: 'rotate(24deg)', transformOrigin: '30px 200px'}} />
      <div style={{position: 'absolute', left: 720, top: 1640, width: 320, height: 40, background: '#1F2A24',
        borderRadius: 20, opacity: lin(f, 330, 345, 0, 0.5), transform: 'rotate(-8deg)'}} />
      <div style={{position: 'absolute', left: 0, top: 1740, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 34, color: CREAM, opacity: lin(f, 345, 360, 0, 1)}}>
        SAMPAI BIKIN BAYANGAN DI TANAH
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 5: KEJUJURAN — 100.000 TAHUN + GREAT DIMMING ----------
// Narasi lokal (absStart 1638): S1 "Tapi jujur saja: 'besok' di sini cuma
// andaian." f 20-121 -> S2 "Astronom bilang ledakannya bisa terjadi kapan
// saja dalam seratus ribu tahun ke depan — dan redup besar tahun dua ribu
// sembilan belas ternyata cuma awan debu, bukan tanda mau meledak." f 121-434.
// Visual: (1) Kejap skeptis + "CUMA ANDAIAN"; (2) garis 100.000 tahun dengan
// penanda "BISA KAPAN SAJA"; (3) Betelgeuse meredup 2019 (awan debu) lalu
// terang lagi + chip penjelas.
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = lin(f, 121, 260, 0, 1, (t) => t);
  const dim = lin(f, 260, 320, 1, 0.25, (t) => t) * lin(f, 360, 410, 0.25, 1, (t) => t);
  const dustO = lin(f, 280, 320, 0, 0.9, (t) => t) * lin(f, 360, 410, 0.9, 0, (t) => t);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      <div style={{opacity: lin(f, 20, 35, 0, 1)}}>
        <KejapAt x={320} y={300} w={440} mood="skeptis" from={1638} />
      </div>
      <Chip f={f} at={30} x={540} y={820} text="CUMA ANDAIAN" bg={CREAM} color={GREEN} size={40} />
      {/* garis 100.000 tahun */}
      <div style={{position: 'absolute', left: 100, top: 1000, width: 880, height: 8, background: '#FFEFC4',
        borderRadius: 4, opacity: lin(f, 121, 135, 0, 0.7)}} />
      <div style={{position: 'absolute', left: 100, top: 940, fontFamily: 'Pop', fontWeight: 900, fontSize: 30,
        color: CREAM, opacity: lin(f, 121, 135, 0, 1)}}>HARI INI</div>
      <div style={{position: 'absolute', right: 100, top: 940, fontFamily: 'Pop', fontWeight: 900, fontSize: 30,
        color: CREAM, opacity: lin(f, 121, 135, 0, 1)}}>100.000 TAHUN LAGI</div>
      <div style={{position: 'absolute', left: 100 + sweep * 880 - 22, top: 978, width: 44, height: 44,
        borderRadius: '50%', background: AMBER, boxShadow: '0 0 22px rgba(222,146,12,0.9)',
        opacity: lin(f, 121, 135, 0, 1)}} />
      <Chip f={f} at={180} x={540} y={1120} text="BISA KAPAN SAJA" bg={AMBER} color={GREEN} size={36} />
      {/* Great Dimming: Betelgeuse meredup + awan debu */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 260, 275, 0, 1)}}>
        <RedSupergiantAsset x={360} y={1300} d={360} glow opacity={dim} />
        <div style={{position: 'absolute', left: 360, top: 1300, width: 360, height: 360, opacity: dustO}}>
          {[[54, 108, 81], [198, 54, 99], [108, 234, 90], [252, 216, 72]].map(([cx, cy, r], i) => (
            <div key={i} style={{position: 'absolute', left: cx, top: cy, width: r, height: r * 0.7,
              borderRadius: '50%', background: 'rgba(120,110,100,0.85)'}} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 1240, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 36, color: CREAM, opacity: lin(f, 260, 275, 0, 1)}}>
        REDUP BESAR 2019
      </div>
      <Chip f={f} at={320} x={540} y={1720} text="AWAN DEBU, BUKAN TANDA MELEDAK" bg={CREAM} color={GREEN} size={32} />
    </AbsoluteFill>
  );
};

// ---------- SCENE 6: BOOKEND + sign-off + sumber (tanpa ombak — revisi v2) ----------
// Narasi lokal (absStart 2060): S1 "Yang pasti: sejauh ini, nol bahaya buat
// Bumi, dan Orion bakal kehilangan bahunya selamanya." f 20-194 -> S2 "Jadi
// kalau besok malam ada cahaya baru di Orion, kamu lagi nonton sejarah yang
// berangkat enam ratus empat puluh tahun lalu." f 194-413 -> S3 "Aku, Kejap —
// sampai jumpa di video berikutnya!" f 413-496.
// REVISI v2 (user 23 Nov 22:36): Ombak Sekejap f 300-360 DIHAPUS — ombak menutupi
// langit malam dengan beige dan menyisakan ±4,5 dtk layar kosong (cuma beige +
// Kejap) selama VO S2 + sign-off. Tanpa ombak, langit malam + Orion tetap
// kelihatan sampai sign-off; durasi/cues/audio tidak berubah.
const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const srcO = lin(f, 150, 165, 0, 1) * lin(f, 195, 210, 1, 0);
  const chipsO = lin(f, 194, 210, 1, 0);
  const echoO = lin(f, 194, 210, 0, 1) * lin(f, 300, 315, 1, 0);
  return (
    <AbsoluteFill style={{background: NIGHT1}}>
      <NightBg />
      {/* Orion tanpa bahunya */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 20, 35, 0, 1)}}>
        <OrionAsset x={290} y={240} w={500} h={700} missing label />
      </div>
      <div style={{opacity: chipsO}}>
        <Chip f={f} at={60} x={540} y={1060} text="ORION KEHILANGAN BAHUNYA" bg={AMBER} color={GREEN} size={36} />
        <Chip f={f} at={100} x={540} y={1160} text="NOL BAHAYA BUAT BUMI" bg={CREAM} color={GREEN} size={36} />
      </div>
      {/* gema sejarah: cahaya berangkat 640 tahun lalu */}
      <div style={{position: 'absolute', left: 0, top: 1300, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 44, color: CREAM, opacity: echoO}}>
        SEJARAH 640 TAHUN LALU
      </div>
      {/* baris sumber — resep Paus V6, fade-in di akhir adegan konten */}
      <div style={{position: 'absolute', left: 0, top: 1420, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 24, color: SAGE_L, opacity: srcO, lineHeight: 1.5}}>
        Sumber: NASA · ESO · Farmers' Almanac · The Science 360
      </div>
      <KejapAt x={320} y={1460} w={440} mood={f >= 413 ? 'senang' : 'default'} from={2060} />
    </AbsoluteFill>
  );
};

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 10, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 60, file: 'sfx/pop.wav', vol: 0.95},
  {at: 150, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 239, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 259, file: 'sfx/pop.wav', vol: 0.95},
  {at: 400, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 480, file: 'sfx/pop.wav', vol: 0.95},
  {at: 560, file: 'sfx/pop.wav', vol: 0.95},
  {at: 808, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 828, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1019, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1100, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1256, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1276, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1496, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1576, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1648, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1668, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1759, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1898, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2000, file: 'sfx/ding.wav', vol: 0.95},
  {at: 2070, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 2090, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2254, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2473, file: 'sfx/sting-kejap.wav', vol: 0.95},
  {at: 2544, file: 'sfx/whoosh.wav', vol: 0.9},
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
