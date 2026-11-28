import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, staticFile, Easing, random} from 'remotion';

export const OUTRO_FRAMES = 90; // 3.0 s at 30 fps
const FPS = 30, W = 1080;
export const GREEN = '#1F2A24', BEIGE = '#FEE5B2', TINT1 = '#F6DC9E', TINT2 = '#EFCE8A', AMBER_D = '#DE920C', SAGE_D = '#4E6B5B', DOT = '#7A9484';
const clampO = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const spr = (frame: number, delay = 0, damping = 11, stiffness = 170) =>
  spring({frame: Math.max(0, frame - delay), fps: FPS, config: {damping, stiffness, mass: 0.7}});
const lin = (frame: number, a: number, b: number, from = 0, to = 1, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, b], [from, to], {...clampO, easing});

const Words: React.FC<{text: string; frame: number; delay: number; size: number; color: string}> = ({text, frame, delay, size, color}) => (
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: size * 0.24, fontFamily: 'Pop', fontWeight: 900, fontSize: size, lineHeight: 1.1, color}}>
    {text.split(' ').map((w, i) => {
      const p = spr(frame, delay + i * 3, 10, 190);
      return (
        <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12}}>
          <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 115}%) rotate(${(1 - p) * 5}deg)`}}>{w}</span>
        </span>
      );
    })}
  </div>
);

// Universal @sekejap.tahu end card. LOCKED 2026-11-06: headline + cta are FIXED defaults for every video — do NOT pass per-video overrides.
// background, logo, name and layout are locked brand identity.
export const Outro: React.FC<{headline?: string; cta?: string}> = ({
  headline = 'NONTON SEKEJAP, LANGSUNG TAHU',
  cta = 'Ikuti untuk fakta berikutnya',
}) => {
  const frame = useCurrentFrame();
  const [line1, line2] = headline.split(',').map((s) => s.trim());
  const logoP = spr(frame, 8, 9, 150);
  const breathe = 1 + 0.015 * Math.sin(Math.max(0, frame - 30) * 0.06);
  const glow = 0.10 + 0.05 * (0.5 + 0.5 * Math.sin(frame * 0.08));
  const dividerW = lin(frame, 44, 58, 0, 560);
  return (
    <AbsoluteFill style={{background: BEIGE, overflow: 'hidden'}}>
      <svg width={W} height={1920} style={{position: 'absolute'}}>
        <circle cx={40} cy={170} r={130} fill={TINT1} opacity={0.55} />
        <circle cx={1010} cy={1700} r={210} fill={TINT1} opacity={0.5} />
        <circle cx={950} cy={240} r={80} fill={TINT2} opacity={0.45} />
        {Array.from({length: 46}).map((_, i) => (
          <circle key={i} cx={random(`ox${i}`) * W} cy={random(`oy${i}`) * 1920} r={1.6 + random(`or${i}`) * 2.4} fill={DOT} opacity={0.16 + 0.14 * Math.abs(Math.sin(frame * 0.03 + i))} />
        ))}
        {/* sparkle burst around the logo as it lands */}
        {Array.from({length: 10}).map((_, i) => {
          const a = (i / 10) * Math.PI * 2 + 0.35;
          const d = lin(frame, 14, 34, 40, 330, Easing.out(Easing.cubic));
          const o = lin(frame, 14, 34, 0.95, 0);
          return <circle key={`s${i}`} cx={540 + Math.cos(a) * d} cy={905 + Math.sin(a) * d} r={5.5} fill={AMBER_D} opacity={o} />;
        })}
      </svg>
      <div style={{position: 'absolute', top: 905 - 330, left: 540 - 330, width: 660, height: 660, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,201,60,${glow}) 0%, rgba(255,201,60,0) 68%)`}} />

      <div style={{position: 'absolute', top: 235, width: W, padding: '0 70px', boxSizing: 'border-box'}}>
        <Words text={line1} frame={frame} delay={0} size={82} color={GREEN} />
        {line2 && <div style={{marginTop: 2}}><Words text={line2} frame={frame} delay={7} size={82} color={AMBER_D} /></div>}
      </div>

      <div style={{position: 'absolute', top: 690, left: (W - 430) / 2, width: 430, height: 430, borderRadius: '50%', overflow: 'hidden', border: `5px solid rgba(222,146,12,0.9)`, boxSizing: 'border-box', transform: `scale(${logoP * breathe})`, opacity: logoP}}>
        <Img src={staticFile('logo.png')} style={{width: 420, height: 420}} />
      </div>

      <div style={{position: 'absolute', top: 1185, width: W}}>
        <Words text="Sekejap Tahu" frame={frame} delay={26} size={94} color={GREEN} />
      </div>
      <div style={{position: 'absolute', top: 1330, width: W, opacity: lin(frame, 38, 48), transform: `translateY(${lin(frame, 38, 48, 26, 0)}px)`}}>
        <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 47, color: GREEN, textAlign: 'center'}}>{cta}</div>
      </div>
      <div style={{position: 'absolute', top: 1450, left: (W - 560) / 2, width: dividerW, height: 4, background: AMBER_D, borderRadius: 2}} />
      <div style={{position: 'absolute', top: 1490, width: W, opacity: lin(frame, 50, 60)}}>
        <div style={{fontFamily: 'Pop', fontWeight: 600, fontSize: 38, letterSpacing: 2, color: SAGE_D, textAlign: 'center'}}>@sekejap.tahu</div>
      </div>

      <AbsoluteFill style={{background: BEIGE, opacity: lin(frame, 197, 207), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
