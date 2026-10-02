import React from 'react';
import {Easing, Img, interpolate, useCurrentFrame} from 'remotion';
import {asset, C} from '../theme';

/** Screen image; `scroll` pans a tall export from top to bottom between two frames. */
export const Screen: React.FC<{name: string; scroll?: [number, number]; pos?: string}> = ({name, scroll, pos}) => {
  const frame = useCurrentFrame();
  const url = asset(`screens/${name}.webp`);
  const y = scroll
    ? interpolate(frame, scroll, [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)})
    : 0;
  if (!url) return <div style={{width: '100%', height: '100%', background: C.line}} />;
  return (
    <Img
      src={url}
      style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos ?? `50% ${y}%`, display: 'block'}}
    />
  );
};

/** Flat phone: 375×844 @2x = 750×1688, radius 56, ink border, no shadow. */
export const PhoneFrame: React.FC<{scale?: number; children: React.ReactNode; style?: React.CSSProperties; bezel?: number}> = ({
  scale = 1,
  children,
  style,
  bezel = 12,
}) => (
  <div style={{width: (750 + bezel * 2) * scale, height: (1688 + bezel * 2) * scale, ...style}}>
    <div
      style={{
        width: 750 + bezel * 2,
        height: 1688 + bezel * 2,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: 64,
        background: C.ink,
        padding: bezel,
        boxSizing: 'border-box',
      }}
    >
      <div style={{width: 750, height: 1688, borderRadius: 54, overflow: 'hidden', position: 'relative', background: C.white}}>{children}</div>
    </div>
  </div>
);

/** Flat browser: ink top bar with 3 dots; content keeps the 1440 aspect. */
export const BrowserFrame: React.FC<{width?: number; height?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  width = 960,
  height,
  children,
  style,
}) => {
  const h = height ?? Math.round((width - 12) * (1024 / 1440)) + 46 + 12;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: 22,
        border: `6px solid ${C.ink}`,
        background: C.white,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{height: 40, flex: 'none', background: C.ink, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16}}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 13, height: 13, borderRadius: 7, background: c}} />
        ))}
        <div style={{flex: 1, height: 20, margin: '0 18px 0 12px', borderRadius: 10, background: 'rgba(255,255,255,.14)'}} />
      </div>
      <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</div>
    </div>
  );
};

export type Shot = {name: string; dur: number; scroll?: boolean};

/**
 * Plays shots back to back inside a frame. Each new shot pushes in from the right
 * (RTL reading direction) over 8 frames with a slight scale, the old one slides out.
 */
export const Cycle: React.FC<{shots: Shot[]; offset?: number}> = ({shots, offset = 0}) => {
  const frame = useCurrentFrame() - offset;
  let at = 0;
  const spans = shots.map((s) => {
    const a = at;
    at += s.dur;
    return [a, at] as const;
  });
  return (
    <>
      {shots.map((sh, i) => {
        const [a, b] = spans[i];
        if (frame < a - 8 || frame > b + 8) return null;
        const inP = i === 0 ? 1 : interpolate(frame, [a - 8, a], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const last = i === shots.length - 1;
        const outP = last ? 0 : interpolate(frame, [b - 8, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
        const x = (1 - inP) * 100 - outP * 35;
        return (
          <div
            key={`${sh.name}${i}`}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateX(${x}%) scale(${1 - outP * 0.08})`,
              opacity: 1 - outP * 0.6,
              zIndex: i,
            }}
          >
            <Screen name={sh.name} scroll={sh.scroll ? [a + offset + 6, b + offset - 4] : undefined} />
          </div>
        );
      })}
    </>
  );
};
