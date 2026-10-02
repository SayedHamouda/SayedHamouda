import React from 'react';
import {Img, interpolate, useCurrentFrame} from 'remotion';
import {asset, C, CAIRO} from '../theme';

type ScreenProps = {
  /** path under /public, e.g. "screens/m-path.png" */
  src: string;
  /** label shown on the drawn placeholder when the export is missing */
  label: string;
  /** scroll from top to bottom between these frames (ScrollShot) */
  scroll?: [number, number];
  kind: 'mobile' | 'web';
  tint?: string;
};

/** Screen image that fills its frame; scrolls vertically when `scroll` is set. */
export const Screen: React.FC<ScreenProps> = ({src, label, scroll, kind, tint = C.blue}) => {
  const frame = useCurrentFrame();
  const url = asset(src);
  const y = scroll
    ? interpolate(frame, scroll, [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  if (url)
    return (
      <Img
        src={url}
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${y}%`, display: 'block'}}
      />
    );
  return <Placeholder label={label} kind={kind} tint={tint} />;
};

/** Drawn stand-in (header, hero, cards) so the cut works before the Figma exports land. */
const Placeholder: React.FC<{label: string; kind: 'mobile' | 'web'; tint: string}> = ({label, kind, tint}) => {
  const m = kind === 'mobile';
  const bar = (w: string, h = 18, c = C.line) => <div style={{width: w, height: h, borderRadius: h / 2, background: c}} />;
  return (
    <div
      dir="rtl"
      style={{
        width: '100%',
        height: '100%',
        background: C.surface,
        fontFamily: CAIRO,
        display: 'flex',
        flexDirection: 'column',
        gap: m ? 28 : 18,
        padding: m ? 44 : 28,
        boxSizing: 'border-box',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontWeight: 800, fontSize: m ? 40 : 26, color: C.ink}}>انطلاقة</div>
        <div style={{width: m ? 64 : 40, height: m ? 64 : 40, borderRadius: 99, background: C.yellow}} />
      </div>
      <div
        style={{
          background: tint,
          borderRadius: m ? 32 : 20,
          padding: m ? 36 : 24,
          color: C.white,
          fontWeight: 800,
          fontSize: m ? 46 : 30,
          lineHeight: 1.3,
          minHeight: m ? 260 : 130,
        }}
      >
        {label}
        <div style={{marginTop: 18, width: '50%', height: 14, borderRadius: 7, background: 'rgba(255,255,255,.45)'}} />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: m ? '1fr 1fr' : '1fr 1fr 1fr', gap: m ? 24 : 16}}>
        {[C.yellow, C.green, C.orange, C.purple, C.blue, C.yellow].slice(0, m ? 4 : 6).map((c, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              border: `3px solid ${C.line}`,
              borderRadius: m ? 28 : 16,
              padding: m ? 24 : 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{width: m ? 64 : 36, height: m ? 64 : 36, borderRadius: 16, background: c}} />
            {bar('80%', m ? 16 : 10)}
            {bar('55%', m ? 16 : 10)}
          </div>
        ))}
      </div>
      {bar('100%', m ? 88 : 48, C.yellow)}
    </div>
  );
};

/** Flat phone: 375×812 ×2, radius 56, 8px ink border, no shadow. `scale` shrinks the whole thing. */
export const PhoneFrame: React.FC<{scale?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  scale = 1,
  children,
  style,
}) => (
  <div style={{width: 750 * scale, height: 1624 * scale, ...style}}>
    <div
      style={{
        width: 750,
        height: 1624,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: 56,
        border: `8px solid ${C.ink}`,
        background: C.ink,
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div style={{position: 'absolute', inset: 0, borderRadius: 48, overflow: 'hidden', background: C.white}}>{children}</div>
      {/* notch */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          width: 200,
          height: 44,
          marginLeft: -100,
          borderRadius: 22,
          background: C.ink,
        }}
      />
    </div>
  </div>
);

/** Flat browser: 48px top bar with 3 dots, content 960 wide (1440 scaled). */
export const BrowserFrame: React.FC<{width?: number; height?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  width = 960,
  height = 640,
  children,
  style,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 24,
      border: `6px solid ${C.ink}`,
      background: C.white,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <div style={{height: 48, flex: 'none', background: C.ink, display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 20}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
        <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
      ))}
      <div style={{flex: 1, height: 24, margin: '0 24px 0 16px', borderRadius: 12, background: 'rgba(255,255,255,.12)'}} />
    </div>
    <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>{children}</div>
  </div>
);
