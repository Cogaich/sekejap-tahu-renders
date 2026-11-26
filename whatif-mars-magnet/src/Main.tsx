import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, spring, Easing, random} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {MascotAsset, PlanetMarsAsset, MagnetShieldAsset, SolarWindAsset, RoverAsset} from './assets2d';
import {Outro} from './Outro';
import cues from './cues.json';

const W = 1080, H = 1920, FPS = 30;
const GREEN = '#1F2A24', BEIGE = '#FEE5B2', CREAM = '#FFF6DE', AMBER = '#DE920C', SAGE = '#4E6B5B';
const SPACE1 = '#0B1020', SPACE2 = '#141B2E', SPACE3 = '#1E2A44', SAGE_L = '#A8BFA9';
const RUST = '#C1552F', RUSTD = '#8A3B22', RUSTL = '#E07B4C', SKY = '#7FB8E8', DEEP = '#2B5C8A';
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

const Starfield: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${SPACE1} 0%, ${SPACE2} 62%, ${SPACE3} 100%)`}}>
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

// ---------- SCENE 1: HOOK — three-layer S1 ----------
// Lisan (V1): "Mars kehilangan seratus gram atmosfer setiap detik." f 0-108
// -> "Perisainya padam empat miliar tahun lalu, dan sejak itu atmosfernya
// bocor terus." f 108-296 -> "Bayangkan kalau perisai itu tidak pernah
// padam." f 311-366. Teks layar: "100 GRAM/DETIK".
// Visual: Mars besar + perisai utuh, lalu retak & memudar pas "padam",
// partikel atmosfer bocor mengalir keluar + Kejap ngintip.
const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const shield = lin(f, 108, 200, 1, 0.12, (t) => t);
  const leak = lin(f, 130, 200, 0, 1, (t) => t);
  const dim = lin(f, 130, 296, 1, 0.82, (t) => t);
  return (
    <AbsoluteFill style={{background: SPACE1}}>
      <Starfield />
      <div style={{opacity: dim}}>
        <PlanetMarsAsset x={540} y={760} r={300} />
      </div>
      <MagnetShieldAsset x={540} y={760} r={300} strength={shield} />
      {/* partikel atmosfer bocor mengalir keluar dari Mars */}
      <div style={{opacity: leak}}>
        <SolarWindAsset frame={f} x={700} y={520} w={380} h={480} count={18} speed={7} dir={1} color="#E07B4C" opacity={0.9} />
      </div>
      <Chip f={f} at={0} x={540} y={120} text="100 GRAM/DETIK" bg={AMBER} color={GREEN} size={52} />
      <div style={{opacity: lin(f, 60, 75, 0, 1)}}>
        <KejapAt x={860} y={1400} w={440} mood="takjub" from={0} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 2: MARS PURBA BERAIR (AKSI) ----------
// Narasi lokal (absStart 366): S1 "Dulu Mars bukan gurun merah." f 23-75
// -> S2 "Tiga koma delapan miliar tahun lalu, sungai mengalir di
// permukaannya dan danau mengisi kawah Gale." f 93-262 -> S3 "Robot
// Curiosity menemukan dasar danau itu, dan Perseverance menemukan delta
// sungai di kawah Jezero." f 286-464 -> S4 "Jejaknya masih bisa kita baca
// sampai hari ini." f 477-553.
// Visual: langit biru purba + sungai berliku mengalir + danau di kawah
// mengisi + rover di tepi danau + delta Jezero.
const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const sky = lin(f, 23, 60, 0, 1, (t) => t);
  const river = lin(f, 93, 140, 0, 1, (t) => t);
  const lake = spr(f, 180, 11, 150);
  const roverO = lin(f, 286, 301, 0, 1);
  const deltaO = lin(f, 360, 375, 0, 1);
  const flow = (f * 2.2) % 100;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #5A93C9 0%, #9CC3E4 55%, #E8D9B0 78%, ${RUST} 100%)`, opacity: 1}}>
      {/* langit purba menyapu masuk menutupi merah */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H,
        background: `linear-gradient(180deg, #5A93C9 0%, #9CC3E4 55%, #E8D9B0 78%, ${RUST} 100%)`, opacity: sky}} />
      {/* Matahari purba */}
      <div style={{position: 'absolute', left: 110, top: 130, width: 120, height: 120, borderRadius: '50%',
        background: '#FFF3C4', boxShadow: '0 0 44px rgba(255,243,196,0.9)', opacity: lin(f, 23, 38, 0, 1)}} />
      {/* bukit gurun */}
      <svg width={W} height={420} style={{position: 'absolute', bottom: 0, left: 0, opacity: 0.9}}>
        <path d="M0,420 L0,240 Q220,150 480,220 Q720,280 1080,180 L1080,420 Z" fill={RUSTD} />
        <path d="M0,420 L0,320 Q300,240 620,300 Q880,340 1080,280 L1080,420 Z" fill={RUST} />
      </svg>
      {/* sungai berliku */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: river}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <path d="M700,60 C620,280 800,480 640,720 C520,920 720,1100 580,1330" fill="none" stroke={DEEP} strokeWidth={46} strokeLinecap="round" opacity={0.95} />
          <path d="M700,60 C620,280 800,480 640,720 C520,920 720,1100 580,1330" fill="none" stroke={SKY} strokeWidth={28} strokeLinecap="round" opacity={0.9} />
        </svg>
        {/* titik aliran sungai */}
        {[0, 1, 2].map((i) => {
          const p = ((flow + i * 33) % 100) / 100;
          const px = 700 - 140 * Math.sin(p * 5.2) - p * 140;
          const py = 60 + p * 1270;
          return <div key={i} style={{position: 'absolute', left: px - 9, top: py - 9, width: 18, height: 18,
            borderRadius: '50%', background: '#FFFFFF', opacity: 0.85, boxShadow: '0 0 14px rgba(255,255,255,0.9)'}} />;
        })}
      </div>
      {/* kawah + danau mengisi */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: lin(f, 140, 155, 0, 1)}}>
        <div style={{position: 'absolute', left: 540 - 260, top: 1180, width: 520, height: 260, borderRadius: '50%',
          border: `14px solid ${RUSTD}`, boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: 540 - 230 * lake, top: 1210, width: 460 * lake, height: 200 * lake,
          borderRadius: '50%', background: `radial-gradient(ellipse at 50% 40%, ${SKY}, ${DEEP})`, opacity: 0.95}} />
        <div style={{position: 'absolute', left: 0, top: 1130, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 32, color: CREAM, textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>KAWAH GALE</div>
      </div>
      {/* delta Jezero + rover */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: deltaO}}>
        <svg width={W} height={H} style={{position: 'absolute'}}>
          <path d="M150,1500 L330,1330 L470,1500 Z" fill="#D9B380" opacity={0.9} />
          <path d="M190,1500 L330,1360 L430,1500 Z" fill="#C9A06B" opacity={0.9} />
        </svg>
        <div style={{position: 'absolute', left: 0, top: 1560, width: W, textAlign: 'center', fontFamily: 'Pop',
          fontWeight: 900, fontSize: 32, color: CREAM, textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>DELTA JEZERO</div>
      </div>
      <div style={{opacity: roverO}}>
        <RoverAsset x={120} y={1620} w={300} />
      </div>
      <Chip f={f} at={93} x={540} y={150} text="3,8 MILIAR TAHUN LALU" bg={AMBER} color={GREEN} size={36} />
      <Chip f={f} at={477} x={540} y={150} text="JEJAKNYA MASIH BISA DIBACA" bg={CREAM} color={GREEN} size={32} />
      <div style={{opacity: lin(f, 500, 515, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={366} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 3: DINAMO + PERISAI ----------
// Narasi lokal (absStart 919): S1 "Yang melindungi semua itu adalah medan
// magnet, perisai tak terlihat yang dihasilkan dinamo di inti Mars."
// f 24-207 -> S2 "Perisai itu membelokkan angin surya, partikel bermuatan
// dari Matahari, sehingga atmosfer tebal Mars terlindungi di bawahnya."
// f 224-444.
// Visual: Mars potongan — inti menyala + garis medan + angin surya datang
// dari kanan lalu dibelokkan mengelilingi perisai.
const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const core = lin(f, 24, 60, 0, 1, (t) => t);
  const corePulse = 0.5 + 0.5 * Math.sin(f * 0.1);
  const wind = lin(f, 224, 260, 0, 1, (t) => t);
  return (
    <AbsoluteFill style={{background: SPACE1}}>
      <Starfield />
      {/* Matahari kecil kanan atas */}
      <div style={{position: 'absolute', left: 880, top: 130, width: 110, height: 110, borderRadius: '50%',
        background: '#FFC93C', boxShadow: '0 0 40px rgba(255,201,60,0.9)', opacity: lin(f, 224, 240, 0, 1)}} />
      <div style={{position: 'absolute', left: 880, top: 255, width: 110, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 24, color: CREAM, opacity: lin(f, 224, 240, 0, 1)}}>MATAHARI</div>
      {/* Mars potongan: irisan kuadran kanan-bawah memperlihatkan inti menyala */}
      <div style={{opacity: lin(f, 10, 25, 0, 1)}}>
        <PlanetMarsAsset x={540} y={820} r={290} />
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <radialGradient id="coreGrad" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFE9A8" />
              <stop offset="70%" stopColor="#DE920C" />
            </radialGradient>
          </defs>
          <path d="M540,820 L806,820 A266,266 0 0 1 540,1086 Z" fill="#241A12" />
          <circle cx={650} cy={930} r={58} fill="url(#coreGrad)" />
        </svg>
        <div style={{position: 'absolute', left: 650 - 110, top: 930 - 110, width: 220, height: 220, borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, rgba(255,201,60,${0.35 + 0.25 * corePulse * core}), rgba(222,146,12,0) 70%)`,
          opacity: core}} />
      </div>
      <div style={{opacity: lin(f, 40, 55, 0, 1)}}>
        <MagnetShieldAsset x={540} y={820} r={290} strength={1} />
      </div>
      {/* angin surya dibelokkan */}
      <div style={{opacity: wind}}>
        <SolarWindAsset frame={f} x={620} y={300} w={460} h={260} count={16} speed={8} dir={-1} color="#FFE9A8" />
        <SolarWindAsset frame={f} x={620} y={1150} w={460} h={260} count={16} speed={8} dir={-1} color="#FFE9A8" />
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M1080,430 C900,430 820,560 780,700" fill="none" stroke="#FFE9A8" strokeWidth={5} strokeDasharray="14 12" opacity={0.7} />
          <path d="M1080,1240 C900,1240 820,1120 780,980" fill="none" stroke="#FFE9A8" strokeWidth={5} strokeDasharray="14 12" opacity={0.7} />
        </svg>
      </div>
      <Chip f={f} at={24} x={540} y={150} text="DINAMO DI INTI MARS" bg={AMBER} color={GREEN} size={36} />
      <Chip f={f} at={224} x={540} y={150} text="ANGIN SURYA DIBELOKKAN" bg={CREAM} color={GREEN} size={32} />
      <div style={{opacity: lin(f, 100, 115, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={919} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 4: DINAMO MATI + EROSI ----------
// Narasi lokal (absStart 1361): S1 "Lalu dinamonya mati, sekitar empat
// miliar tahun lalu." f 21-130 -> S2 "Tanpa perisai, angin surya menghantam
// atmosfer langsung dan mengikisnya sedikit demi sedikit, selama miliaran
// tahun." f 149-370 -> S3 "Tekanan udara Mars sekarang tinggal nol koma
// enam persen Bumi, terlalu tipis untuk menahan air cair." f 389-545.
// Visual: inti padam + perisai retak & hilang + angin menghantam langsung
// + atmosfer terkelupas + batang tekanan 0,6% vs 100%.
const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const coreFade = lin(f, 21, 90, 1, 0.08, (t) => t);
  const shield = lin(f, 21, 110, 1, 0.05, (t) => t);
  const hit = lin(f, 149, 180, 0, 1, (t) => t);
  const strip = lin(f, 180, 370, 0, 1, (t) => t);
  const barW = lin(f, 389, 460, 0, 1, (t) => t);
  return (
    <AbsoluteFill style={{background: SPACE1}}>
      <Starfield />
      <div style={{position: 'absolute', left: 880, top: 130, width: 110, height: 110, borderRadius: '50%',
        background: '#FFC93C', boxShadow: '0 0 40px rgba(255,201,60,0.9)'}} />
      <div style={{position: 'absolute', left: 880, top: 255, width: 110, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 900, fontSize: 24, color: CREAM}}>MATAHARI</div>
      {/* Mars meredup + irisan inti padam */}
      <div style={{opacity: 0.55 + 0.45 * coreFade}}>
        <PlanetMarsAsset x={540} y={700} r={260} />
      </div>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M540,700 L779,700 A239,239 0 0 1 540,939 Z" fill="#241A12" />
      </svg>
      <div style={{position: 'absolute', left: 640 - 50, top: 800 - 50, width: 100, height: 100, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #FFE9A8, #DE920C 70%)', opacity: coreFade}} />
      <div style={{position: 'absolute', left: 640 - 50, top: 800 - 50, width: 100, height: 100, borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, #8A7A5A, #4A3A28 70%)', opacity: 1 - coreFade}} />
      <MagnetShieldAsset x={540} y={700} r={260} strength={shield} />
      {/* angin menghantam langsung + atmosfer terkelupas */}
      <div style={{opacity: hit}}>
        <SolarWindAsset frame={f} x={0} y={380} w={1080} h={640} count={30} speed={10} dir={-1} color="#FFE9A8" />
      </div>
      <div style={{opacity: strip}}>
        <SolarWindAsset frame={f} x={0} y={480} w={700} h={440} count={14} speed={6} dir={-1} color="#E07B4C" opacity={0.85} />
      </div>
      <Chip f={f} at={21} x={540} y={150} text="DINAMO MATI" bg={AMBER} color={GREEN} size={40} />
      <Chip f={f} at={149} x={540} y={150} text="ATMOSFER TERKIKIS" bg={CREAM} color={GREEN} size={36} />
      {/* batang tekanan */}
      <div style={{position: 'absolute', left: 60, top: 1330, width: 960, opacity: lin(f, 389, 404, 0, 1)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM}}>
          <span>BUMI</span><span>100%</span>
        </div>
        <div style={{width: 960 * barW, height: 44, background: '#2B5C8A', borderRadius: 22, marginTop: 8}} />
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Pop', fontWeight: 900, fontSize: 30, color: CREAM, marginTop: 26}}>
          <span>MARS SEKARANG</span><span>0,6%</span>
        </div>
        <div style={{width: Math.max(14, 960 * 0.006 * barW), height: 44, background: AMBER, borderRadius: 22, marginTop: 8}} />
        <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 28, color: SAGE_L, marginTop: 18, textAlign: 'center'}}>
          terlalu tipis untuk menahan air cair
        </div>
      </div>
      <div style={{opacity: lin(f, 100, 115, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="skeptis" from={1361} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 5: ANDAIAN + DEBAT ----------
// Narasi lokal (absStart 1904): S1 "Andai perisainya tidak pernah padam,
// angin surya tidak pernah menggerogoti atmosfer Mars." f 22-161 -> S2
// "Air dan danau bisa bertahan jauh lebih lama, dan Mars mungkin tetap
// planet biru kedua." f 172-322 -> S3 "Tapi hati-hati, para ilmuwan masih
// memperdebatkan apakah Mars purba benar-benar hangat dan basah terus,
// atau dingin dengan masa-masa basah saja." f 375-582.
// Visual: Mars biru (berair) + dua kartu debat.
const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const blue = lin(f, 22, 90, 0, 1, (t) => t);
  const card1 = spr(f, 375, 10, 190);
  const card2 = spr(f, 395, 10, 190);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${SPACE2} 0%, ${SPACE3} 100%)`}}>
      <Starfield />
      {/* Mars merah kini (memudar) */}
      <div style={{opacity: 1 - blue}}>
        <PlanetMarsAsset x={540} y={560} r={230} />
      </div>
      {/* Mars biru andaian */}
      <div style={{opacity: blue}}>
        <svg width={560} height={560} viewBox="0 0 100 100" style={{position: 'absolute', left: 540 - 230, top: 560 - 230}}>
          <circle cx={50} cy={50} r={48} fill="#2B5C8A" />
          <ellipse cx={35} cy={62} rx={25} ry={14} fill="#7FB8E8" opacity={0.8} />
          <ellipse cx={68} cy={38} rx={16} ry={10} fill="#9CC3E4" opacity={0.8} />
          <ellipse cx={55} cy={76} rx={19} ry={9} fill="#5A93C9" opacity={0.8} />
          <ellipse cx={50} cy={8} rx={16} ry={6} fill="#F7FAF7" opacity={0.9} />
          <ellipse cx={30} cy={30} rx={14} ry={8} fill="#C1552F" opacity={0.55} />
          <ellipse cx={72} cy={66} rx={12} ry={7} fill="#C1552F" opacity={0.5} />
          <circle cx={50} cy={50} r={48} fill="none" stroke="#1F2A24" strokeWidth={1.6} opacity={0.25} />
        </svg>
        <MagnetShieldAsset x={540} y={560} r={230} strength={1} />
      </div>
      <Chip f={f} at={22} x={540} y={120} text="ANDAIKAN PERISAI TAK PADAM" bg={AMBER} color={GREEN} size={32} />
      <Chip f={f} at={172} x={540} y={950} text="PLANET BIRU KEDUA?" bg={CREAM} color={GREEN} size={36} />
      {/* dua kartu debat */}
      <div style={{position: 'absolute', left: 60, top: 1120, width: 960, opacity: lin(f, 375, 390, 0, 1)}}>
        <div style={{background: CREAM, borderRadius: 28, padding: '26px 34px', transform: `scale(${card1})`,
          boxShadow: '0 10px 26px rgba(0,0,0,0.45)', marginBottom: 24}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 38, color: GREEN}}>HANGAT &amp; BASAH TERUS?</div>
          <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 28, color: SAGE, marginTop: 6}}>Mars purba seperti Bumi muda</div>
        </div>
        <div style={{background: '#DCE9E2', borderRadius: 28, padding: '26px 34px', transform: `scale(${card2})`,
          boxShadow: '0 10px 26px rgba(0,0,0,0.45)'}}>
          <div style={{fontFamily: 'Pop', fontWeight: 900, fontSize: 38, color: GREEN}}>DINGIN, BASAH SESEKALI?</div>
          <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 28, color: SAGE, marginTop: 6}}>Cuma masa-masa basah singkat</div>
        </div>
        <div style={{textAlign: 'center', fontFamily: 'Pop', fontWeight: 900, fontSize: 32, color: AMBER, marginTop: 26}}>
          MASIH DIPERDEBATKAN
        </div>
      </div>
      <div style={{opacity: lin(f, 400, 415, 0, 1)}}>
        <KejapAt x={-30} y={1680} w={220} mood="mikir" from={1904} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- SCENE 6: BOOKEND + sign-off + sumber ----------
// Narasi lokal (absStart 2483): S1 "Jadi Mars tidak mati cuma karena jauh
// dari Matahari — perisainya yang padam jadi pemicu utamanya." f 21-190
// -> S2 "Aku, Kejap — sampai jumpa di video berikutnya!" f 206-268.
// Bookend: "PERISAINYA YANG PADAM". Sumber fade-in di akhir adegan konten.
// Tanpa ombak (S6 pendek 281f; ombak akan menutupi sign-off — pelajaran Betelgeuse v2).
const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  const srcO = lin(f, 120, 135, 0, 1) * lin(f, 260, 275, 1, 0);
  return (
    <AbsoluteFill style={{background: SPACE1}}>
      <Starfield />
      <div style={{opacity: lin(f, 10, 25, 0, 1)}}>
        <PlanetMarsAsset x={540} y={620} r={240} />
      </div>
      <div style={{opacity: lin(f, 10, 25, 0, 1)}}>
        <MagnetShieldAsset x={540} y={620} r={240} strength={0.12} />
      </div>
      <Chip f={f} at={21} x={540} y={1060} text="PERISAINYA YANG PADAM" bg={AMBER} color={GREEN} size={36} />
      <Chip f={f} at={60} x={540} y={1160} text="PEMICU UTAMANYA" bg={CREAM} color={GREEN} size={36} />
      {/* baris sumber — resep Paus V6, fade-in di akhir adegan konten */}
      <div style={{position: 'absolute', left: 0, top: 1330, width: W, textAlign: 'center', fontFamily: 'Pop',
        fontWeight: 600, fontSize: 24, color: SAGE_L, opacity: srcO, lineHeight: 1.5}}>
        Sumber: NASA (MAVEN) · NASA/JPL (Curiosity, Perseverance) · ESA
      </div>
      <KejapAt x={320} y={1460} w={440} mood={f >= 206 ? 'senang' : 'default'} from={2483} />
    </AbsoluteFill>
  );
};

const SFX: {at: number; file: string; vol: number}[] = [
  {at: 10, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 108, file: 'sfx/pop.wav', vol: 0.95},
  {at: 311, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 389, file: 'sfx/pop.wav', vol: 0.95},
  {at: 459, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 652, file: 'sfx/pop.wav', vol: 0.95},
  {at: 843, file: 'sfx/pop.wav', vol: 0.95},
  {at: 943, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1143, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1382, file: 'sfx/pop.wav', vol: 0.95},
  {at: 1510, file: 'sfx/whoosh.wav', vol: 0.9},
  {at: 1750, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 1926, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2076, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2279, file: 'sfx/pop-big.wav', vol: 0.95},
  {at: 2504, file: 'sfx/pop.wav', vol: 0.95},
  {at: 2689, file: 'sfx/sting-kejap.wav', vol: 0.95},
  {at: 2760, file: 'sfx/whoosh.wav', vol: 0.9},
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
