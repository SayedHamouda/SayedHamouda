import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {asset, C, CAIRO} from '../theme';
import {useEnter} from './motion';

export type MascotState =
  | 'calm'
  | 'challenge'
  | 'completion'
  | 'encouraging'
  | 'flying'
  | 'idle'
  | 'launch'
  | 'locked'
  | 'ready'
  | 'success'
  | 'thinking'
  | 'try-again';

/** The real Figma mascot (Asset / Mascot › state), 140×180 ratio. Flat white sticker outline, no shadow. */
export const Mascot: React.FC<{state: MascotState; size?: number; sticker?: boolean; style?: React.CSSProperties}> = ({
  state,
  size = 200,
  sticker = false,
  style,
}) => {
  const o = Math.max(3, size * 0.025);
  const outline = sticker
    ? `drop-shadow(${o}px 0 0 #fff) drop-shadow(-${o}px 0 0 #fff) drop-shadow(0 ${o}px 0 #fff) drop-shadow(0 -${o}px 0 #fff)`
    : undefined;
  return (
    <Img
      src={staticFile(`mascot/${state}.png`)}
      style={{width: size, height: (size * 180) / 140, objectFit: 'contain', filter: outline, ...style}}
    />
  );
};

/** Real wordmark from Asset / Logo (white | blue | navy glyph). */
export const LogoMark: React.FC<{size?: number; glyph?: 'white' | 'blue' | 'navy'}> = ({size = 200, glyph = 'white'}) => (
  <Img src={staticFile(`brand/logo-${glyph}.png`)} style={{width: size, height: (size * 660) / 460, objectFit: 'contain'}} />
);

/** Grid-paper surface (collage base). */
export const Paper: React.FC<{color?: string; line?: string; cell?: number; children?: React.ReactNode}> = ({
  color = C.surface,
  line = 'rgba(25,118,210,.08)',
  cell = 54,
  children,
}) => (
  <AbsoluteFill
    style={{
      background: color,
      backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
      backgroundSize: `${cell}px ${cell}px`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Halftone dot patch. */
export const Halftone: React.FC<{x: number; y: number; w: number; h: number; color?: string; dot?: number; style?: React.CSSProperties}> = ({
  x,
  y,
  w,
  h,
  color = C.yellow,
  dot = 7,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      backgroundImage: `radial-gradient(${color} ${dot / 2}px, transparent ${dot / 2 + 0.5}px)`,
      backgroundSize: `${dot * 2.4}px ${dot * 2.4}px`,
      WebkitMaskImage: 'radial-gradient(closest-side, #000 40%, transparent 100%)',
      maskImage: 'radial-gradient(closest-side, #000 40%, transparent 100%)',
      ...style,
    }}
  />
);

/** Masking-tape strip. */
export const Tape: React.FC<{x: number; y: number; w?: number; rot?: number; color?: string; delay?: number}> = ({
  x,
  y,
  w = 170,
  rot = -8,
  color = 'rgba(252,194,8,.82)',
  delay = 0,
}) => {
  const p = useEnter(delay, 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w * p,
        height: 46,
        background: color,
        transform: `rotate(${rot}deg)`,
        transformOrigin: 'left center',
        clipPath: 'polygon(0 6%, 4% 0, 9% 8%, 14% 0, 100% 0, 100% 100%, 95% 92%, 90% 100%, 0 100%)',
      }}
    />
  );
};

/** Torn paper edge (horizontal), drawn as a jagged SVG band. */
export const Torn: React.FC<{y: number; color: string; flip?: boolean; seed?: string; height?: number}> = ({
  y,
  color,
  flip = false,
  seed = 'torn',
  height = 60,
}) => {
  const pts: string[] = [];
  const n = 36;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 1080},${10 + random(`${seed}${i}`) * (height - 20)}`);
  const d = `M0,${height + 400} L0,${pts[0].split(',')[1]} L${pts.join(' L')} L1080,${height + 400} Z`;
  return (
    <svg width={1080} height={height + 400} style={{position: 'absolute', left: 0, top: y, transform: flip ? 'scaleY(-1)' : undefined}}>
      <path d={d} fill={color} />
    </svg>
  );
};

/** Chapter kicker pill (e.g. «04 · الدرس»). */
export const Kicker: React.FC<{n?: string; ar: string; en?: string; delay?: number; color?: string; bg?: string; style?: React.CSSProperties}> = ({
  n,
  ar,
  en,
  delay = 0,
  color = C.ink,
  bg = C.yellow,
  style,
}) => {
  const p = useEnter(delay, 13);
  return (
    <div
      dir="rtl"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '10px 26px',
        borderRadius: 999,
        background: bg,
        color,
        fontFamily: CAIRO,
        fontWeight: 800,
        fontSize: 30,
        transform: `scale(${p}) rotate(${(1 - p) * -6}deg)`,
        border: `4px solid ${C.ink}`,
        ...style,
      }}
    >
      {n ? <span style={{opacity: 0.55}}>{n}</span> : null}
      <span>{ar}</span>
      {en ? (
        <span dir="ltr" style={{fontWeight: 600, fontSize: 22, opacity: 0.6}}>
          {en}
        </span>
      ) : null}
    </div>
  );
};

/** Screenshot as a flat cut-out card (no device chrome) with ink border. */
export const Cutout: React.FC<{
  src: string;
  w: number;
  h?: number;
  radius?: number;
  border?: number;
  fit?: 'cover' | 'contain';
  pos?: string;
  style?: React.CSSProperties;
}> = ({src, w, h, radius = 28, border = 5, fit = 'cover', pos = '50% 0%', style}) => {
  const url = asset(src);
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        border: `${border}px solid ${C.ink}`,
        overflow: 'hidden',
        background: C.white,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {url ? <Img src={url} style={{width: '100%', height: h ? '100%' : 'auto', objectFit: fit, objectPosition: pos, display: 'block'}} /> : null}
    </div>
  );
};

/** Tiny confetti burst made of brand-coloured flat shapes. */
export const Confetti: React.FC<{x: number; y: number; start: number; count?: number; spread?: number; seed?: string}> = ({
  x,
  y,
  start,
  count = 22,
  spread = 380,
  seed = 'c',
}) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / 30;
  if (t < 0 || t > 1.6) return null;
  const cols = [C.yellow, C.orange, C.green, C.blue, C.purple];
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = spread * (0.5 + random(`${seed}v${i}`) * 0.6);
        const px = x + Math.cos(a) * v * t;
        const py = y + Math.sin(a) * v * t + 420 * t * t;
        const s = 10 + random(`${seed}s${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: s,
              height: s * (i % 3 === 0 ? 1 : 0.45),
              borderRadius: i % 3 === 0 ? s : 2,
              background: cols[i % cols.length],
              transform: `rotate(${t * 720 * (i % 2 ? 1 : -1)}deg)`,
              opacity: 1 - Math.max(0, t - 1.1) * 2,
            }}
          />
        );
      })}
    </>
  );
};
