import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, useCurrentFrame} from 'remotion';
import {C, CAIRO, M} from '../theme';
import {useEnter} from './motion';

/** Counts 0 → `to` in 1.2s (easeOutCubic), then pulses once. */
export const Counter: React.FC<{to: number; delay?: number; size?: number; color?: string; suffix?: string}> = ({
  to,
  delay = 0,
  size = 120,
  color = C.ink,
  suffix = '',
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + 36], [0, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const t = frame - delay - 36;
  const pulse = t > 0 && t < M.pulse ? 1 + Math.sin((t / M.pulse) * Math.PI) * 0.06 : 1;
  return (
    <div
      style={{
        fontFamily: CAIRO,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color,
        transform: `scale(${pulse})`,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {Math.round(v).toLocaleString('en-US')}
      {suffix}
    </div>
  );
};

/** Flat white card · radius 28 · 2px #E2E8F2 border. */
export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; delay?: number; from?: 'up' | 'right'}> = ({
  children,
  style,
  delay = 0,
  from = 'up',
}) => {
  const p = useEnter(delay, 16);
  const tr = from === 'up' ? `translateY(${(1 - p) * 60}px)` : `translateX(${(1 - p) * 140}px)`;
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 28,
        border: `2px solid ${C.line}`,
        padding: 36,
        boxSizing: 'border-box',
        opacity: Math.min(1, p * 1.4),
        transform: `${tr} scale(${0.92 + p * 0.08})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Flat depth: a solid offset block behind the content (brand rule: no shadows). */
export const Offset: React.FC<{children: React.ReactNode; color?: string; d?: number; radius?: number; style?: React.CSSProperties}> = ({
  children,
  color = C.yellow,
  d = 16,
  radius = 28,
  style,
}) => (
  <div style={{position: 'relative', ...style}}>
    <div style={{position: 'absolute', inset: 0, transform: `translate(${-d}px, ${d}px)`, background: color, borderRadius: radius}} />
    <div style={{position: 'relative'}}>{children}</div>
  </div>
);

/** Twinkling star field for the navy scenes. */
export const Stars: React.FC<{count?: number; seed?: string}> = ({count = 90, seed = 'stars'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const y = random(`${seed}y${i}`) * 1920;
        const r = 1.5 + random(`${seed}r${i}`) * 3.5;
        const ph = random(`${seed}p${i}`) * Math.PI * 2;
        const sp = 0.04 + random(`${seed}s${i}`) * 0.08;
        const o = 0.3 + (Math.sin(frame * sp + ph) * 0.5 + 0.5) * 0.5;
        return (
          <div
            key={i}
            style={{position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: '#fff', opacity: o}}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Horizontal marquee of pills. */
export const Ticker: React.FC<{items: string[]; speed?: number; color?: string; bg?: string; y: number}> = ({
  items,
  speed = 3,
  color = C.ink,
  bg = C.yellow,
  y,
}) => {
  const frame = useCurrentFrame();
  const row = [...items, ...items, ...items];
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, height: 96, overflow: 'hidden', background: bg}}>
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: 96,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          whiteSpace: 'nowrap',
          transform: `translateX(${(frame * speed) % 4000}px)`,
          fontFamily: CAIRO,
          fontWeight: 700,
          fontSize: 34,
          color,
        }}
      >
        {row.map((t, i) => (
          <React.Fragment key={i}>
            <span>{t}</span>
            <span style={{opacity: 0.5}}>✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/** Round avatar with a flat yellow ring. */
export const Avatar: React.FC<{src: string; size: number; ring?: string}> = ({src, size, ring = C.yellow}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      border: `${Math.max(4, size * 0.04)}px solid ${ring}`,
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}
  >
    <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
  </div>
);
