// ============================================================
// @sekejap.tahu — Shared 2D Asset Library (v1.22, 2026-11-25 — SuperbBirdAsset display pose revised (paruh kuning + kaki + pita perisai datar, kurang creepy); v1.21, 2026-11-25 — + SuperbBirdAsset + FemaleBirdAsset + AstrapiaAsset + PlumeBirdAsset from Cendrawasih Papua; v1.20, 2026-11-23 — + RedSupergiantAsset + OrionAsset from Betelgeuse Meledak Besok; v1.19, 2026-11-21 — + RhinoAsset from Badak Jawa; v1.18, 2026-11-21 — + UranusAsset from Uranus Oposisi; v1.17, 2026-11-20 — + SnakeAsset (Titanoboa, glide + coil) from Titanoboa, Ular 13 Meter dari Rawa Purba; v1.16, 2026-11-18 — + Moon, Sun from WHAT IF Bulan Tidak Pernah Ada?; v1.15, 2026-11-18 — + Megalodon, Tooth from Megalodon, Hiu Terbesar yang Pernah Hidup; v1.14, 2026-11-14 — + Coelacanth (blue + brown variants) from Coelacanth, Fosil Hidup dari Manado; v1.13, 2026-11-14 — + Komodo, Deer (Rusa Timor) from Komodo, Naga yang Nyata; v1.12, 2026-11-12 — + Tiger, Hair, CameraTrap from WHAT IF Harimau Jawa; v1.11, 2026-11-11 — + Moa, HaastEagle, Claw from Elang Haast vs Moa; v1.10, 2026-11-10 — + Trex, EarthZones, ChicxulubMarker from WHAT IF Asteroid; v1.9, 2026-11-09 — + FalconFly, FalconStoop, FalconHead (membrane prop), Pigeon, Speedo from Alap-Alap Kawah; v1.8 — + IcyWorld, DwarfPlanet; v1.6, 2026-11-05 — MascotAsset talking mouth); v1.5, 2026-11-05 — + Mammoth, WoollyMouse from WHAT IF Mammoth; v1.4, 2026-11-04 — + Stork (Leptoptilos robustus), Stegodon, Hobbit scale silhouette from Flores Part 2; v1.3 added Megapode, FossilBone, Cave, Egg, Chick, Mound)
// Flat SVG/div illustration components, hand-coded, brand-palette friendly.
// USAGE: copy this file into a project's src/ and import what the video needs.
// Check here BEFORE drawing a new asset — extend this file when a new reusable
// asset is built, so the library grows with every video.
// Rules: subjects keep natural colours; no emoji-as-illustration; no AI raster
// images mixed in (style consistency). All animation is frame-driven.
// ============================================================
import React from 'react';
import {interpolate, Easing, random} from 'remotion';

const clampO = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const lin = (frame: number, a: number, b: number, from = 0, to = 1, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, b], [from, to], {...clampO, easing});

export const RUST = '#C1552F', RUSTL = '#E07B4C', RUSTD = '#8A3B22', ICE = '#F7FAF7';
export const GREEN = '#1F2A24', AMBER_D = '#DE920C', SAGE_D = '#4E6B5B';

// ---------- Blue whale (from Paus Galápagos, 2026-11-03) ----------
const WHALE_BODY = 'M28,196 C24,168 44,140 92,124 C190,92 330,74 470,78 C610,82 730,102 806,84 C830,78 848,60 862,44 C868,36 880,40 878,52 C876,76 868,102 852,122 C872,150 880,182 872,214 C868,230 856,228 848,210 C842,196 838,178 830,164 C740,206 620,232 480,238 C320,244 170,232 96,216 C58,208 30,208 28,196 Z';
const WHALE_FIN = 'M330,230 C348,262 366,288 394,302 C404,307 412,299 407,288 C394,260 376,238 354,222 Z';
export const WhaleAsset: React.FC<{x: number; y: number; w: number; dashed?: boolean; body?: string; fin?: string; opacity?: number}> =
({x, y, w, dashed = false, body = '#51748C', fin = '#3E5A70', opacity = 1}) => (
  <svg width={w} height={w * 340 / 920} viewBox="0 0 920 340" style={{position: 'absolute', left: x, top: y, opacity}}>
    <path d={WHALE_BODY} fill={dashed ? 'rgba(78,107,91,.10)' : body} stroke={dashed ? SAGE_D : 'none'} strokeWidth={dashed ? 5 : 0} strokeDasharray={dashed ? '16 12' : undefined} />
    {!dashed && <path d={WHALE_FIN} fill={fin} />}
    {!dashed && <circle cx={98} cy={178} r={7} fill="#16221C" />}
    {!dashed && <path d="M38,206 C90,224 160,234 226,236" stroke="#33505F" strokeWidth={5} fill="none" strokeLinecap="round" />}
  </svg>
);

// ---------- Mars disc (from Mars AMEC, 2026-11-02) ----------
export const PlanetMarsAsset: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <svg width={2 * r} height={2 * r} viewBox="0 0 100 100" style={{position: 'absolute', left: x - r, top: y - r}}>
    <circle cx={50} cy={50} r={48} fill={RUST} />
    <ellipse cx={35} cy={62} rx={25} ry={14} fill={RUSTD} opacity={0.55} />
    <ellipse cx={70} cy={35} rx={16} ry={10} fill={RUSTD} opacity={0.4} />
    <ellipse cx={55} cy={76} rx={19} ry={9} fill={RUSTL} opacity={0.5} />
    <ellipse cx={50} cy={8} rx={16} ry={6} fill={ICE} opacity={0.9} />
    <circle cx={50} cy={50} r={48} fill="none" stroke="#1F2A24" strokeWidth={1.6} opacity={0.25} />
  </svg>
);

// ---------- Elongated ice cloud streak (from Mars AMEC) ----------
// prog 0..1 grows the cloud head-to-tail; fade multiplies opacity.
export const CloudStreakAsset: React.FC<{x: number; y: number; len: number; prog: number; fade?: number; tint?: string}> =
({x, y, len, prog, fade = 1, tint = ICE}) => {
  const segs = 7, Hh = 150;
  return (
    <svg width={len + 140} height={Hh} viewBox={`0 0 ${len + 140} ${Hh}`} style={{position: 'absolute', left: x - 70, top: y - Hh / 2, opacity: fade}}>
      {Array.from({length: segs}).map((_, i) => {
        const t0 = i / segs;
        if (prog <= t0) return null;
        const segP = Math.min(1, (prog - t0) * segs);
        const cx = 70 + (i + 0.5) * (len / segs);
        const ry = 30 * (1 - t0 * 0.62) * (i === 0 ? 1.25 : 1);
        const rx = (len / segs) * 1.02 * segP + 8;
        return (
          <g key={i}>
            <ellipse cx={cx} cy={Hh / 2} rx={rx * 1.25} ry={ry * 1.5} fill={tint} opacity={0.16} />
            <ellipse cx={cx} cy={Hh / 2} rx={rx} ry={ry} fill={tint} opacity={i === 0 ? 0.98 : 0.9 - t0 * 0.35} />
          </g>
        );
      })}
    </svg>
  );
};

// ---------- Volcano cone (from Mars AMEC) ----------
export const VolcanoAsset: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
  <svg width={w} height={h} viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', left: x - w / 2, top: y - h}}>
    <path d="M2 100 L38 4 L62 4 L98 100 Z" fill={RUSTD} />
    <path d="M38 4 L62 4 L57 20 L43 20 Z" fill={RUSTL} opacity={0.85} />
  </svg>
);

// ---------- Meteor streak (from Taurid, 2026-11-03) ----------
// Travels down-left by default (angle 152) so it crosses INTO the frame.
export const MeteorAsset: React.FC<{frame: number; start: number; dur: number; x: number; y: number; len: number; travel: number; angle?: number; big?: boolean}> =
({frame, start, dur, x, y, len, travel, angle = 152, big = false}) => {
  const p = lin(frame, start, start + dur, 0, 1, Easing.out(Easing.quad));
  if (p <= 0 || p >= 1) return null;
  const fade = Math.sin(p * Math.PI);
  const head = big ? 40 : 16, trailH = big ? 14 : 6;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: travel + len, height: 0, transform: `rotate(${angle}deg)`, transformOrigin: '0 0', opacity: fade}}>
      <div style={{transform: `translateX(${p * travel}px)`, position: 'relative', width: len, height: trailH}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 999, background: `linear-gradient(90deg, rgba(31,42,36,0), ${big ? 'rgba(222,146,12,.85)' : 'rgba(31,42,36,.55)'})`}} />
        <div style={{position: 'absolute', right: -head / 2, top: '50%', transform: 'translateY(-50%)', width: head, height: head, borderRadius: '50%', background: big ? '#E79A12' : '#FFF6DE', boxShadow: big ? '0 0 90px 34px rgba(222,146,12,.5)' : '0 0 22px 7px rgba(222,146,12,.45)'}} />
      </div>
    </div>
  );
};

// ---------- Comet with dust tail (from Taurid) ----------
export const CometAsset: React.FC<{frame: number; x: number; y: number; s?: number}> = ({frame, x, y, s = 1}) => {
  const bob = Math.sin(frame / 22) * 10;
  return (
    <div style={{position: 'absolute', left: x, top: y + bob, transform: `scale(${s})`, transformOrigin: '0 0'}}>
      <div style={{position: 'absolute', left: 60, top: -34, width: 430, height: 92, borderRadius: '50%', background: 'linear-gradient(90deg, rgba(78,107,91,.40), rgba(78,107,91,0))', transform: 'rotate(-14deg)', filter: 'blur(7px)'}} />
      <div style={{position: 'absolute', left: 60, top: -14, width: 300, height: 46, borderRadius: '50%', background: 'linear-gradient(90deg, rgba(222,146,12,.35), rgba(222,146,12,0))', transform: 'rotate(-10deg)', filter: 'blur(5px)'}} />
      <div style={{width: 96, height: 96, borderRadius: '50%', background: 'radial-gradient(circle at 34% 32%, #FFFFFF, #D9D2BE 55%, #9DB4A6)', boxShadow: '0 0 50px 12px rgba(78,107,91,.30)'}} />
    </div>
  );
};

// ---------- Sonar/search rings (from Paus Galápagos) ----------
export const SonarRingsAsset: React.FC<{frame: number; cx: number; cy: number; maxR?: number; color?: string}> =
({frame, cx, cy, maxR = 330, color = SAGE_D}) => (
  <>
    {[0, 1, 2].map((i) => {
      const p = ((frame / 50) + i / 3) % 1;
      const r = 40 + p * maxR;
      return <div key={i} style={{position: 'absolute', left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: '50%', border: `3px solid ${color}`, opacity: (1 - p) * 0.55}} />;
    })}
  </>
);

// ---------- Krill / particle field (from Paus Galápagos) ----------
export const KrillFieldAsset: React.FC<{frame: number; x: number; y: number; w: number; h: number; count?: number; color?: string; seed?: string}> =
({frame, x, y, w, h, count = 16, color = AMBER_D, seed = 'kr'}) => (
  <>
    {Array.from({length: count}).map((_, i) => {
      const kx = x + random(seed + 'x' + i) * w;
      const ky = y + random(seed + 'y' + i) * h + Math.sin(frame / 14 + i) * 5;
      return <div key={i} style={{position: 'absolute', left: kx, top: ky, width: 13, height: 13, borderRadius: '50%', background: color, opacity: 0.9}} />;
    })}
  </>
);

// ---------- Icons (from Taurid guide cards + new) ----------
const ic = (children: React.ReactNode, size = 58) => (
  <svg width={size} height={size} viewBox="0 0 58 58">{children}</svg>
);
export const IconMoon: React.FC<{size?: number}> = ({size = 58}) => ic(<path d="M38 6 A24 24 0 1 0 52 34 A19 19 0 0 1 38 6Z" fill={AMBER_D} />, size);
export const IconEye: React.FC<{size?: number}> = ({size = 58}) => (
  <svg width={size} height={size} viewBox="0 0 64 58"><path d="M4 29 Q32 2 60 29 Q32 56 4 29Z" fill="none" stroke={GREEN} strokeWidth={4} /><circle cx={32} cy={29} r={10} fill={AMBER_D} /></svg>
);
export const IconHills: React.FC<{size?: number}> = ({size = 58}) => (
  <svg width={size} height={size} viewBox="0 0 62 58"><path d="M2 50 L20 26 L32 40 L42 24 L60 50 Z" fill={SAGE_D} /><circle cx={48} cy={12} r={4} fill={GREEN} /><circle cx={14} cy={10} r={3} fill={GREEN} /></svg>
);
export const IconCalendar: React.FC<{size?: number}> = ({size = 58}) => (
  <svg width={size} height={size} viewBox="0 0 58 58"><rect x={6} y={10} width={46} height={42} rx={7} fill="none" stroke={GREEN} strokeWidth={4} /><line x1={6} y1={22} x2={52} y2={22} stroke={GREEN} strokeWidth={4} /><circle cx={20} cy={33} r={3.4} fill={AMBER_D} /><circle cx={32} cy={33} r={3.4} fill={AMBER_D} /><circle cx={20} cy={44} r={3.4} fill={SAGE_D} /><circle cx={32} cy={44} r={3.4} fill={SAGE_D} /><circle cx={44} cy={33} r={3.4} fill={SAGE_D} /></svg>
);
export const IconTelescope: React.FC<{size?: number}> = ({size = 58}) => (
  <svg width={size} height={size} viewBox="0 0 58 58"><g transform="rotate(-24 29 24)"><rect x={10} y={17} width={34} height={13} rx={6} fill={GREEN} /><rect x={42} y={20} width={8} height={7} rx={3} fill={AMBER_D} /></g><path d="M27 32 L18 52 M31 32 L40 52 M29 40 L29 52" stroke={GREEN} strokeWidth={4} strokeLinecap="round" /></svg>
);
export const IconThermometer: React.FC<{size?: number; fill?: number}> = ({size = 58, fill = 0.7}) => (
  <svg width={size} height={size} viewBox="0 0 58 58"><rect x={24} y={5} width={10} height={34} rx={5} fill="none" stroke={GREEN} strokeWidth={4} /><rect x={27} y={5 + 34 * (1 - fill)} width={4} height={34 * fill + 8} rx={2} fill={RUST} /><circle cx={29} cy={45} r={9} fill={RUST} /></svg>
);

// ---------- Mascot "KEJAP": floating bubble explainer (user design + name, LOCKED 2026-11-04) ----------
// Ported 1:1 from maskot-trial/maskot-gelembung-flat-v2.svg — do NOT redraw or restyle:
// no blush (deliberate, keeps him adult), smaller eyes, raised right brow, smirk, PANTO glasses.
// Frame-driven life: float bob + slight sway, blink every 115f, gentle arm sway,
// dangling foot lags the bob, ground shadow breathes opposite the bob.
// `shadow` defaults true; set false when he floats over busy scenes.
export type MascotMood = 'default' | 'takjub' | 'mikir' | 'skeptis' | 'senang';
export const MascotAsset: React.FC<{frame: number; x: number; y: number; w: number; shadow?: boolean; mood?: MascotMood; talk?: boolean}> =
({frame, x, y, w, shadow = true, mood = 'default', talk = false}) => {
  const bobN = Math.sin(frame / 26);
  const bob = bobN * w * 0.016;
  const sway = Math.sin(frame / 44) * 1.6;
  const blinkCycle = frame % 115;
  const eyeScale = blinkCycle >= 107 ? Math.max(0.08, Math.abs(Math.cos(((blinkCycle - 107) / 8) * Math.PI))) : 1;
  const armL = -18 + Math.sin(frame / 22 + 1) * 4;
  const armR = 28 + Math.sin(frame / 18) * 6;
  const footRot = 16 + Math.sin(frame / 26 - 0.9) * 5;
  const outline = {stroke: GREEN, strokeOpacity: 0.16, strokeWidth: 5} as const;
  // Expression variants (2026-11-04): face only — body, glasses frame and float stay identical.
  // default = locked smirk/raised brow · takjub = hook/reveal · mikir = data moment ·
  // skeptis = myth/claim check · senang = payoff/punchline (happy closed-arc eyes, no blink).
  const MOODS = {
    default: {browL: 'M398 328 Q430 317 462 326', browR: 'M580 320 Q612 303 646 313', dx: 0, dy: 0, rx: 20, ry: 29, lid: 0.65, hl: 5},
    takjub: {browL: 'M396 306 Q430 292 464 304', browR: 'M578 298 Q612 284 648 296', dx: 0, dy: -2, rx: 23, ry: 38, lid: 0, hl: 7},
    mikir: {browL: 'M398 312 Q430 298 462 310', browR: 'M580 332 Q612 326 646 320', dx: 10, dy: -8, rx: 18, ry: 26, lid: 0.65, hl: 5},
    skeptis: {browL: 'M398 330 Q430 340 462 344', browR: 'M578 344 Q610 340 644 330', dx: 0, dy: 2, rx: 20, ry: 15, lid: 1, hl: 4},
    senang: {browL: 'M398 316 Q430 304 462 314', browR: 'M578 310 Q612 298 648 308', dx: 0, dy: 0, rx: 20, ry: 29, lid: 0, hl: 0},
  } as const;
  const M = MOODS[mood];
  // Talking mouth (user idea, demo-judged + LOCKED 2026-11-05, variant A): when the
  // parent passes talk=true (VO activity, from the audio's speech segments — NOT
  // per-word lip-sync), the mouth flaps at an irregular ~2.4 Hz with a small flat
  // opening (rx 17, ry up to ~13.5 in viewBox units). At rest it is the mood mouth.
  const tSec = frame / 30;
  const flapRaw = Math.pow(Math.abs(Math.sin(tSec * Math.PI * 2 * 1.2 + Math.sin(tSec * 3.1) * 0.7)), 0.75);
  const mouthOpen = talk && flapRaw > 0.18;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: w}}>
      {shadow && (
        <div style={{position: 'absolute', left: '27%', top: '88.5%', width: '47%', height: '5.2%', borderRadius: '50%', background: SAGE_D, opacity: 0.18 - bobN * 0.04, transform: `scaleX(${1 - bobN * 0.05})`}} />
      )}
      <svg width={w} height={w} viewBox="0 0 1000 1000" style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${bob}px) rotate(${sway}deg)`, transformOrigin: '50% 50%'}}>
        <defs>
          <clipPath id="mascotBodyClip"><ellipse cx={520} cy={460} rx={282} ry={292} /></clipPath>
        </defs>
        <g {...outline}>
          <g transform={`rotate(${armL} 205 530)`}>
            <ellipse cx={205} cy={530} rx={108} ry={60} fill="#FFDA7F" />
            <ellipse cx={168} cy={505} rx={42} ry={16} fill="#FFF6DE" stroke="none" opacity={0.9} />
          </g>
          <g transform={`rotate(${armR} 838 430)`}>
            <ellipse cx={838} cy={430} rx={62} ry={108} fill="#FFDA7F" />
            <ellipse cx={820} cy={378} rx={16} ry={40} fill="#FFF6DE" stroke="none" opacity={0.9} />
          </g>
        </g>
        <ellipse cx={520} cy={460} rx={282} ry={292} fill="#F7C65D" {...outline} />
        <g clipPath="url(#mascotBodyClip)">
          <ellipse cx={745} cy={580} rx={150} ry={250} fill="#EFB14E" opacity={0.38} />
          <ellipse cx={398} cy={282} rx={62} ry={34} fill="#FFF6DE" opacity={0.9} transform="rotate(-24 398 282)" />
          <circle cx={668} cy={648} r={9} fill="#FFF6DE" opacity={0.85} />
          <path d="M700 596 L706 614 L724 620 L706 626 L700 644 L694 626 L676 620 L694 614 Z" fill="#FFF6DE" opacity={0.9} />
        </g>
        <g {...outline}>
          <circle cx={322} cy={698} r={90} fill="#FFDA7F" />
          <ellipse cx={290} cy={655} rx={30} ry={20} fill="#FFF6DE" stroke="none" opacity={0.9} transform="rotate(-24 290 655)" />
          <g transform={`rotate(${footRot} 568 832)`}>
            <ellipse cx={568} cy={832} rx={56} ry={96} fill="#FFDA7F" />
            <ellipse cx={548} cy={782} rx={14} ry={30} fill="#FFF6DE" stroke="none" opacity={0.9} />
          </g>
        </g>
        <path d={M.browL} fill="none" stroke={GREEN} strokeWidth={10} strokeLinecap="round" />
        <path d={M.browR} fill="none" stroke={GREEN} strokeWidth={10} strokeLinecap="round" />
        <g fill="none" stroke={GREEN} strokeWidth={11} strokeLinejoin="round">
          <path d="M380 350 H480 Q500 350 500 380 V402 C500 442 470 466 430 466 C390 466 360 442 360 402 V380 Q360 350 380 350 Z" />
          <path d="M560 350 H660 Q680 350 680 380 V402 C680 442 650 466 610 466 C570 466 540 442 540 402 V380 Q540 350 560 350 Z" />
          <path d="M500 378 Q520 366 540 378" />
          <path d="M360 376 L272 364" />
          <path d="M680 376 L768 364" />
        </g>
        {mood === 'senang' ? (
          <>
            <path d="M407 416 Q430 395 453 416" fill="none" stroke={GREEN} strokeWidth={9} strokeLinecap="round" />
            <path d="M587 416 Q610 395 633 416" fill="none" stroke={GREEN} strokeWidth={9} strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={430 + M.dx} cy={414 + M.dy} rx={M.rx} ry={M.ry * eyeScale} fill={GREEN} />
            <ellipse cx={610 + M.dx} cy={414 + M.dy} rx={M.rx} ry={M.ry * eyeScale} fill={GREEN} />
            <circle cx={423 + M.dx} cy={404 + M.dy} r={M.hl} fill="#FFF6DE" opacity={eyeScale} />
            <circle cx={603 + M.dx} cy={404 + M.dy} r={M.hl} fill="#FFF6DE" opacity={eyeScale} />
            {M.lid > 0 && (
              <>
                <path d={`M${411 + M.dx} ${393 + M.dy} Q${430 + M.dx} ${384 + M.dy} ${449 + M.dx} ${393 + M.dy}`} fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" opacity={M.lid} />
                <path d={`M${591 + M.dx} ${393 + M.dy} Q${610 + M.dx} ${384 + M.dy} ${629 + M.dx} ${393 + M.dy}`} fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" opacity={M.lid} />
              </>
            )}
          </>
        )}
        {mood !== 'takjub' && mood !== 'senang' && (mouthOpen ? (
          <ellipse cx={526} cy={506} rx={17} ry={2.5 + flapRaw * 11} fill={GREEN} />
        ) : (
          <>
            {mood === 'default' && <path d="M494 500 Q524 515 558 494" fill="none" stroke={GREEN} strokeWidth={8} strokeLinecap="round" />}
            {mood === 'mikir' && <path d="M498 506 L546 498" fill="none" stroke={GREEN} strokeWidth={8} strokeLinecap="round" />}
            {mood === 'skeptis' && <path d="M498 505 Q511 498 524 505 Q537 512 550 505" fill="none" stroke={GREEN} strokeWidth={7} strokeLinecap="round" />}
          </>
        ))}
        {mood === 'takjub' && <ellipse cx={526} cy={508} rx={16} ry={talk ? 21 * (0.75 + 0.35 * flapRaw) : 21} fill={GREEN} />}
        {mood === 'senang' && <path d="M490 488 Q526 534 562 488 Z" fill={GREEN} transform={talk ? `translate(526 488) scale(1 ${0.9 + 0.25 * flapRaw}) translate(-526 -488)` : undefined} />}
      </svg>
    </div>
  );
};

// His name is Kejap (locked 2026-11-04) — same component, friendlier call site.
export const KejapAsset = MascotAsset;

// ---------- Megapode / scrubfowl (from Flores Megapodius rokusi, 2026-11-04) ----------
// Chunky ground bird, small head, strong legs, BIG feet (megapode = "big foot").
// Living orange-footed scrubfowl: body #4A4A48, wing #383836, leg #E07B24.
// Extinct rokusi reconstruction: body #6B5138, wing #543E2A, leg #C9862B. dashed = fossil-outline build.
export const MegapodeAsset: React.FC<{x: number; y: number; w: number; body?: string; wing?: string; leg?: string; dashed?: boolean; flip?: boolean; opacity?: number}> =
({x, y, w, body = '#6B5138', wing = '#543E2A', leg = '#C9862B', dashed = false, flip = false, opacity = 1}) => (
  <svg width={w} height={w * 320 / 440} viewBox="0 0 440 320" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M318 128 L428 52 L434 92 L352 148 Z" fill={dashed ? 'rgba(78,107,91,.10)' : wing} stroke={dashed ? SAGE_D : 'none'} strokeWidth={dashed ? 5 : 0} strokeDasharray={dashed ? '14 10' : undefined} />
    <path d="M306 148 L402 92 L414 124 L338 172 Z" fill={dashed ? 'rgba(78,107,91,.10)' : wing} opacity={0.75} stroke={dashed ? SAGE_D : 'none'} strokeWidth={dashed ? 5 : 0} strokeDasharray={dashed ? '14 10' : undefined} />
    <path d="M70 152 C70 96 142 58 226 60 C316 62 376 104 373 160 C370 216 300 250 214 250 C134 250 70 208 70 152 Z" fill={dashed ? 'rgba(78,107,91,.10)' : body} stroke={dashed ? SAGE_D : 'none'} strokeWidth={dashed ? 5 : 0} strokeDasharray={dashed ? '14 10' : undefined} />
    {!dashed && <path d="M128 118 C190 92 302 98 344 140 C302 192 198 208 138 180 C114 158 110 138 128 118 Z" fill={wing} />}
    {!dashed && <circle cx={80} cy={104} r={35} fill={body} />}
    {!dashed && <path d="M50 98 L12 111 L52 124 Z" fill={AMBER_D} />}
    {!dashed && <circle cx={72} cy={97} r={5.5} fill="#16221C" />}
    {!dashed && <g stroke={leg} strokeWidth={13} strokeLinecap="round"><line x1={176} y1={238} x2={176} y2={290} /><line x1={262} y1={238} x2={262} y2={290} /></g>}
    {!dashed && <g stroke={leg} strokeWidth={10} strokeLinecap="round" fill="none"><path d="M176 292 L138 302 M176 292 L178 306 M176 292 L216 300" /><path d="M262 292 L224 302 M262 292 L264 306 M262 292 L302 300" /></g>}
    {dashed && <g stroke={SAGE_D} strokeWidth={6} strokeLinecap="round" opacity={0.8}><line x1={176} y1={244} x2={176} y2={290} /><line x1={262} y1={244} x2={262} y2={290} /></g>}
  </svg>
);

// ---------- Fossil leg bone / tarsometatarsus (from Flores, 2026-11-04) ----------
export const FossilBoneAsset: React.FC<{x: number; y: number; w: number; rot?: number; opacity?: number}> =
({x, y, w, rot = 0, opacity = 1}) => (
  <svg width={w} height={w * 2.2} viewBox="0 0 200 440" style={{position: 'absolute', left: x, top: y, opacity, transform: `rotate(${rot}deg)`, transformOrigin: '50% 50%'}}>
    <path d="M70 22 C55 22 47 36 50 50 C52 62 61 68 70 72 L76 150 L78 328 C78 343 68 351 59 361 C48 373 51 392 63 398 C74 403 84 395 88 385 L93 370 L101 392 C105 403 120 403 126 392 L132 370 C138 384 151 386 159 377 C169 367 164 351 154 345 C145 340 141 331 142 318 L146 150 L150 73 C160 67 168 58 169 46 C170 31 159 20 145 20 C132 20 124 29 120 40 C115 27 96 19 83 21 C79 21 74 22 70 22 Z" fill="#DCC49C" stroke="#B89B62" strokeWidth={4} strokeLinejoin="round" />
    <path d="M92 118 L106 168 L95 224 M112 250 L100 306" stroke="#B89B62" strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.75} />
    <circle cx={88} cy={150} r={5} fill="#C4A877" /><circle cx={118} cy={205} r={4} fill="#C4A877" /><circle cx={96} cy={272} r={4.5} fill="#C4A877" /><circle cx={122} cy={96} r={3.5} fill="#C4A877" />
  </svg>
);

// ---------- Liang Bua cave cliff (from Flores, 2026-11-04) ----------
export const CaveAsset: React.FC<{x: number; y: number; w: number; opacity?: number}> = ({x, y, w, opacity = 1}) => (
  <svg width={w} height={w * 560 / 840} viewBox="0 0 840 560" style={{position: 'absolute', left: x, top: y, opacity}}>
    <path d="M60 560 L60 300 C60 168 152 58 322 34 C520 6 702 60 772 172 C802 232 792 340 790 560 Z" fill="#B49B78" />
    <path d="M60 240 C240 190 560 180 790 250" stroke="#9A7F5C" strokeWidth={7} fill="none" opacity={0.45} />
    <path d="M60 380 C260 330 540 326 790 392" stroke="#9A7F5C" strokeWidth={7} fill="none" opacity={0.35} />
    <ellipse cx={180} cy={120} rx={90} ry={42} fill="#C4AC86" opacity={0.6} />
    <path d="M298 560 L298 402 C298 320 358 266 420 266 C482 266 542 320 542 402 L542 560 Z" fill="#241B12" />
    <path d="M330 560 L330 420 C330 352 372 306 420 306 C468 306 510 352 510 420 L510 560 Z" fill="#171008" opacity={0.65} />
    <ellipse cx={140} cy={548} rx={86} ry={20} fill="#9A7F5C" /><ellipse cx={706} cy={550} rx={100} ry={22} fill="#9A7F5C" />
  </svg>
);

// ---------- Egg + chick (from Flores, 2026-11-04) ----------
export const EggAsset: React.FC<{x: number; y: number; w: number; crack?: boolean; opacity?: number}> = ({x, y, w, crack = false, opacity = 1}) => (
  <svg width={w} height={w * 1.25} viewBox="0 0 120 150" style={{position: 'absolute', left: x, top: y, opacity}}>
    <path d="M60 8 C88 8 108 52 108 88 C108 122 86 142 60 142 C34 142 12 122 12 88 C12 52 32 8 60 8 Z" fill="#FFF3D6" stroke="#D9BE8C" strokeWidth={4} />
    <circle cx={42} cy={70} r={4} fill="#D9BE8C" /><circle cx={74} cy={96} r={5} fill="#D9BE8C" /><circle cx={62} cy={44} r={3.4} fill="#D9BE8C" />
    {crack && <path d="M18 74 L38 84 L52 70 L68 86 L84 72 L102 82" stroke="#8A6B3A" strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);
export const ChickAsset: React.FC<{x: number; y: number; w: number; opacity?: number}> = ({x, y, w, opacity = 1}) => (
  <svg width={w} height={w * 0.85} viewBox="0 0 200 170" style={{position: 'absolute', left: x, top: y, opacity}}>
    <path d="M140 108 L188 82 L192 104 L148 124 Z" fill="#B57A38" />
    <ellipse cx={104} cy={106} rx={64} ry={48} fill="#C98F4E" />
    <ellipse cx={118} cy={112} rx={38} ry={26} fill="#B57A38" opacity={0.8} />
    <circle cx={52} cy={60} r={31} fill="#D9A45C" />
    <path d="M24 54 L0 64 L26 74 Z" fill={AMBER_D} />
    <circle cx={46} cy={53} r={5} fill="#16221C" />
    <g stroke="#8A5F38" strokeWidth={7} strokeLinecap="round"><line x1={86} y1={148} x2={86} y2={164} /><line x1={124} y1={148} x2={124} y2={164} /></g>
  </svg>
);

// ---------- Incubation mound (from Flores, 2026-11-04) ----------
export const MoundAsset: React.FC<{x: number; y: number; w: number; opacity?: number}> = ({x, y, w, opacity = 1}) => (
  <svg width={w} height={w * 240 / 520} viewBox="0 0 520 240" style={{position: 'absolute', left: x, top: y, opacity}}>
    <path d="M14 240 C34 118 156 28 260 28 C364 28 486 118 506 240 Z" fill="#A97C50" />
    <path d="M76 240 C92 158 182 82 260 82 C338 82 428 158 444 240" fill="none" stroke="#8A5F38" strokeWidth={6} opacity={0.55} />
    <path d="M140 240 C152 182 208 132 260 132 C312 132 368 182 380 240" fill="none" stroke="#8A5F38" strokeWidth={6} opacity={0.45} />
    <ellipse cx={212} cy={66} rx={90} ry={22} fill="#C09A68" opacity={0.55} />
    <circle cx={150} cy={170} r={7} fill="#8A5F38" opacity={0.6} /><circle cx={352} cy={196} r={8} fill="#8A5F38" opacity={0.6} /><circle cx={268} cy={104} r={6} fill="#8A5F38" opacity={0.5} />
  </svg>
);

// ---------- Giant marabou stork / Leptoptilos robustus (from Flores Part 2, 2026-11-04) ----------
// Tall bald-headed stork: white body, dark slate wing, long dagger beak, pinkish bare skin.
// wingUp 0..1 rotates the wing up (flight/wingspan beat). Deliberately gangly proportions.
export const StorkAsset: React.FC<{x: number; y: number; w: number; wingUp?: number; flip?: boolean; opacity?: number}> =
({x, y, w, wingUp = 0, flip = false, opacity = 1}) => (
  <svg width={w} height={w * 560 / 400} viewBox="0 0 400 560" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <g stroke="#7A6A5E" strokeWidth={11} strokeLinecap="round"><line x1={196} y1={330} x2={188} y2={520} /><line x1={238} y1={330} x2={248} y2={520} /></g>
    <g stroke="#7A6A5E" strokeWidth={9} strokeLinecap="round" fill="none"><path d="M188 522 L158 534 M188 522 L192 538 M188 522 L218 532" /><path d="M248 522 L218 534 M248 522 L252 538 M248 522 L278 532" /></g>
    <path d="M268 268 C320 250 356 262 372 292 C356 306 316 312 282 306 Z" fill="#39424E" />
    <path d="M96 268 C110 214 176 184 242 190 C308 196 340 240 330 292 C320 342 262 368 196 362 C138 356 84 322 96 268 Z" fill="#EFE9DC" />
    <g style={{transform: `rotate(${-64 * wingUp}deg)`, transformOrigin: '150px 235px'}}>
      <path d="M118 268 C108 200 168 168 226 176 C262 182 282 202 284 230 C250 262 176 282 118 268 Z" fill="#39424E" />
      <path d="M140 250 C170 214 224 198 258 210" stroke="#4A5462" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
    <path d="M118 232 C96 190 92 150 108 112" stroke="#D29E8C" strokeWidth={21} fill="none" strokeLinecap="round" />
    <ellipse cx={112} cy={92} rx={27} ry={31} fill="#D29E8C" />
    <path d="M96 108 C84 128 86 146 96 156 C104 138 104 122 96 108 Z" fill="#C98A76" />
    <path d="M92 78 L6 118 L88 106 Z" fill="#D8C49A" stroke="#B49B62" strokeWidth={3} strokeLinejoin="round" />
    <circle cx={106} cy={84} r={5.5} fill="#16221C" />
  </svg>
);

// ---------- Dwarf stegodon / Stegodon florensis (from Flores Part 2, 2026-11-04) ----------
// Insular dwarf elephant: grey body, long near-straight tusks, trunk down. ghost = faded prey beat.
export const StegodonAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; ghost?: boolean}> =
({x, y, w, flip = false, opacity = 1, ghost = false}) => (
  <svg width={w} height={w * 340 / 480} viewBox="0 0 480 340" style={{position: 'absolute', left: x, top: y, opacity: opacity * (ghost ? 0.55 : 1), transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M398 168 C420 196 424 232 414 262" stroke="#83848B" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M414 262 l-7 22 M414 262 l8 20" stroke="#5E5F66" strokeWidth={7} strokeLinecap="round" />
    <g fill="#83848B"><rect x={158} y={216} width={42} height={104} rx={14} /><rect x={196} y={216} width={42} height={104} rx={14} /><rect x={318} y={216} width={42} height={104} rx={14} /><rect x={356} y={216} width={42} height={104} rx={14} /></g>
    <path d="M120 150 C120 84 196 44 282 48 C368 52 424 100 420 168 C416 232 356 262 268 262 C184 262 120 220 120 150 Z" fill="#8F9096" />
    <path d="M132 96 C180 58 300 50 366 84 C312 104 196 110 132 96 Z" fill="#9C9DA2" opacity={0.7} />
    <circle cx={128} cy={138} r={62} fill="#8F9096" />
    <ellipse cx={152} cy={128} rx={30} ry={40} fill="#7B7C82" transform="rotate(14 152 128)" />
    <path d="M92 168 C74 210 76 258 92 292 C100 308 118 306 122 290 C126 268 118 240 118 214 C118 190 106 168 92 168 Z" fill="#83848B" />
    <path d="M104 196 L196 246" stroke="#EDE4CC" strokeWidth={13} strokeLinecap="round" />
    <path d="M112 214 L188 268" stroke="#E3D7B8" strokeWidth={10} strokeLinecap="round" />
    <circle cx={112} cy={122} r={6.5} fill="#16221C" />
  </svg>
);

// ---------- Hobbit scale figure / Homo floresiensis silhouette (from Flores Part 2, 2026-11-04) ----------
// Plain scale silhouette only (±106 cm) for height comparisons — not a character.
export const HobbitAsset: React.FC<{x: number; y: number; h: number; color?: string; opacity?: number}> =
({x, y, h, color = '#4E6B5B', opacity = 1}) => (
  <svg width={h * 0.5} height={h} viewBox="0 0 200 400" style={{position: 'absolute', left: x, top: y, opacity}}>
    <circle cx={100} cy={52} r={40} fill={color} />
    <path d="M60 44 C60 8 140 8 140 44 C140 30 128 22 100 22 C72 22 60 30 60 44 Z" fill={color} opacity={0.85} />
    <path d="M100 88 C74 88 62 108 62 148 L62 236 C62 252 74 258 84 258 L86 372 C86 388 106 388 107 372 L100 268 L94 372 C95 388 115 388 116 372 L118 258 C128 258 138 252 138 236 L138 148 C138 108 126 88 100 88 Z" fill={color} />
    <path d="M64 130 C44 168 38 214 44 252 C46 264 60 262 62 250 C66 216 68 176 76 146 Z" fill={color} />
    <path d="M136 130 C156 168 162 214 156 252 C154 264 140 262 138 250 C134 216 132 176 124 146 Z" fill={color} />
  </svg>
);

// ---------- Woolly mammoth / Mammuthus primigenius (from WHAT IF Mammoth, 2026-11-05) ----------
// Shaggy brown giant: high shoulder hump + domed skull, small ears, long curved ivory tusks,
// fur skirt with scalloped hem hiding most of the legs. Flat look per library rules.
export const MammothAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number}> =
({x, y, w, flip = false, opacity = 1}) => (
  <svg width={w} height={w * 380 / 520} viewBox="0 0 520 380" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M462 128 C486 150 492 176 486 202" stroke="#5E3D22" strokeWidth={11} fill="none" strokeLinecap="round" />
    <circle cx={487} cy={208} r={13} fill="#5E3D22" />
    <g fill="#4E3319"><rect x={168} y={238} width={40} height={104} rx={15} /><rect x={216} y={238} width={40} height={104} rx={15} /><rect x={392} y={238} width={40} height={104} rx={15} /><rect x={434} y={238} width={40} height={104} rx={15} /></g>
    <path d="M120 150 C110 90 170 52 250 50 C340 48 430 70 465 120 C490 155 488 205 470 240 L460 268 Q452 286 438 256 L424 252 Q418 272 404 256 L392 254 Q384 272 370 256 L356 252 Q350 272 336 256 L318 254 Q310 272 296 256 L282 252 Q276 272 262 256 L242 254 Q234 272 220 256 L204 250 Q198 270 184 254 L168 250 Q160 266 148 246 L140 244 C118 220 112 185 120 150 Z" fill="#7A5230" />
    <path d="M150 236 Q300 262 462 236 L460 268 Q452 286 438 256 L424 252 Q418 272 404 256 L392 254 Q384 272 370 256 L356 252 Q350 272 336 256 L318 254 Q310 272 296 256 L282 252 Q276 272 262 256 L242 254 Q234 272 220 256 L204 250 Q198 270 184 254 L168 250 Q160 266 148 246 Z" fill="#5E3D22" opacity={0.45} />
    <g stroke="#96683C" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.55}>
      <path d="M196 92 Q260 74 330 84" /><path d="M180 128 Q250 108 340 118" /><path d="M360 150 Q420 150 452 176" /><path d="M220 190 Q300 202 380 192" />
    </g>
    <ellipse cx={152} cy={86} rx={46} ry={31} fill="#7A5230" />
    <circle cx={118} cy={130} r={58} fill="#7A5230" />
    <ellipse cx={160} cy={120} rx={15} ry={20} fill="#5E3D22" transform="rotate(12 160 120)" />
    <path d="M84 150 C66 200 68 258 84 306 C90 324 110 322 112 304 C114 268 104 232 108 196 C110 172 100 152 84 150 Z" fill="#6E4826" />
    <path d="M118 208 C76 232 62 272 72 306" stroke="#E3D7B8" strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.9} />
    <path d="M100 200 C46 226 26 276 40 322" stroke="#EDE4CC" strokeWidth={15} fill="none" strokeLinecap="round" />
    <circle cx={106} cy={124} r={6.5} fill="#16221C" />
  </svg>
);

// ---------- Woolly mouse (Colossal "woolly mouse", 2025 — from WHAT IF Mammoth, 2026-11-05) ----------
// Small lab mouse with extra-long wavy golden fur (the 2025 gene-edit proof of concept).
export const WoollyMouseAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number}> =
({x, y, w, flip = false, opacity = 1}) => (
  <svg width={w} height={w * 200 / 300} viewBox="0 0 300 200" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M236 140 C272 132 288 108 283 86" stroke="#C9A27A" strokeWidth={7} fill="none" strokeLinecap="round" />
    <ellipse cx={142} cy={118} rx={110} ry={63} fill="#C98F4A" />
    <path d="M52 148 Q60 168 76 152 Q84 172 100 154 Q110 174 126 156 Q136 174 152 156 Q162 174 178 156 Q190 172 204 154 Q218 168 230 148 L232 128 L50 128 Z" fill="#B57E36" opacity={0.65} />
    <g stroke="#A87432" strokeWidth={6} fill="none" strokeLinecap="round">
      <path d="M62 68 Q72 50 86 62" /><path d="M112 54 Q124 38 138 50" /><path d="M168 58 Q180 44 192 56" /><path d="M84 96 Q120 84 170 92" />
    </g>
    <circle cx={94} cy={64} r={21} fill="#C98F4A" />
    <circle cx={94} cy={64} r={10} fill="#E8B98A" />
    <ellipse cx={96} cy={168} rx={17} ry={8} fill="#B57E36" />
    <ellipse cx={196} cy={168} rx={17} ry={8} fill="#B57E36" />
    <circle cx={60} cy={104} r={6.5} fill="#16221C" />
    <circle cx={31} cy={124} r={7.5} fill="#C97B63" />
    <g stroke="#8A8A86" strokeWidth={3} strokeLinecap="round"><path d="M36 116 L6 106" /><path d="M36 124 L4 124" /><path d="M38 132 L8 142" /></g>
  </svg>
);

// ---- Jupiter: raksasa gas berlapis, bintik merah (v1.7, untuk Mars–Jupiter) ----
export const JupiterAsset: React.FC<{ size?: number }> = ({ size = 300 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <clipPath id="jupClip"><circle cx="100" cy="100" r="88" /></clipPath>
    </defs>
    <g clipPath="url(#jupClip)">
      <rect x="12" y="12" width="176" height="176" fill="#E8C188" />
      <path d="M12 52 Q 60 40, 100 52 T 188 50 L 188 74 Q 140 84, 100 74 T 12 76 Z" fill="#C97B4A" />
      <path d="M12 84 Q 55 76, 100 86 T 188 82 L 188 104 Q 145 96, 100 106 T 12 102 Z" fill="#F3E2BC" />
      <path d="M12 112 Q 60 104, 100 114 T 188 110 L 188 134 Q 140 142, 100 132 T 12 136 Z" fill="#B85C33" />
      <path d="M12 142 Q 55 134, 100 144 T 188 140 L 188 188 L 12 188 Z" fill="#DFA860" />
      <ellipse cx="132" cy="122" rx="26" ry="13" fill="#C8432B" />
      <ellipse cx="132" cy="122" rx="17" ry="8" fill="#E05B3A" />
    </g>
    <circle cx="100" cy="100" r="88" fill="none" stroke="#8A5A2B" strokeWidth="3" opacity="0.35" />
    <ellipse cx="70" cy="58" rx="40" ry="20" fill="#FFFFFF" opacity="0.18" />
  </svg>
);

// ================= v1.8 additions (ED138 project, 2026-11-08) =================
// IcyWorld: a pale icy dwarf-planet sphere with craters and a frosty cap.
// hue shifts the frost tint ('blue' default, 'rose' warm, 'mint').
export const IcyWorld: React.FC<{ x: number; y: number; d: number; hue?: 'blue' | 'rose' | 'mint' }> = ({ x, y, d, hue = 'blue' }) => {
  const body = hue === 'rose' ? '#E8CFC8' : hue === 'mint' ? '#CDE8DC' : '#C9D9EC';
  const shade = hue === 'rose' ? '#C4A096' : hue === 'mint' ? '#9CC4B0' : '#93A9C9';
  const deep = hue === 'rose' ? '#9C7A6E' : hue === 'mint' ? '#6E9A85' : '#68809F';
  return (
    <svg style={{ position: 'absolute', left: x, top: y }} width={d} height={d} viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill={body} />
      <path d="M100 8 a92 92 0 0 1 0 184 a70 92 0 0 0 0 -184" fill={shade} opacity="0.55" />
      <ellipse cx="66" cy="52" rx="42" ry="24" fill="#FFFFFF" opacity="0.5" />
      <circle cx="70" cy="120" r="13" fill="none" stroke={deep} strokeWidth="4" opacity="0.5" />
      <circle cx="128" cy="86" r="9" fill="none" stroke={deep} strokeWidth="3.5" opacity="0.45" />
      <circle cx="112" cy="146" r="6.5" fill="none" stroke={deep} strokeWidth="3" opacity="0.4" />
      <circle cx="48" cy="88" r="5.5" fill="none" stroke={deep} strokeWidth="3" opacity="0.35" />
      <circle cx="100" cy="100" r="92" fill="none" stroke={deep} strokeWidth="3" opacity="0.5" />
    </svg>
  );
};

// DwarfPlanet: the five recognised dwarf planets as simple flat discs.
// kind: 'pluto' (heart patch) | 'ceres' (speckled grey) | 'eris' (pale, biggest)
//     | 'haumea' (egg-shaped, rusty) | 'makemake' (red-brown)
export const DwarfPlanet: React.FC<{ x: number; y: number; d: number; kind: 'pluto' | 'ceres' | 'eris' | 'haumea' | 'makemake' }> = ({ x, y, d, kind }) => {
  if (kind === 'haumea') {
    return (
      <svg style={{ position: 'absolute', left: x, top: y }} width={d * 1.35} height={d} viewBox="0 0 270 200">
        <ellipse cx="135" cy="100" rx="128" ry="90" fill="#C08552" />
        <ellipse cx="100" cy="66" rx="62" ry="34" fill="#FFFFFF" opacity="0.22" />
        <ellipse cx="180" cy="140" rx="48" ry="24" fill="#8A5A30" opacity="0.45" />
        <ellipse cx="135" cy="100" rx="128" ry="90" fill="none" stroke="#8A5A30" strokeWidth="4" opacity="0.5" />
      </svg>
    );
  }
  const fill = kind === 'pluto' ? '#D9B98C' : kind === 'ceres' ? '#A9A9A9' : kind === 'eris' ? '#E4E7EC' : '#B4623A';
  const deep = kind === 'pluto' ? '#A67C4E' : kind === 'ceres' ? '#767676' : kind === 'eris' ? '#A9B2C0' : '#7E3F20';
  return (
    <svg style={{ position: 'absolute', left: x, top: y }} width={d} height={d} viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill={fill} />
      <path d="M100 8 a92 92 0 0 1 0 184 a72 92 0 0 0 0 -184" fill={deep} opacity="0.35" />
      <ellipse cx="66" cy="52" rx="42" ry="24" fill="#FFFFFF" opacity="0.35" />
      {kind === 'pluto' && <path d="M128 128 c-14-16-36-6-36 10 0 14 20 24 36 34 16-10 36-20 36-34 0-16-22-26-36-10z" fill="#8A5A30" opacity="0.55" />}
      {kind === 'ceres' && <g fill={deep} opacity="0.5"><circle cx="70" cy="110" r="7" /><circle cx="126" cy="76" r="5" /><circle cx="112" cy="138" r="6" /><circle cx="52" cy="70" r="4" /></g>}
      {kind === 'eris' && <circle cx="76" cy="128" r="11" fill="none" stroke={deep} strokeWidth="4" opacity="0.5" />}
      {kind === 'makemake' && <path d="M30 128 q70 26 140 0 l0 14 q-70 24-140 0z" fill={deep} opacity="0.4" />}
      <circle cx="100" cy="100" r="92" fill="none" stroke={deep} strokeWidth="3" opacity="0.5" />
    </svg>
  );
};

// ---------- Peregrine falcon (from Alap-Alap Kawah, 2026-11-09) ----------
// Slate-blue back/hood, cream barred belly, black malar stripe, yellow cere + eye ring.
export const FALCON_BACK = '#42566B', FALCON_DARK = '#2E4053', FALCON_HOOD = '#232E3C', FALCON_BELLY = '#F1E6CC', FALCON_YEL = '#F2B01E';

export const FalconFlyAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number}> =
({x, y, w, flip = false, opacity = 1}) => (
  <svg width={w} height={w * 240 / 400} viewBox="0 0 400 240" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M196,102 C158,38 96,10 28,4 C74,52 118,94 168,116 Z" fill={FALCON_DARK} />
    <path d="M98,126 L26,110 L34,150 L102,150 Z" fill={FALCON_BACK} />
    <g stroke={FALCON_DARK} strokeWidth={5} strokeLinecap="round"><line x1="44" y1="118" x2="46" y2="142" /><line x1="66" y1="122" x2="68" y2="146" /><line x1="88" y1="124" x2="90" y2="148" /></g>
    <path d="M58,118 C112,92 208,84 284,98 C336,107 368,122 384,140 C344,156 238,162 162,152 C112,146 74,136 58,118 Z" fill={FALCON_BACK} />
    <path d="M96,132 C170,116 268,116 340,134 C268,152 160,152 104,142 Z" fill={FALCON_BELLY} />
    <g stroke="#8A97A5" strokeWidth={4} strokeLinecap="round" opacity={0.8}><path d="M150,128 l6,14 M196,124 l6,15 M242,124 l6,15 M288,128 l5,13" /></g>
    <path d="M218,116 C176,168 112,196 44,202 C106,160 162,130 204,124 Z" fill="#4A617A" />
    <path d="M308,94 C336,86 366,98 380,122 C386,134 384,146 374,152 C348,146 322,128 308,108 Z" fill={FALCON_HOOD} />
    <path d="M338,128 C336,142 338,154 346,164 L358,160 C350,148 348,138 350,128 Z" fill={FALCON_HOOD} />
    <circle cx="352" cy="122" r="8" fill={FALCON_YEL} /><circle cx="352" cy="122" r="4" fill="#16221C" />
    <path d="M376,128 L396,138 L378,148 C384,140 384,134 376,128 Z" fill={FALCON_YEL} />
    <path d="M388,134 L398,139 L386,145 Z" fill={FALCON_HOOD} />
  </svg>
);

export const FalconStoopAsset: React.FC<{x: number; y: number; w: number; opacity?: number}> =
({x, y, w, opacity = 1}) => (
  <svg width={w} height={w * 400 / 240} viewBox="0 0 240 400" style={{position: 'absolute', left: x, top: y, opacity}}>
    <path d="M68,8 L172,8 L158,62 L82,62 Z" fill={FALCON_BACK} />
    <g stroke={FALCON_DARK} strokeWidth={5} strokeLinecap="round"><line x1="92" y1="14" x2="94" y2="52" /><line x1="120" y1="12" x2="120" y2="54" /><line x1="148" y1="14" x2="146" y2="52" /></g>
    <path d="M120,42 C168,88 186,168 173,250 C165,306 142,356 120,390 C98,356 75,306 67,250 C54,168 72,88 120,42 Z" fill={FALCON_BACK} />
    <path d="M120,82 C148,122 157,192 149,256 C143,302 132,336 120,356 C108,336 97,302 91,256 C83,192 92,122 120,82 Z" fill={FALCON_BELLY} />
    <g stroke="#8A97A5" strokeWidth={4} strokeLinecap="round" opacity={0.85}><path d="M104,150 l32,0 M100,196 l40,0 M104,242 l32,0 M108,286 l24,0" /></g>
    <path d="M78,108 C60,180 62,262 84,328 C66,262 64,180 78,108 Z" fill={FALCON_DARK} />
    <path d="M162,108 C180,180 178,262 156,328 C174,262 176,180 162,108 Z" fill={FALCON_DARK} />
    <path d="M88,316 C96,352 106,374 120,388 C134,374 144,352 152,316 C138,330 102,330 88,316 Z" fill={FALCON_HOOD} />
    <circle cx="103" cy="342" r="6.5" fill={FALCON_YEL} /><circle cx="103" cy="342" r="3.2" fill="#16221C" />
    <circle cx="137" cy="342" r="6.5" fill={FALCON_YEL} /><circle cx="137" cy="342" r="3.2" fill="#16221C" />
    <path d="M113,360 L127,360 L120,376 Z" fill={FALCON_YEL} />
  </svg>
);

export const FalconHeadAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; membrane?: number}> =
({x, y, w, flip = false, opacity = 1, membrane = 0}) => (
  <svg width={w} height={w * 340 / 400} viewBox="0 0 400 340" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M20,302 C8,180 60,78 152,44 C242,10 332,40 374,112 C392,146 390,188 370,218 C338,266 278,302 204,320 C128,336 52,332 20,302 Z" fill={FALCON_BACK} />
    <path d="M196,80 C276,54 344,86 372,138 C388,170 382,208 354,232 C314,268 250,282 202,260 C168,244 154,204 161,158 C166,118 176,92 196,80 Z" fill="#E9DCC0" />
    <path d="M252,152 C246,196 252,236 270,268 L296,258 C282,224 278,188 284,156 Z" fill={FALCON_HOOD} />
    <circle cx="268" cy="138" r="18" fill={FALCON_YEL} /><circle cx="268" cy="138" r="11.5" fill="#16221C" /><circle cx="272" cy="133" r="3.6" fill="#FFFFFF" />
    {membrane > 0 && <ellipse cx={268 - 18 + 18 * membrane} cy="138" rx={19 * membrane} ry="18.5" fill="rgba(233,244,250,0.55)" />}
    <path d="M344,146 C366,140 384,152 390,170 L356,186 C346,170 340,156 344,146 Z" fill={FALCON_YEL} />
    <circle cx="362" cy="161" r="6.5" fill="#8A6410" /><circle cx="362" cy="161" r="2.8" fill="#F7C948" />
    <path d="M382,150 C406,162 414,188 402,214 C392,200 376,194 360,198 C374,184 378,166 382,150 Z" fill={FALCON_HOOD} />
  </svg>
);

export const PigeonAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; flap?: number}> =
({x, y, w, flip = false, opacity = 1, flap = 0}) => (
  <svg width={w} height={w * 200 / 300} viewBox="0 0 300 200" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M44,110 L4,98 L10,134 L50,134 Z" fill="#7C8794" />
    <g style={{transform: `rotate(${-38 * flap}deg)`, transformOrigin: '120px 96px'}}>
      <path d="M112,96 C120,44 162,12 210,6 C190,50 164,82 140,104 Z" fill="#7C8794" />
      <path d="M128,88 C142,52 172,30 198,24" stroke="#95A1AC" strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
    <path d="M40,112 C72,80 142,66 202,78 C242,86 270,102 280,122 C252,142 180,150 120,144 C80,140 52,128 40,112 Z" fill="#9AA3AD" />
    <ellipse cx="234" cy="112" rx="15" ry="20" fill="#3FA08A" opacity={0.85} transform="rotate(-18 234 112)" />
    <circle cx="260" cy="98" r="21" fill="#9AA3AD" />
    <circle cx="266" cy="94" r="4" fill="#C33" /><circle cx="266" cy="94" r="1.8" fill="#16221C" />
    <path d="M278,96 L296,102 L278,108 Z" fill="#5A646E" />
    <g stroke="#D97B6C" strokeWidth={5} strokeLinecap="round"><line x1="140" y1="142" x2="136" y2="158" /><line x1="168" y1="144" x2="166" y2="160" /></g>
  </svg>
);

export const SpeedoAsset: React.FC<{x: number; y: number; w: number; value: number; opacity?: number}> =
({x, y, w, value, opacity = 1}) => {
  const ang = -225 + 270 * Math.max(0, Math.min(1, value));
  const rad = (a: number) => (a * Math.PI) / 180;
  const arc = (a0: number, a1: number, r: number) => {
    const x0 = 150 + r * Math.cos(rad(a0)), y0 = 150 + r * Math.sin(rad(a0));
    const x1 = 150 + r * Math.cos(rad(a1)), y1 = 150 + r * Math.sin(rad(a1));
    return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
  };
  return (
    <svg width={w} height={w} viewBox="0 0 300 300" style={{position: 'absolute', left: x, top: y, opacity}}>
      <circle cx="150" cy="150" r="142" fill="rgba(255,246,222,0.96)" />
      <circle cx="150" cy="150" r="142" fill="none" stroke={GREEN} strokeWidth="5" />
      <path d={arc(-225, 45, 112)} stroke="#D8E4EC" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d={arc(35, 45, 112)} stroke="#C0392B" strokeWidth="20" fill="none" />
      {value > 0.005 && <path d={arc(-225, ang, 112)} stroke={AMBER_D} strokeWidth="20" fill="none" strokeLinecap="round" />}
      <g stroke={GREEN} strokeWidth="4" strokeLinecap="round">
        {Array.from({length: 10}, (_, i) => { const a = rad(-225 + 30 * i); return <line key={i} x1={150 + 88 * Math.cos(a)} y1={150 + 88 * Math.sin(a)} x2={150 + 99 * Math.cos(a)} y2={150 + 99 * Math.sin(a)} />; })}
      </g>
      <g style={{transform: `rotate(${ang + 90}deg)`, transformOrigin: '150px 150px'}}>
        <path d="M143,150 L150,52 L157,150 Z" fill={GREEN} />
      </g>
      <circle cx="150" cy="150" r="15" fill={GREEN} /><circle cx="150" cy="150" r="6" fill={AMBER_D} />
    </svg>
  );
};

// ---------- T-rex (from WHAT IF Asteroid, 2026-11-10) ----------
// Two-tone flat profile, facing right. color = main body tone.
export const TrexAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; color?: string}> =
({x, y, w, flip = false, opacity = 1, color = '#55684C'}) => (
  <svg width={w} height={w * 360 / 480} viewBox="0 0 480 360" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
    <path d="M152,192 C92,200 44,226 12,268 C54,258 108,242 154,226 Z" fill={color} />
    <g opacity={0.82}>
      <ellipse cx="168" cy="252" rx="30" ry="52" fill={color} transform="rotate(14 168 252)" />
      <path d="M158,292 C152,316 158,334 172,344 L214,344 L214,332 L186,328 C176,320 174,306 178,294 Z" fill={color} />
    </g>
    <ellipse cx="232" cy="186" rx="118" ry="63" fill={color} transform="rotate(-7 232 186)" />
    <ellipse cx="240" cy="204" rx="92" ry="42" fill="#FFFFFF" opacity={0.14} transform="rotate(-7 240 204)" />
    <ellipse cx="324" cy="168" rx="54" ry="35" fill={color} transform="rotate(-22 324 168)" />
    <path d="M300,158 C318,108 366,76 424,76 C458,76 476,92 474,112 L472,128 C452,135 428,135 408,130 L413,147 C396,153 376,153 359,148 C336,162 312,168 300,158 Z" fill={color} />
    <path d="M360,150 C386,157 416,157 441,149 L438,160 C412,166 384,162 362,158 Z" fill={color} />
    <g fill="#FFF6DE"><path d="M414,133 l7,12 l7,-11 Z" /><path d="M432,134 l7,11 l7,-12 Z" /><path d="M448,132 l6,10 l6,-11 Z" /></g>
    <circle cx="416" cy="106" r="6" fill={AMBER_D} /><circle cx="416" cy="106" r="2.8" fill="#16221C" />
    <path d="M330,128 C360,112 400,104 438,106" stroke="#00000022" strokeWidth={7} fill="none" strokeLinecap="round" />
    <ellipse cx="208" cy="252" rx="34" ry="56" fill={color} transform="rotate(12 208 252)" />
    <path d="M198,292 C192,318 198,336 212,346 L256,346 L256,333 L226,329 C216,320 214,306 219,293 Z" fill={color} />
    <g stroke={color} strokeWidth={6} strokeLinecap="round"><line x1="238" y1="346" x2="246" y2="352" /><line x1="222" y1="346" x2="228" y2="353" /></g>
    <ellipse cx="344" cy="212" rx="9" ry="17" fill={color} transform="rotate(18 344 212)" />
  </svg>
);

// ---------- Earth with hydrocarbon-rich zones (from WHAT IF Asteroid, 2026-11-10) ----------
// zoneO = opacity of the ~13% rich-zone highlights.
export const EarthZonesAsset: React.FC<{x: number; y: number; d: number; zoneO?: number; opacity?: number}> =
({x, y, d, zoneO = 1, opacity = 1}) => (
  <svg width={d} height={d} viewBox="0 0 400 400" style={{position: 'absolute', left: x, top: y, opacity}}>
    <circle cx="200" cy="200" r="192" fill="#4A90C4" />
    <path d="M200 8 a192 192 0 0 1 0 384 a150 192 0 0 0 0 -384" fill="#2E6DA3" opacity={0.45} />
    <g fill="#8FAE5C">
      <path d="M62,120 C80,84 128,66 168,78 C186,96 178,124 150,140 C158,168 138,196 112,190 C84,182 50,156 62,120 Z" />
      <path d="M128,208 C150,196 172,210 168,238 C164,268 148,300 128,318 C112,296 108,240 128,208 Z" />
      <path d="M228,84 C272,60 330,74 348,108 C330,128 300,124 288,142 C268,132 262,108 246,104 C228,100 218,94 228,84 Z" />
      <path d="M252,168 C282,152 316,168 322,200 C326,232 306,268 280,282 C254,262 238,200 252,168 Z" />
      <path d="M318,238 C344,232 366,248 362,272 C344,288 318,282 308,264 C302,250 306,242 318,238 Z" />
    </g>
    <g opacity={zoneO}>
      <ellipse cx="118" cy="128" rx="34" ry="24" fill={AMBER_D} opacity={0.88} transform="rotate(-18 118 128)" />
      <ellipse cx="286" cy="205" rx="30" ry="38" fill={AMBER_D} opacity={0.88} transform="rotate(12 286 205)" />
      <ellipse cx="252" cy="102" rx="26" ry="17" fill={AMBER_D} opacity={0.88} transform="rotate(-8 252 102)" />
      <g fill="none" stroke="#B57A08" strokeWidth="3.5" strokeDasharray="8 7">
        <ellipse cx="118" cy="128" rx="42" ry="31" transform="rotate(-18 118 128)" />
        <ellipse cx="286" cy="205" rx="38" ry="46" transform="rotate(12 286 205)" />
        <ellipse cx="252" cy="102" rx="33" ry="23" transform="rotate(-8 252 102)" />
      </g>
    </g>
    <ellipse cx="128" cy="76" rx="86" ry="40" fill="#FFFFFF" opacity={0.28} />
    <circle cx="200" cy="200" r="192" fill="none" stroke="#2E6DA3" strokeWidth="4" opacity={0.6} />
  </svg>
);

// ---------- Chicxulub target marker (from WHAT IF Asteroid, 2026-11-10) ----------
// x,y = CENTER of the reticle. pulse 0..1 scales the outer ring.
export const ChicxulubMarker: React.FC<{x: number; y: number; s?: number; pulse?: number; opacity?: number}> =
({x, y, s = 120, pulse = 0, opacity = 1}) => (
  <svg width={s} height={s} viewBox="0 0 120 120" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, opacity}}>
    <circle cx="60" cy="60" r={34 + pulse * 14} fill="none" stroke="#C0392B" strokeWidth="4" strokeDasharray="9 7" opacity={0.95 - pulse * 0.4} />
    <circle cx="60" cy="60" r="21" fill="none" stroke="#C0392B" strokeWidth="5" />
    <circle cx="60" cy="60" r="7.5" fill="#C0392B" />
    <g stroke="#C0392B" strokeWidth="5" strokeLinecap="round">
      <line x1="60" y1="6" x2="60" y2="22" /><line x1="60" y1="98" x2="60" y2="114" />
      <line x1="6" y1="60" x2="22" y2="60" /><line x1="98" y1="60" x2="114" y2="60" />
    </g>
  </svg>
);

/* ================= HAAST EAGLE vs MOA (v1.11 candidates) ================= */

export const MOA_BODY = '#8A6B4A';
export const MOA_DARK = '#6E5439';
export const MOA_BELLY = '#C9AE85';
export const EAGLE_BODY = '#5B4632';
export const EAGLE_DARK = '#42311F';
export const EAGLE_HEAD = '#E8DCC4';

/** Moa raksasa — burung tak terbang: leher panjang, badan besar, kaki kokoh. Hadap kanan. */
export const MoaAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; color?: string}> = ({x, y, w, flip, opacity = 1, color}) => {
  const h = w * 1.3;
  const body = color ?? MOA_BODY;
  const dark = color ?? MOA_DARK;
  const belly = color ?? MOA_BELLY;
  return (
    <svg width={w} height={h} viewBox="0 0 400 520" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      {/* tail feathers */}
      <path d="M52,208 C10,190 4,150 30,128 C58,150 74,178 84,200 Z" fill={dark} />
      {/* far leg */}
      <path d="M232,330 L226,470 L218,470 L224,508 L252,508 L246,470 L244,338 Z" fill={dark} />
      {/* neck (behind body) */}
      <path d="M268,190 C306,150 316,110 310,64 L346,58 C356,116 340,168 300,208 Z" fill={body} />
      {/* body */}
      <ellipse cx="185" cy="245" rx="140" ry="105" fill={body} />
      <ellipse cx="170" cy="272" rx="105" ry="72" fill={belly} opacity={0.5} />
      {/* wing stub */}
      <ellipse cx="150" cy="238" rx="52" ry="30" fill={dark} opacity={0.55} transform="rotate(-18 150 238)" />
      {/* near leg */}
      <path d="M168,336 L162,474 L152,474 L158,512 L190,512 L182,474 L182,344 Z" fill={body} />
      <path d="M158,510 L136,518 M160,512 L162,524 M162,510 L186,518" stroke={dark} strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d="M224,506 L204,514 M226,508 L228,520 M228,506 L250,514" stroke={dark} strokeWidth={8} strokeLinecap="round" fill="none" />
      {/* head */}
      <ellipse cx="330" cy="52" rx="30" ry="20" fill={body} transform="rotate(14 330 52)" />
      <path d="M356,46 L388,56 L358,66 Z" fill={EAGLE_DARK} />
      <circle cx="338" cy="48" r="4.5" fill="#1D1508" />
    </svg>
  );
};

/** Elang Haast — pose menerjang hadap kanan: sayap lebar ke belakang-atas, kaki menjulur bercakar. */
export const HaastEagleAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; color?: string}> = ({x, y, w, flip, opacity = 1, color}) => {
  const h = w * 0.68;
  const body = color ?? EAGLE_BODY;
  const dark = color ?? EAGLE_DARK;
  return (
    <svg width={w} height={h} viewBox="0 0 440 300" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      {/* far wing */}
      <path d="M215,120 C160,60 90,30 18,34 C70,84 130,128 196,148 Z" fill={dark} />
      {/* tail fan */}
      <path d="M84,164 L16,192 L32,212 L86,202 L106,218 L112,186 Z" fill={dark} />
      {/* body */}
      <ellipse cx="215" cy="160" rx="128" ry="52" fill={body} transform="rotate(-6 215 160)" />
      <ellipse cx="200" cy="176" rx="88" ry="34" fill="#7A5F40" opacity={0.65} transform="rotate(-6 200 176)" />
      {/* near wing raised */}
      <path d="M235,138 C215,70 165,18 84,4 C140,66 185,116 214,152 Z" fill={body} />
      <path d="M225,128 C205,76 168,36 108,18 C152,66 188,108 210,140 Z" fill="#6E5439" opacity={0.7} />
      {/* legs + talons reaching forward-down */}
      <path d="M288,194 L326,246 L314,256 L274,210 Z" fill={body} />
      <path d="M324,246 l22,12 -18,9 M330,254 l24,2 -16,13 M322,258 l10,22 -16,-6" stroke="#241A10" strokeWidth={8} strokeLinecap="round" fill="none" />
      <path d="M252,202 L274,254 L262,260 L238,214 Z" fill={body} />
      <path d="M272,254 l20,13 -18,8 M278,261 l23,3 -16,12" stroke="#241A10" strokeWidth={8} strokeLinecap="round" fill="none" />
      {/* neck + head */}
      <path d="M318,128 C348,116 372,118 392,132 L388,168 C362,178 336,172 320,156 Z" fill={body} />
      <ellipse cx="382" cy="138" rx="26" ry="19" fill={color ?? EAGLE_HEAD} transform="rotate(10 382 138)" />
      <path d="M402,128 C424,130 436,142 430,160 C428,166 420,166 416,158 C412,150 406,146 398,146 Z" fill="#2E2118" />
      <circle cx="388" cy="134" r="4.5" fill="#14100B" />
    </svg>
  );
};

/** Cakar elang close-up — kaki berbulu, telapak emas, cakar hitam melengkung. */
export const ClawAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number}> = ({x, y, w, flip, opacity = 1}) => {
  const h = w;
  return (
    <svg width={w} height={h} viewBox="0 0 300 300" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      <path d="M118,0 L182,0 L176,120 C176,150 124,150 124,120 Z" fill={EAGLE_BODY} />
      <path d="M124,60 C150,74 176,60 182,44 L176,120 C176,150 124,150 124,120 Z" fill={EAGLE_DARK} opacity={0.5} />
      <ellipse cx="150" cy="150" rx="58" ry="34" fill="#D9A441" />
      {/* three front talons */}
      <path d="M104,168 C92,206 96,238 116,262 C104,232 108,204 122,182 Z" fill="#241C14" />
      <path d="M146,176 C142,216 150,248 172,268 C156,240 154,210 164,184 Z" fill="#241C14" />
      <path d="M188,168 C198,204 210,230 234,246 C218,222 206,198 202,176 Z" fill="#241C14" />
      {/* hallux (back talon) */}
      <path d="M96,150 C70,160 56,182 56,208 C70,188 84,172 104,164 Z" fill="#241C14" />
      <circle cx="128" cy="142" r="6" fill="#B9832F" /><circle cx="156" cy="148" r="6" fill="#B9832F" /><circle cx="182" cy="140" r="6" fill="#B9832F" />
    </svg>
  );
};

/* ================= HARIMAU JAWA (v1.12, whatif-harimau-jawa 2026-11-12) ================= */

export const TIGER_ORANGE = '#D97B29';
export const TIGER_DARK = '#8A4A12';
export const TIGER_CREAM = '#F6E3C2';
export const TIGER_STRIPE = '#241708';

/** Harimau Jawa — pose melompat hadap kanan: badan memanjang, kaki menjulur, ekor panjang. Flat 100%. */
export const TigerAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; color?: string}> = ({x, y, w, flip, opacity = 1, color}) => {
  const h = w * 0.62;
  const body = color ?? TIGER_ORANGE;
  const dark = TIGER_DARK;
  return (
    <svg width={w} height={h} viewBox="0 0 500 310" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      {/* tail — long, curving up behind */}
      <path d="M58,150 C20,130 8,88 34,58 C44,48 58,52 56,64 C48,92 66,118 96,132 Z" fill={body} />
      <path d="M30,84 L52,74 L48,92 Z" fill={TIGER_STRIPE} />
      <path d="M40,106 L60,98 L56,114 Z" fill={TIGER_STRIPE} />
      {/* far legs (behind body, stretched) */}
      <path d="M150,196 L96,246 L84,240 L132,186 Z" fill={dark} />
      <path d="M330,196 L392,240 L404,232 L352,184 Z" fill={dark} />
      {/* body — long ellipse, slight upward tilt */}
      <ellipse cx="250" cy="160" rx="165" ry="62" fill={body} transform="rotate(-4 250 160)" />
      <ellipse cx="240" cy="186" rx="130" ry="34" fill={TIGER_CREAM} opacity={0.55} transform="rotate(-4 240 186)" />
      {/* stripes on body */}
      <path d="M150,116 l14,44 -12,4 -14,-44 Z" fill={TIGER_STRIPE} />
      <path d="M196,104 l12,48 -12,4 -12,-48 Z" fill={TIGER_STRIPE} />
      <path d="M244,100 l10,50 -12,4 -10,-50 Z" fill={TIGER_STRIPE} />
      <path d="M292,102 l10,48 -12,4 -10,-48 Z" fill={TIGER_STRIPE} />
      <path d="M336,112 l12,42 -12,4 -12,-42 Z" fill={TIGER_STRIPE} />
      {/* near front leg reaching forward-down */}
      <path d="M392,180 L452,224 L444,240 L380,200 Z" fill={body} />
      <path d="M448,222 l16,10 -4,10 -16,-10 Z" fill={TIGER_CREAM} />
      <path d="M408,196 l10,18 -10,4 -10,-18 Z" fill={TIGER_STRIPE} />
      {/* near hind leg pushing back-down */}
      <path d="M112,186 L52,236 L62,250 L128,202 Z" fill={body} />
      <path d="M56,234 l-14,12 4,10 14,-12 Z" fill={TIGER_CREAM} />
      <path d="M96,200 l-12,16 10,6 12,-16 Z" fill={TIGER_STRIPE} />
      {/* neck + head */}
      <path d="M386,120 C420,96 452,98 470,120 L462,164 C438,180 408,172 392,150 Z" fill={body} />
      <path d="M404,108 l8,20 -10,4 -8,-20 Z" fill={TIGER_STRIPE} />
      <path d="M428,102 l6,20 -10,4 -6,-20 Z" fill={TIGER_STRIPE} />
      {/* ears */}
      <path d="M408,104 C400,82 410,66 426,66 C436,66 440,80 436,96 Z" fill={body} />
      <path d="M414,96 C410,82 416,74 424,74 C430,74 432,84 430,92 Z" fill={TIGER_CREAM} />
      <path d="M452,100 C452,78 462,64 476,66 C486,68 488,82 482,96 Z" fill={body} />
      <path d="M458,92 C458,80 464,72 472,72 C478,72 480,82 478,90 Z" fill={TIGER_CREAM} />
      {/* face: white muzzle, nose, amber eye */}
      <ellipse cx="452" cy="146" rx="30" ry="18" fill={TIGER_CREAM} />
      <path d="M462,132 C472,128 482,134 480,144 C478,152 468,154 462,148 C458,142 458,136 462,132 Z" fill={TIGER_STRIPE} />
      <path d="M470,152 L470,160 M470,160 L460,166 M470,160 L480,166" stroke={TIGER_STRIPE} strokeWidth={3} strokeLinecap="round" fill="none" />
      <circle cx="432" cy="126" r="6" fill="#F5A623" />
      <circle cx="432" cy="126" r="2.6" fill="#1D1508" />
      <path d="M420,116 q12,-6 24,0" stroke={TIGER_STRIPE} strokeWidth={4} strokeLinecap="round" fill="none" />
    </svg>
  );
};

/** Sehelai rambut — melengkung lembut dengan akar (bulb) di ujung bawah. */
export const HairAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; color?: string}> = ({x, y, w, flip, opacity = 1, color}) => {
  const h = w * 2.6;
  return (
    <svg width={w} height={h} viewBox="0 0 100 260" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      <path d="M50,8 C78,70 22,150 52,232" stroke={color ?? '#3A2A18'} strokeWidth={7} strokeLinecap="round" fill="none" />
      <circle cx="52" cy="240" r="12" fill={color ?? '#3A2A18'} />
    </svg>
  );
};

/** Kamera jebak — kotak camo gelap, lensa, LED inframerah, tali pengikat. */
export const CameraTrapAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number}> = ({x, y, w, flip, opacity = 1}) => {
  const h = w * 1.15;
  return (
    <svg width={w} height={h} viewBox="0 0 200 230" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      <rect x="30" y="20" width="140" height="190" rx="18" fill="#3D4A33" />
      <rect x="30" y="20" width="140" height="190" rx="18" fill="none" stroke="#2A3324" strokeWidth={4} />
      <circle cx="100" cy="95" r="38" fill="#22301C" />
      <circle cx="100" cy="95" r="26" fill="#4A6B8A" />
      <circle cx="100" cy="95" r="14" fill="#1A2836" />
      <circle cx="92" cy="88" r="5" fill="#BFD9EA" />
      <circle cx="58" cy="52" r="7" fill="#C0392B" />
      <circle cx="142" cy="52" r="7" fill="#C0392B" />
      <rect x="62" y="150" width="76" height="26" rx="8" fill="#2A3324" />
      <rect x="78" y="156" width="44" height="14" rx="4" fill="#7A9A5B" />
      <path d="M30,60 L10,60 M30,170 L10,170" stroke="#2A3324" strokeWidth={10} strokeLinecap="round" />
    </svg>
  );
};

/* ================= KOMODO, NAGA YANG NYATA (v1.13, komodo-naga 2026-11-14) ================= */

export const KOMODO_BODY = '#6E7B57';
export const KOMODO_DARK = '#4C5739';
export const KOMODO_BELLY = '#A9B28A';
export const KOMODO_TONGUE = '#D96A5F';

/** Komodo — profil samping hadap kanan: badan rendah memanjang, ekor tebal meruncing,
    kaki pendek kuat bercakar, leher tebal, kepala baji, lidah bercabang, lempeng
    osteoderm di punggung (bintik gelap). Flat 100%. */
export const KomodoAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; tongue?: number}> =
({x, y, w, flip, opacity = 1, tongue = 1}) => {
  const h = w * 0.46;
  return (
    <svg width={w} height={h} viewBox="0 0 560 260" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      {/* tail — thick base tapering to a point, curving slightly down */}
      <path d="M168,128 C110,118 56,138 20,172 C10,181 14,196 28,194 C76,184 128,172 172,162 Z" fill={KOMODO_BODY} />
      <path d="M60,160 C48,168 40,176 34,184" stroke={KOMODO_DARK} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.6} />
      {/* far legs (behind body, darker) */}
      <path d="M196,176 L176,228 L196,232 L216,180 Z" fill={KOMODO_DARK} />
      <path d="M404,176 L388,228 L408,232 L424,180 Z" fill={KOMODO_DARK} />
      {/* body — long low ellipse */}
      <ellipse cx="300" cy="140" rx="172" ry="56" fill={KOMODO_BODY} />
      <ellipse cx="300" cy="168" rx="140" ry="30" fill={KOMODO_BELLY} opacity={0.6} />
      {/* osteoderm plates along the back */}
      {[180, 225, 270, 315, 360, 400].map((bx, i) => (
        <ellipse key={i} cx={bx} cy={92 - Math.sin(i * 0.9) * 4} rx={13} ry={8} fill={KOMODO_DARK} opacity={0.75} />
      ))}
      {/* near hind leg */}
      <path d="M168,178 L142,232 L168,238 L192,182 Z" fill={KOMODO_BODY} />
      <path d="M142,232 l-8,10 10,6 8,-10 Z" fill="#E8DFC8" />
      <path d="M152,234 l-4,10 10,4 4,-10 Z" fill="#E8DFC8" />
      <path d="M162,236 l0,10 10,2 0,-10 Z" fill="#E8DFC8" />
      {/* near front leg */}
      <path d="M428,178 L408,232 L434,238 L452,182 Z" fill={KOMODO_BODY} />
      <path d="M408,232 l-8,10 10,6 8,-10 Z" fill="#E8DFC8" />
      <path d="M418,234 l-4,10 10,4 4,-10 Z" fill="#E8DFC8" />
      <path d="M428,236 l0,10 10,2 0,-10 Z" fill="#E8DFC8" />
      {/* neck + wedge head */}
      <path d="M420,108 C452,84 500,76 534,90 C552,98 556,116 544,128 C524,144 488,146 464,138 C442,131 424,124 420,108 Z" fill={KOMODO_BODY} />
      {/* jaw line + serrated teeth hint */}
      <path d="M540,124 C516,132 492,134 470,130" stroke={KOMODO_DARK} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M528,127 l6,8 -8,2 Z M512,129 l6,8 -8,2 Z M496,130 l6,8 -8,2 Z" fill="#F2EBD5" />
      {/* forked tongue, flicking out of the snout */}
      <g opacity={tongue}>
        <path d="M544,126 C566,128 578,134 586,144" stroke={KOMODO_TONGUE} strokeWidth={7} strokeLinecap="round" fill="none" />
        <path d="M586,144 L600,138 M586,144 L598,154" stroke={KOMODO_TONGUE} strokeWidth={6} strokeLinecap="round" fill="none" />
      </g>
      {/* eye + ear + nostril */}
      <circle cx="506" cy="102" r="7" fill="#E8A93D" />
      <circle cx="506" cy="102" r="3" fill="#16221C" />
      <path d="M494,92 q12,-6 24,0" stroke={KOMODO_DARK} strokeWidth={4} strokeLinecap="round" fill="none" />
      <circle cx="466" cy="104" r="5" fill={KOMODO_DARK} />
      <circle cx="538" cy="102" r="3.4" fill={KOMODO_DARK} />
    </svg>
  );
};

export const DEER_BODY = '#8A6B4A';
export const DEER_DARK = '#6E5439';
export const DEER_BELLY = '#C9AE85';

/** Rusa Timor — profil samping hadap kanan: badan ramping, kaki panjang tipis,
    leher tegak, kepala kecil, tanduk bercabang tiga (jantan), bercak putih di
    pantat. Flat 100%. Dipakai sebagai mangsa di S2 Komodo. */
export const DeerAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number}> =
({x, y, w, flip, opacity = 1}) => {
  const h = w * 0.8;
  return (
    <svg width={w} height={h} viewBox="0 0 400 320" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      {/* tail + white rump patch */}
      <path d="M96,128 C78,122 66,132 70,146 C74,158 88,158 96,150 Z" fill={DEER_BELLY} />
      <ellipse cx="112" cy="140" rx="18" ry="24" fill="#EFE3C8" />
      {/* far legs (darker, slightly behind) */}
      <path d="M150,196 L142,292 L154,292 L162,198 Z" fill={DEER_DARK} />
      <path d="M252,196 L246,292 L258,292 L264,198 Z" fill={DEER_DARK} />
      {/* body */}
      <ellipse cx="200" cy="152" rx="112" ry="50" fill={DEER_BODY} />
      <ellipse cx="200" cy="178" rx="88" ry="24" fill={DEER_BELLY} opacity={0.55} />
      {/* near legs */}
      <path d="M168,198 L158,296 L172,296 L180,200 Z" fill={DEER_BODY} />
      <path d="M232,198 L226,296 L240,296 L246,200 Z" fill={DEER_BODY} />
      <path d="M158,296 l-4,10 18,0 2,-10 Z M226,296 l-4,10 18,0 2,-10 Z" fill="#3A2A18" />
      {/* neck + head */}
      <path d="M282,128 C300,96 312,72 326,54 L348,66 C336,88 326,112 314,138 C300,152 286,146 282,128 Z" fill={DEER_BODY} />
      <path d="M326,54 C342,38 362,34 378,42 C392,49 392,64 380,72 C364,80 344,76 334,66 Z" fill={DEER_BODY} />
      <ellipse cx="372" cy="62" rx="14" ry="8" fill={DEER_DARK} />
      <circle cx="352" cy="56" r="5" fill="#16221C" />
      <path d="M330,44 C322,30 326,18 336,14 L340,26 C334,30 332,38 336,46 Z" fill={DEER_BODY} />
      {/* antlers — main beam curving up-back, two short tines (kept inside viewBox) */}
      <path d="M346,44 C340,24 346,10 360,4 M344,28 L360,12 M360,4 L374,0" stroke={DEER_DARK} strokeWidth={7} strokeLinecap="round" fill="none" />
    </svg>
  );
};

export const COEL_BLUE = {body: '#5B7A8C', dark: '#3E5A6B', belly: '#9DB4C0', fin: '#46657A'};
export const COEL_BROWN = {body: '#8A6B4F', dark: '#6B4F38', belly: '#C2A582', fin: '#75583F'};

/** Coelacanth — profil samping hadap kiri: badan torpedo bersisik, kepala besar
    bermata besar, ekor tiga lobus (diphycercal), sirip punggung dua, sirip dada &
    perut BERTANGKAI DAGING (lobe-finned — ciri khas fosil hidup). Varian 'blue'
    (Latimeria chalumnae, Afrika Selatan 1938) dan 'brown' (L. menadoensis, Manado).
    Flat 100%. */
const COEL_BODY =
  'M38,146 C30,150 28,160 40,168 C70,186 140,202 230,206 C320,210 410,198 478,170 ' +
  'C490,164 492,152 486,142 C470,120 420,98 340,86 C260,74 170,82 120,98 C88,109 58,128 44,140 C40,143 38,144 38,146 Z';
export const CoelacanthAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; variant?: 'blue' | 'brown'; opacity?: number}> =
({x, y, w, flip, variant = 'blue', opacity = 1}) => {
  const c = variant === 'brown' ? COEL_BROWN : COEL_BLUE;
  const h = w * 300 / 640;
  const uid = `coel-${variant}`;
  return (
    <svg width={w} height={h} viewBox="0 0 640 300" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs>
        <clipPath id={uid}><path d={COEL_BODY} /></clipPath>
      </defs>
      {/* ekor tiga lobus (di belakang badan) */}
      <path d="M478,122 C520,92 566,68 600,60 C608,70 600,94 576,112 C556,126 514,134 478,136 Z" fill={c.body} />
      <path d="M478,134 C534,128 592,132 614,144 C592,156 534,160 478,154 Z" fill={c.body} />
      <path d="M478,152 C514,154 556,162 576,176 C600,194 608,218 600,226 C566,220 520,198 478,168 Z" fill={c.body} />
      {/* sirip punggung kedua (kecil, di pangkal ekor) */}
      <path d="M428,102 C430,80 440,64 456,56 C462,64 460,84 458,102 Z" fill={c.fin} />
      {/* sirip punggung pertama (tinggi, di tengah punggung) */}
      <path d="M268,88 C266,52 278,26 300,10 C308,14 308,28 306,44 C304,62 304,74 308,88 Z" fill={c.fin} />
      {/* sirip dubur */}
      <path d="M420,180 C416,196 420,212 432,222 C440,214 442,196 440,180 Z" fill={c.fin} />
      {/* badan */}
      <path d={COEL_BODY} fill={c.body} />
      {/* perut lebih terang + sisik + bintik (terpotong bentuk badan) */}
      <g clipPath={`url(#${uid})`}>
        <ellipse cx={280} cy={196} rx={180} ry={26} fill={c.belly} opacity={0.55} />
        {[110, 132, 154, 176].map((ry) => (
          <g key={ry}>
            {[150, 178, 206, 234, 262, 290, 318, 346, 374, 402, 430].map((rx) => (
              <path key={rx} d={`M${rx},${ry} q7,9 14,0`} stroke="#16221C" strokeWidth={2.4} fill="none" opacity={0.14} />
            ))}
          </g>
        ))}
        {[[180, 120], [250, 104], [320, 118], [390, 108], [300, 150], [360, 152], [220, 160], [430, 140]].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r={5} fill="#EAF2F4" opacity={0.45} />
        ))}
      </g>
      {/* sirip dada bertangkai daging (lobus + kipas) */}
      <path d="M148,178 C136,196 134,220 144,240 C158,246 172,232 176,212 C178,194 166,180 148,178 Z" fill={c.fin} />
      <path d="M150,196 C146,214 148,230 156,240" stroke={c.dark} strokeWidth={3} fill="none" opacity={0.7} />
      {/* sirip perut bertangkai daging */}
      <path d="M298,196 C290,210 290,228 298,242 C310,246 320,234 322,218 C323,204 312,194 298,196 Z" fill={c.fin} />
      {/* garis mulut + celah insang */}
      <path d="M42,152 C62,162 86,164 106,158" stroke={c.dark} strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M152,106 C160,128 160,152 150,174" stroke={c.dark} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.55} />
      {/* mata besar */}
      <circle cx={98} cy={128} r={14} fill="#16221C" />
      <circle cx={103} cy={123} r={5} fill="#FFFFFF" opacity={0.9} />
    </svg>
  );
};

export const MEGA_BODY = '#5A7386', MEGA_DARK = '#42586A', MEGA_BELLY = '#DCE6EA', MEGA_FIN = '#46607A';

/** Megalodon — profil samping hadap kiri: badan KEKAR torpedo, moncong LEBAR
    membulat (bukan lancip seperti hiu putih), rahang besar bergigi segitiga
    bergerigi, ekor heterocercal (lobus atas lebih panjang). BUKAN hiu putih
    yang diperbesar: proporsi badan lebih gemuk, kepala lebih lebar, sirip dada
    lebih panjang. Props: jaw 0..1 (bukaan rahang, engsel di 275,240),
    swim derajat (ayunan ekor, poros di 800,224). Flat 100%. */
const MEGA_BODY_PATH =
  'M70,205 C120,158 200,136 300,130 C420,122 580,138 690,168 C740,183 780,196 805,210 ' +
  'L805,238 C760,252 690,272 620,282 C500,298 380,296 300,278 C240,266 190,258 150,252 ' +
  'C105,244 78,225 70,205 Z';
export const MegalodonAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; jaw?: number; swim?: number}> =
({x, y, w, flip, opacity = 1, jaw = 0.3, swim = 0}) => {
  const h = w * 420 / 920;
  const uid = 'mega-body';
  const upperTeeth = [95, 119, 143, 167, 191, 215, 239];
  const lowerTeeth = [112, 134, 156, 178, 200, 222, 244];
  return (
    <svg width={w} height={h} viewBox="0 0 920 420" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs>
        <clipPath id={uid}><path d={MEGA_BODY_PATH} /></clipPath>
      </defs>
      {/* ekor heterocercal (berayun via prop swim) */}
      <g transform={`rotate(${swim} 800 224)`}>
        <path d="M795,210 C830,170 870,130 905,105 C915,118 905,150 880,185 C860,210 830,222 800,226 Z" fill={MEGA_BODY} />
        <path d="M795,238 C825,268 855,292 885,305 C892,292 880,262 855,240 C835,228 812,228 795,238 Z" fill={MEGA_FIN} />
      </g>
      {/* sirip punggung kedua + sirip dubur */}
      <path d="M645,172 C658,148 672,138 684,136 C690,148 688,166 682,178 Z" fill={MEGA_FIN} />
      <path d="M615,284 C632,302 648,302 658,292 C648,282 630,274 615,284 Z" fill={MEGA_FIN} />
      {/* badan */}
      <path d={MEGA_BODY_PATH} fill={MEGA_BODY} />
      {/* perut lebih terang (terpotong bentuk badan) */}
      <g clipPath={`url(#${uid})`}>
        <ellipse cx={430} cy={305} rx={330} ry={42} fill={MEGA_BELLY} opacity={0.55} />
        <ellipse cx={430} cy={150} rx={300} ry={26} fill={MEGA_DARK} opacity={0.25} />
      </g>
      {/* sirip punggung (tinggi, segitiga agak melengkung ke belakang) */}
      <path d="M395,132 C410,82 440,52 472,40 C488,58 494,96 490,132 Z" fill={MEGA_FIN} />
      {/* sirip dada (panjang, menyapu ke bawah-belakang) */}
      <path d="M330,272 C370,310 420,350 460,392 C430,398 380,368 345,312 C335,296 330,282 330,272 Z" fill={MEGA_FIN} />
      {/* celah insang */}
      {[235, 248, 261, 274, 287].map((gx) => (
        <path key={gx} d={`M${gx},182 C${gx + 7},205 ${gx + 7},228 ${gx - 1},248`} stroke={MEGA_DARK} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.6} />
      ))}
      {/* mata kecil */}
      <circle cx={158} cy={192} r={8} fill="#16221C" />
      <circle cx={161} cy={189} r={2.5} fill="#FFFFFF" opacity={0.9} />
      {/* celah mulut gelap (terlihat saat rahang membuka) */}
      <path d="M78,220 C150,228 220,236 275,240 L275,250 C200,246 130,238 82,226 Z" fill="#4A2323" opacity={jaw} />
      {/* gigi atas (menggantung dari garis rahang) */}
      {upperTeeth.map((tx, i) => {
        const ty = 218 + (tx - 78) * 0.11;
        return <path key={i} d={`M${tx},${ty} L${tx + 18},${ty + 2} L${tx + 9},${ty + 20} Z`} fill="#F5F1E8" stroke="#C9BFA8" strokeWidth={1.5} />;
      })}
      {/* rahang bawah (berputar di engsel 275,240) + gigi bawah */}
      <g transform={`rotate(${jaw * 22} 275 240)`}>
        <path d="M78,224 C140,232 210,238 275,240 L280,252 C220,262 140,258 92,240 C82,232 76,226 78,224 Z" fill={MEGA_DARK} />
        {lowerTeeth.map((tx, i) => {
          const ty = 238 + (tx - 112) * 0.05;
          return <path key={i} d={`M${tx},${ty} L${tx + 16},${ty + 1} L${tx + 8},${ty - 16} Z`} fill="#F5F1E8" stroke="#C9BFA8" strokeWidth={1.5} />;
        })}
      </g>
      {/* garis mulut */}
      <path d="M78,218 C150,226 220,236 275,240" stroke={MEGA_DARK} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.7} />
    </svg>
  );
};

/** Gigi megalodon tunggal — mahkota segitiga bergerigi (tepi zigzag),
    akar lebar dua lobus + pita bourlette. Dipakai sebagai hero visual S1/S6. */
const zigEdge = (x0: number, y0: number, x1: number, y1: number, n: number, out: number) => {
  const dx = (x1 - x0) / n, dy = (y1 - y0) / n;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const px = (-dy / len) * out, py = (dx / len) * out;
  let d = `M${x0},${y0}`;
  for (let i = 1; i <= n; i++) {
    const bx = x0 + dx * i, by = y0 + dy * i;
    const s = i % 2 === 0 ? 1 : -1;
    d += ` L${(bx + px * s).toFixed(1)},${(by + py * s).toFixed(1)}`;
  }
  return d;
};
export const ToothAsset: React.FC<{x: number; y: number; w: number; rot?: number; opacity?: number}> =
({x, y, w, rot = 0, opacity = 1}) => {
  const h = w * 380 / 300;
  const crown = zigEdge(150, 12, 252, 258, 12, 5) + ' L48,258 ' + zigEdge(48, 258, 150, 12, 12, -5).slice(1) + ' Z';
  return (
    <svg width={w} height={h} viewBox="0 0 300 380" style={{position: 'absolute', left: x, top: y, opacity, transform: rot ? `rotate(${rot}deg)` : undefined}}>
      {/* akar dua lobus */}
      <path d="M48,258 L252,258 L238,330 C210,352 90,352 62,330 Z" fill="#8A7B66" />
      {/* pita bourlette */}
      <path d="M60,262 L240,262 L232,282 L68,282 Z" fill="#6B5B45" />
      {/* mahkota bergerigi */}
      <path d={crown} fill="#F5F1E8" stroke="#D8CFB8" strokeWidth={2} />
    </svg>
  );
};

// ---------- Moon + Sun (from WHAT IF Bulan Tidak Pernah Ada?, 2026-11-18) ----------
// MoonAsset: purnama krem dengan kawah + bayangan sabit kanan (terminator).
// SunAsset: matahari amber dengan sinar segitiga (rays = jumlah sinar).
export const MoonAsset: React.FC<{x: number; y: number; d: number; glow?: boolean; opacity?: number}> =
({x, y, d, glow = false, opacity = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: d, height: d, opacity}}>
    {glow && <div style={{position: 'absolute', inset: -d * 0.25, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,246,222,0.55) 0%, rgba(255,246,222,0) 68%)'}} />}
    <svg width={d} height={d} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="190" fill="#FFF6DE" />
      <path d="M200 10 a190 190 0 0 1 0 380 a150 190 0 0 0 0 -380" fill="#E8DCC0" opacity={0.5} />
      <g fill="#D9CBA8">
        <circle cx="140" cy="130" r="34" />
        <circle cx="240" cy="100" r="22" />
        <circle cx="270" cy="210" r="42" />
        <circle cx="160" cy="250" r="26" />
        <circle cx="220" cy="300" r="18" />
        <circle cx="110" cy="200" r="14" />
      </g>
      <g fill="#C9B88F" opacity={0.7}>
        <circle cx="140" cy="130" r="22" />
        <circle cx="270" cy="210" r="28" />
      </g>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#E8DCC0" strokeWidth={4} opacity={0.6} />
    </svg>
  </div>
);

export const SunAsset: React.FC<{x: number; y: number; d: number; rays?: number; opacity?: number}> =
({x, y, d, rays = 12, opacity = 1}) => (
  <svg width={d} height={d} viewBox="0 0 200 200" style={{position: 'absolute', left: x, top: y, opacity}}>
    <g fill={AMBER_D}>
      {Array.from({length: rays}).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const x1 = 100 + Math.cos(a) * 62, y1 = 100 + Math.sin(a) * 62;
        const x2 = 100 + Math.cos(a - 0.10) * 92, y2 = 100 + Math.sin(a - 0.10) * 92;
        const x3 = 100 + Math.cos(a + 0.10) * 92, y3 = 100 + Math.sin(a + 0.10) * 92;
        return <polygon key={i} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} />;
      })}
    </g>
    <circle cx="100" cy="100" r="56" fill="#FFC93C" />
    <circle cx="100" cy="100" r="56" fill="none" stroke={AMBER_D} strokeWidth={4} opacity={0.6} />
  </svg>
);

// ---------- Snake / Titanoboa (from Titanoboa, Ular 13 Meter dari Rawa Purba, 2026-11-20) ----------
export const SNAKE_BODY = '#5A6B3F', SNAKE_DARK = '#2E3D24', SNAKE_BELLY = '#C9B98A', SNAKE_TONGUE = '#D96A5F';

/** Titanoboa — ular raksasa ala anakonda: badan hijau zaitun gelap, perut krem,
    bercak gelap di punggung, kepala pipih bermata kecil + lidah bercabang.
    pose 'glide': profil samping hadap kiri, badan bergelombang S (berenang);
    pose 'coil': tiga lilitan konsentris mengelilingi mangsa (mangsa digambar
    terpisah di scene, di bawah aset ini). swim = ayunan badan (derajat),
    tongue 0..1 = panjang lidah. Flat 100%. */
export const SnakeAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number; swim?: number; tongue?: number; pose?: 'glide' | 'coil'}> =
({x, y, w, flip, opacity = 1, swim = 0, tongue = 0.7, pose = 'glide'}) => {
  if (pose === 'coil') {
    const h = w;
    return (
      <svg width={w} height={h} viewBox="0 0 520 520" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
        {/* tiga lilitan konsentris — stroke tipis agar celah antar lilitan kebaca */}
        <ellipse cx={260} cy={280} rx={200} ry={150} fill="none" stroke={SNAKE_BODY} strokeWidth={38} />
        <ellipse cx={260} cy={280} rx={128} ry={96} fill="none" stroke={SNAKE_BODY} strokeWidth={38} />
        <ellipse cx={260} cy={280} rx={58} ry={44} fill="none" stroke={SNAKE_BODY} strokeWidth={38} />
        {/* bercak gelap di lilitan — posisi di atas garis lilitan */}
        {[[60, 280, 0], [460, 280, 0], [260, 430, 0], [120, 175, -30], [400, 175, 30], [132, 280, 0], [388, 280, 0], [260, 376, 0], [202, 280, 0], [318, 280, 0]].map(([bx, by, r], i) => (
          <ellipse key={i} cx={bx} cy={by} rx={24} ry={13} fill={SNAKE_DARK} opacity={0.7} transform={`rotate(${r} ${bx} ${by})`} />
        ))}
        {/* ujung ekor di tengah lilitan */}
        <path d="M246,252 L286,280 L246,308 Z" fill={SNAKE_BODY} />
        {/* kepala di atas lilitan luar, hadap kiri */}
        <g transform={`rotate(${swim} 260 130)`}>
          <path d="M170,122 C180,100 210,90 242,96 C268,101 280,118 274,136 C266,154 240,162 214,156 C190,150 164,140 170,122 Z" fill={SNAKE_BODY} />
          <path d="M174,138 C200,146 236,146 262,140" stroke={SNAKE_DARK} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
          <circle cx={212} cy={118} r={9} fill="#16221C" />
          <circle cx={215} cy={115} r={3} fill="#FFFFFF" opacity={0.9} />
          {tongue > 0 && (
            <g stroke={SNAKE_TONGUE} strokeWidth={4} strokeLinecap="round" opacity={tongue}>
              <path d={`M172,130 L${172 - 26 * tongue},${122 - 6 * tongue}`} />
              <path d={`M172,130 L${172 - 26 * tongue},${138 + 6 * tongue}`} />
            </g>
          )}
        </g>
      </svg>
    );
  }
  const h = (w * 280) / 920;
  const bodyD = 'M70,180 C190,90 310,250 450,170 C590,90 710,230 850,150';
  const blotches: [number, number, number][] = [[170, 140, -20], [290, 190, 15], [410, 180, -10], [530, 130, -15], [650, 170, 20], [770, 180, -5]];
  return (
    <svg width={w} height={h} viewBox="0 0 920 280" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      <g transform={`rotate(${swim} 460 160)`}>
        {/* badan bergelombang S */}
        <path d={bodyD} fill="none" stroke={SNAKE_BODY} strokeWidth={72} strokeLinecap="round" />
        {/* garis perut krem di tepi bawah badan */}
        <path d={bodyD} fill="none" stroke={SNAKE_BELLY} strokeWidth={20} strokeLinecap="round" opacity={0.4} transform="translate(0 22)" />
        {/* bercak gelap punggung */}
        {blotches.map(([bx, by, r], i) => (
          <ellipse key={i} cx={bx} cy={by} rx={26} ry={15} fill={SNAKE_DARK} opacity={0.7} transform={`rotate(${r} ${bx} ${by})`} />
        ))}
        {/* ekor meruncing */}
        <path d="M815,130 L898,150 L815,170 Z" fill={SNAKE_BODY} />
        {/* kepala pipih hadap kiri */}
        <path d="M18,172 C30,150 60,140 92,146 C118,151 128,168 122,186 C114,204 88,212 62,206 C38,200 16,190 18,172 Z" fill={SNAKE_BODY} />
        <path d="M22,188 C50,196 85,196 110,188" stroke={SNAKE_DARK} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
        <circle cx={62} cy={168} r={9} fill="#16221C" />
        <circle cx={65} cy={165} r={3} fill="#FFFFFF" opacity={0.9} />
        {tongue > 0 && (
          <g stroke={SNAKE_TONGUE} strokeWidth={4} strokeLinecap="round" opacity={tongue}>
            <path d={`M20,180 L${20 - 28 * tongue},${172 - 6 * tongue}`} />
            <path d={`M20,180 L${20 - 28 * tongue},${188 + 6 * tongue}`} />
          </g>
        )}
      </g>
    </svg>
  );
};

// ================= v1.18 additions (Uranus project, 2026-11-21) =================
// UranusAsset: cakram hijau pucat (metana) + sabuk samar + cincin tipis hampir
// vertikal (sumbu miring 98° — bidang cincin tegak lurus orbit). Warna dari
// deskripsi teleskop: "tiny green-hued disc" (BBC Sky at Night).
export const URANUS_DISC = '#A9D6C3', URANUS_BAND = '#8CC3AC', URANUS_DEEP = '#6FA98F';
export const UranusAsset: React.FC<{x: number; y: number; d: number; rings?: boolean; tilt?: number; opacity?: number}> =
({x, y, d, rings = true, tilt = 0, opacity = 1}) => (
  <svg width={d} height={d} viewBox="0 0 200 200" style={{position: 'absolute', left: x, top: y, opacity, transform: tilt ? `rotate(${tilt}deg)` : undefined}}>
    <defs>
      <clipPath id="uranClip"><circle cx="100" cy="100" r="86" /></clipPath>
    </defs>
    {/* cincin tipis (belakang) — sumbu hampir vertikal, tampak sebagai garis tipis */}
    {rings && <ellipse cx="100" cy="100" rx="106" ry="15" fill="none" stroke="#D8ECE1" strokeWidth="3" opacity="0.35" transform="rotate(78 100 100)" />}
    <circle cx="100" cy="100" r="86" fill={URANUS_DISC} />
    <g clipPath="url(#uranClip)">
      {/* sabuk samar */}
      <path d="M14 82 Q 100 68, 186 82 L 186 108 Q 100 122, 14 108 Z" fill={URANUS_BAND} opacity="0.55" />
      <path d="M14 128 Q 100 118, 186 128 L 186 146 Q 100 156, 14 146 Z" fill={URANUS_DEEP} opacity="0.35" />
      {/* highlight */}
      <ellipse cx="72" cy="60" rx="42" ry="24" fill="#FFFFFF" opacity="0.22" />
    </g>
    <circle cx="100" cy="100" r="86" fill="none" stroke="#5E8F78" strokeWidth="2" opacity="0.4" />
  </svg>
);

// ================= v1.19 additions (Badak Jawa project, 2026-11-21) =================
// RhinoAsset: badak Jawa (Rhinoceros sondaicus) profil samping hadap kiri —
// badan barel abu-abu/cokelat keabu-abuan + lipatan kulit seperti baju zirah
// (seams vertikal + shading pelat + semburat merah muda di lipatan), kepala
// rendah, bibir atas panjang meruncing (prehensile), telinga kecil, ekor
// pendek berumbai. Cula: SATU, kecil (prop horn) — jantan; betina pakai
// knob (tonjolan kecil) atau horn={false} — satu-satunya badak yang betina
// dewasanya rutin tanpa cula (Save the Rhino / IFAW / WorldAtlas).
export const RHINO_BODY = '#8A8378', RHINO_DARK = '#6E675C', RHINO_LIGHT = '#A39A8B',
  RHINO_HORN = '#7A6A58', RHINO_FOLD = '#5E574C', RHINO_PINK = '#C9A89A';
export const RhinoAsset: React.FC<{x: number; y: number; w: number; horn?: boolean; knob?: boolean; flip?: boolean; opacity?: number}> =
({x, y, w, horn = true, knob = false, flip = false, opacity = 1}) => {
  const h = (w * 520) / 920;
  return (
    <svg width={w} height={h} viewBox="0 0 920 520" style={{position: 'absolute', left: x, top: y, opacity, transform: flip ? 'scaleX(-1)' : undefined}}>
      {/* kaki belakang (lebih gelap, di belakang badan) */}
      <g fill={RHINO_DARK}>
        <path d="M370,395 L372,500 L436,500 L434,398 Z" />
        <path d="M690,395 L692,500 L756,500 L754,398 Z" />
      </g>
      {/* ekor pendek berumbai */}
      <path d="M802,295 C828,325 834,358 822,388" fill="none" stroke={RHINO_DARK} strokeWidth={16} strokeLinecap="round" />
      <ellipse cx={820} cy={398} rx={15} ry={24} fill={RHINO_DARK} />
      {/* badan barel — panjang & rendah */}
      <path d="M210,270 C200,200 270,165 390,160 C530,155 670,165 760,210 C815,240 832,305 808,360 C785,415 700,440 580,443 C450,446 320,442 258,412 C205,385 195,330 210,270 Z" fill={RHINO_BODY} />
      {/* shading pelat di antara lipatan */}
      <ellipse cx={460} cy={290} rx={75} ry={62} fill={RHINO_LIGHT} opacity={0.35} />
      <ellipse cx={600} cy={290} rx={75} ry={62} fill={RHINO_LIGHT} opacity={0.35} />
      <ellipse cx={530} cy={420} rx={260} ry={28} fill={RHINO_DARK} opacity={0.3} />
      <ellipse cx={490} cy={190} rx={220} ry={26} fill="#FFFFFF" opacity={0.1} />
      {/* lipatan kulit (seams vertikal) + semburat merah muda */}
      <g fill="none" stroke={RHINO_FOLD} strokeWidth={8} strokeLinecap="round" opacity={0.65}>
        <path d="M390,162 C372,240 368,325 386,435" />
        <path d="M530,158 C516,240 512,330 526,442" />
        <path d="M665,168 C655,245 655,332 668,438" />
      </g>
      <g fill="none" stroke={RHINO_PINK} strokeWidth={3} strokeLinecap="round" opacity={0.35}>
        <path d="M398,162 C380,240 376,325 394,435" />
        <path d="M538,158 C524,240 520,330 534,442" />
      </g>
      {/* kaki depan */}
      <g fill={RHINO_BODY}>
        <path d="M280,398 L282,500 L350,500 L348,400 Z" />
        <path d="M610,398 L612,500 L678,500 L676,400 Z" />
      </g>
      {/* kuku (hooves) */}
      <g fill="#3E3A33">
        <rect x={280} y={484} width={70} height={18} rx={6} />
        <rect x={368} y={484} width={70} height={18} rx={6} />
        <rect x={610} y={484} width={70} height={18} rx={6} />
        <rect x={688} y={484} width={70} height={18} rx={6} />
      </g>
      {/* kepala rendah — besar & jelas terpisah dari badan */}
      <path d="M225,245 C185,238 140,250 110,275 C85,295 65,320 62,342 C60,364 82,378 110,375 C145,371 180,360 205,342 C225,328 235,305 232,280 C230,262 228,250 225,245 Z" fill={RHINO_BODY} />
      {/* bibir atas panjang meruncing (prehensile) */}
      <path d="M62,340 L38,358 L66,362 Z" fill={RHINO_BODY} />
      <path d="M64,356 C86,364 112,362 132,352" fill="none" stroke={RHINO_DARK} strokeWidth={4} strokeLinecap="round" />
      {/* telinga */}
      <path d="M248,222 L234,172 L282,200 Z" fill={RHINO_BODY} stroke={RHINO_DARK} strokeWidth={3} strokeLinejoin="round" />
      {/* mata */}
      <circle cx={192} cy={298} r={10} fill="#16221C" />
      <circle cx={195} cy={295} r={3.5} fill="#FFFFFF" opacity={0.9} />
      {/* cula jantan: satu, jelas terlihat, di pangkal hidung */}
      {horn && <path d="M92,278 C96,252 100,232 106,212 C116,232 126,250 136,266 Z" fill={RHINO_HORN} />}
      {/* tonjolan kecil betina */}
      {knob && <ellipse cx={112} cy={262} rx={15} ry={10} fill={RHINO_HORN} />}
      {/* garis lipatan leher */}
      <path d="M238,258 C228,305 228,355 242,400" fill="none" stroke={RHINO_FOLD} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
    </svg>
  );
};

// ================= v1.20 additions (Betelgeuse Meledak Besok project, 2026-11-23) =================
// RedSupergiantAsset: cakram merah-oranye raksasa dengan bercak konveksi gelap
// (permukaan bergolak khas red supergiant) + pijar tepi. Warna: merah bata
// terang ke oranye, jauh lebih merah dari SunAsset (amber). pulse 0..1 =
// denyut pijar (dipakai saat "meledak"/terang benderang).
export const REDSG_BODY = '#D94F2B', REDSG_DEEP = '#A9321E', REDSG_HOT = '#F08A4B', REDSG_RIM = '#FFB35C';
export const RedSupergiantAsset: React.FC<{x: number; y: number; d: number; glow?: boolean; pulse?: number; opacity?: number}> =
({x, y, d, glow = false, pulse = 0, opacity = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: d, height: d, opacity}}>
    {glow && <div style={{position: 'absolute', inset: -d * 0.35, borderRadius: '50%',
      background: `radial-gradient(circle, rgba(255,120,60,${0.45 + pulse * 0.35}) 0%, rgba(255,120,60,0) 68%)`}} />}
    <svg width={d} height={d} viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="188" fill={REDSG_BODY} />
      <g fill={REDSG_DEEP} opacity="0.55">
        <ellipse cx="140" cy="130" rx="62" ry="48" transform="rotate(-18 140 130)" />
        <ellipse cx="270" cy="180" rx="52" ry="66" transform="rotate(24 270 180)" />
        <ellipse cx="180" cy="290" rx="70" ry="42" transform="rotate(8 180 290)" />
        <ellipse cx="300" cy="300" rx="40" ry="30" transform="rotate(-30 300 300)" />
      </g>
      <g fill={REDSG_HOT} opacity="0.5">
        <ellipse cx="230" cy="120" rx="46" ry="30" transform="rotate(12 230 120)" />
        <ellipse cx="120" cy="230" rx="36" ry="26" transform="rotate(-10 120 230)" />
        <ellipse cx="260" cy="260" rx="30" ry="22" transform="rotate(20 260 260)" />
      </g>
      <ellipse cx="150" cy="110" rx="70" ry="40" fill="#FFFFFF" opacity="0.14" />
      <circle cx="200" cy="200" r="188" fill="none" stroke={REDSG_RIM} strokeWidth={5} opacity={0.75 + pulse * 0.25} />
    </svg>
  </div>
);

// OrionAsset: rasi Orion sederhana — Betelgeuse (bahu kanan atas, merah besar),
// Bellatrix (bahu kiri atas), Rigel (kaki kanan bawah, biru-putih), Saiph
// (kaki kiri bawah), sabuk 3 bintang + garis rasi putus-putus. missing =
// Betelgeuse digambar sebagai outline putus-putus + tanda tanya (dipakai S6:
// "Orion kehilangan bahunya"). Koordinat relatif ke kotak w×h yang diberikan.
export const OrionAsset: React.FC<{x: number; y: number; w: number; h: number; missing?: boolean; opacity?: number; label?: boolean}> =
({x, y, w, h, missing = false, opacity = 1, label = false}) => {
  // posisi bintang dalam kotak 0..1000 × 0..1400 (skala ke w/h)
  const px = (v: number) => (v / 1000) * w;
  const py = (v: number) => (v / 1400) * h;
  const stars: [number, number, number, string, string][] = [
    [300, 180, 34, '#FF6B3D', 'BETELGEUSE'],
    [700, 180, 24, '#EAF4FF', 'BELLATRIX'],
    [430, 700, 18, '#EAF4FF', ''],
    [500, 760, 18, '#EAF4FF', ''],
    [570, 820, 18, '#EAF4FF', ''],
    [250, 1250, 30, '#BFE0FF', 'RIGEL'],
    [750, 1250, 22, '#EAF4FF', 'SAIPH'],
  ];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* garis rasi */}
        <g stroke="#FFEFC4" strokeWidth={3} strokeDasharray="12 10" opacity={0.5} fill="none">
          <line x1={px(300)} y1={py(180)} x2={px(700)} y2={py(180)} />
          <line x1={px(300)} y1={py(180)} x2={px(430)} y2={py(700)} />
          <line x1={px(700)} y1={py(180)} x2={px(570)} y2={py(820)} />
          <line x1={px(430)} y1={py(700)} x2={px(250)} y2={py(1250)} />
          <line x1={px(570)} y1={py(820)} x2={px(750)} y2={py(1250)} />
        </g>
        {stars.map(([sx, sy, r, col, name], i) => {
          if (i === 0 && missing) {
            return (
              <g key={i}>
                <circle cx={px(sx)} cy={py(sy)} r={r + 14} fill="none" stroke="#FFEFC4" strokeWidth={3} strokeDasharray="8 8" opacity={0.8} />
                <text x={px(sx)} y={py(sy) + 12} textAnchor="middle" fontFamily="Pop, sans-serif" fontWeight={900} fontSize={44} fill="#FFEFC4">?</text>
              </g>
            );
          }
          return (
            <g key={i}>
              <circle cx={px(sx)} cy={py(sy)} r={r + 12} fill={col} opacity={0.18} />
              <circle cx={px(sx)} cy={py(sy)} r={r} fill={col} />
            </g>
          );
        })}
      </svg>
      {label && (
        <>
          <div style={{position: 'absolute', left: px(300) - 110, top: py(180) - 92, width: 220, textAlign: 'center',
            fontFamily: 'Pop', fontWeight: 900, fontSize: 26, color: missing ? '#FFEFC4' : '#FF8A5C'}}>
            {missing ? 'BETELGEUSE?' : 'BETELGEUSE'}
          </div>
          <div style={{position: 'absolute', left: px(250) - 80, top: py(1250) + 46, width: 160, textAlign: 'center',
            fontFamily: 'Pop', fontWeight: 600, fontSize: 24, color: '#A8BFA9'}}>RIGEL</div>
        </>
      )}
    </div>
  );
};

// ================= v1.21 additions (Cendrawasih Papua project, 2026-11-25) =================
// SuperbBirdAsset: cendrawasih superb (Lophorina superba) jantan. display 0 =
// bertengger biasa (badan hitam kecil, mahkota + perisai biru kecil, kaki di
// dahan); display 1 = pose pajangan "wajah senyum" (jubah hitam mengembang
// jadi oval, dua bercak biru jadi "mata", perisai biru jadi "senyum").
// Warna: hitam super-black #0B0B14, biru elektrik #35D6FF (struktural).
// REVISI v1.22 (2026-11-25): pose pajangan dikurangi kesan "topeng melayang"
// (umpan balik user) — paruh kuning di antara mata, "senyum" jadi pita perisai
// dada lebar-datar (kerah, bukan busur mulut), kaki kurus di bawah oval, tepi
// bulu bergerigi halus, glow mata dikurangi.
export const SuperbBirdAsset: React.FC<{x: number; y: number; w: number; display?: number; hop?: number; plume?: string; opacity?: number}> =
({x, y, w, display = 0, hop = 0, plume = '#35D6FF', opacity = 1}) => {
  const d = Math.max(0, Math.min(1, display));
  const cape = 0.55 + 0.45 * d; // skala jubah
  const perchedO = Math.max(0, 1 - d * 1.8);
  const h = w * 1.1;
  return (
    <div style={{position: 'absolute', left: x, top: y - hop, width: w, height: h, opacity}}>
      <svg width={w} height={h} viewBox="0 0 400 440">
        {/* dahan */}
        <rect x={30} y={398} width={340} height={16} rx={8} fill="#5A4632" />
        {/* badan bertengger (memudar saat display naik) */}
        <g opacity={perchedO}>
          <ellipse cx={200} cy={310} rx={72} ry={92} fill="#0B0B14" />
          <circle cx={200} cy={198} r={50} fill="#0B0B14" />
          <ellipse cx={200} cy={168} rx={26} ry={12} fill={plume} />
          <ellipse cx={200} cy={278} rx={34} ry={46} fill={plume} opacity={0.9} />
          <path d="M246,192 L272,202 L246,212 Z" fill="#1A1A26" />
          <rect x={182} y={392} width={10} height={14} fill="#1A1A26" />
          <rect x={208} y={392} width={10} height={14} fill="#1A1A26" />
        </g>
        {/* jubah pajangan — oval hitam membesar (pusat naik supaya kaki muat) */}
        <g transform={`translate(200 205) scale(${cape}) translate(-200 -205)`}>
          <ellipse cx={200} cy={205} rx={168} ry={172} fill="#0B0B14" />
          {/* tepi bulu: garis putus-putus memberi gerigi halus, bukan lubang mulus */}
          <ellipse cx={200} cy={205} rx={170} ry={174} fill="none" stroke="#1E1E30" strokeWidth={14} strokeDasharray="3 11" opacity={0.85} />
          {/* kaki kurus — jangkar "ini burung, bukan topeng" */}
          <g opacity={d}>
            <line x1={176} y1={366} x2={172} y2={400} stroke="#3A2E22" strokeWidth={7} strokeLinecap="round" />
            <line x1={224} y1={366} x2={228} y2={400} stroke="#3A2E22" strokeWidth={7} strokeLinecap="round" />
            <line x1={172} y1={400} x2={160} y2={406} stroke="#3A2E22" strokeWidth={5} strokeLinecap="round" />
            <line x1={172} y1={400} x2={184} y2={406} stroke="#3A2E22" strokeWidth={5} strokeLinecap="round" />
            <line x1={228} y1={400} x2={216} y2={406} stroke="#3A2E22" strokeWidth={5} strokeLinecap="round" />
            <line x1={228} y1={400} x2={240} y2={406} stroke="#3A2E22" strokeWidth={5} strokeLinecap="round" />
          </g>
          {/* mata: dua bercak biru (glow dikurangi) */}
          <g opacity={d}>
            <ellipse cx={148} cy={148} rx={22} ry={30} fill={plume} />
            <ellipse cx={252} cy={148} rx={22} ry={30} fill={plume} />
            <ellipse cx={148} cy={148} rx={27} ry={34} fill={plume} opacity={0.12} />
            <ellipse cx={252} cy={148} rx={27} ry={34} fill={plume} opacity={0.12} />
            {/* paruh kuning kecil di antara mata */}
            <path d="M190,104 L210,104 L200,130 Z" fill="#F2C94C" />
            {/* perisai dada: pita LEBAR dan DATAR (kerah), bukan busur senyum */}
            <path d="M92,258 Q200,284 308,258 L308,282 Q200,308 92,282 Z" fill={plume} />
            <path d="M100,262 Q200,286 300,262" fill="none" stroke="#8FE9FF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
          </g>
        </g>
      </svg>
    </div>
  );
};

// FemaleBirdAsset: betina cendrawasih — cokelat polos (kontras jantan).
export const FemaleBirdAsset: React.FC<{x: number; y: number; w: number; flip?: boolean; opacity?: number}> =
({x, y, w, flip = false, opacity = 1}) => {
  const h = w * 0.75;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity,
      transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
      <svg width={w} height={h} viewBox="0 0 400 300">
        <rect x={20} y={268} width={360} height={14} rx={7} fill="#5A4632" />
        <ellipse cx={150} cy={220} rx={60} ry={26} fill="#6E5238" transform="rotate(-18 150 220)" />
        <ellipse cx={200} cy={180} rx={92} ry={72} fill="#8A6B4A" />
        <ellipse cx={205} cy={205} rx={68} ry={40} fill="#C9A97E" />
        <circle cx={272} cy={118} r={42} fill="#8A6B4A" />
        <path d="M308,112 L338,122 L308,132 Z" fill="#3A2E22" />
        <circle cx={284} cy={110} r={6} fill="#16221C" />
        <ellipse cx={170} cy={170} rx={52} ry={30} fill="#6E5238" transform="rotate(-12 170 170)" />
        <rect x={186} y={244} width={9} height={28} fill="#3A2E22" />
        <rect x={208} y={244} width={9} height={28} fill="#3A2E22" />
      </svg>
    </div>
  );
};

// AstrapiaAsset: astrapia ekor pita — badan hitam, kepala hijau metalik,
// dua pita ekor putih sangat panjang (sampai 1 meter pada jantan).
export const AstrapiaAsset: React.FC<{x: number; y: number; w: number; tail?: number; opacity?: number}> =
({x, y, w, tail = 1, opacity = 1}) => {
  const h = w * 2;
  const sway = (tail - 1) * 14;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity}}>
      <svg width={w} height={h} viewBox="0 0 400 800">
        {/* pita ekor putih */}
        <path d={`M178,238 C150,420 ${120 + sway},600 96,762`} fill="none" stroke="#F4F1E6" strokeWidth={15} strokeLinecap="round" />
        <path d={`M222,238 C250,420 ${280 - sway},600 306,772`} fill="none" stroke="#F4F1E6" strokeWidth={15} strokeLinecap="round" />
        <path d="M200,238 C200,420 196,560 192,700" fill="none" stroke="#1A1A26" strokeWidth={12} strokeLinecap="round" opacity={0.7} />
        {/* badan + kepala */}
        <ellipse cx={200} cy={160} rx={72} ry={92} fill="#0B0B14" />
        <circle cx={200} cy={72} r={42} fill="#0B0B14" />
        <ellipse cx={200} cy={88} rx={30} ry={18} fill="#1FA37A" />
        <path d="M238,66 L266,76 L238,86 Z" fill="#1A1A26" />
        <circle cx={214} cy={62} r={6} fill="#F4F1E6" />
      </svg>
    </div>
  );
};

// PlumeBirdAsset: cendrawasih genus Paradisaea (jantan) — kepala kuning,
// tenggorokan hijau zamrud, badan marun, kipas bulu sisi merah/emas + dua
// kawat ekor. Dipakai untuk adegan lek (beberapa jantan menari di satu pohon).
export const PlumeBirdAsset: React.FC<{x: number; y: number; w: number; plume?: string; flip?: boolean; opacity?: number}> =
({x, y, w, plume = '#E8483F', flip = false, opacity = 1}) => {
  const h = w * 0.9;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity,
      transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}>
      <svg width={w} height={h} viewBox="0 0 400 360">
        <rect x={20} y={318} width={360} height={14} rx={7} fill="#5A4632" />
        {/* kipas bulu sisi */}
        <g fill={plume} opacity={0.95}>
          <ellipse cx={120} cy={250} rx={26} ry={86} transform="rotate(28 120 250)" />
          <ellipse cx={96} cy={220} rx={22} ry={76} transform="rotate(40 96 220)" />
          <ellipse cx={146} cy={272} rx={24} ry={80} transform="rotate(14 146 272)" />
        </g>
        {/* kawat ekor */}
        <line x1={108} y1={252} x2={52} y2={330} stroke="#1A1A26" strokeWidth={5} strokeLinecap="round" />
        <line x1={122} y1={258} x2={78} y2={336} stroke="#1A1A26" strokeWidth={5} strokeLinecap="round" />
        {/* badan + kepala */}
        <ellipse cx={200} cy={220} rx={88} ry={68} fill="#7A3B2E" />
        <circle cx={262} cy={150} r={44} fill="#F2C94C" />
        <ellipse cx={246} cy={186} rx={30} ry={20} fill="#1FA37A" />
        <path d="M300,144 L330,154 L300,164 Z" fill="#3A2E22" />
        <circle cx={276} cy={142} r={6} fill="#16221C" />
        <ellipse cx={176} cy={212} rx={50} ry={30} fill="#5E2C22" transform="rotate(-10 176 212)" />
        <rect x={186} y={278} width={9} height={42} fill="#3A2E22" />
        <rect x={208} y={278} width={9} height={42} fill="#3A2E22" />
      </svg>
    </div>
  );
};
