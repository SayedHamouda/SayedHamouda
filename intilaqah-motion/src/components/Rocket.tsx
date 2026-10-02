import React from 'react';
import {Img} from 'remotion';
import {asset, C} from '../theme';

export type Mood =
  | 'happy'
  | 'launch'
  | 'wink'
  | 'proud'
  | 'think'
  | 'sleepy'
  | 'wow'
  | 'cheer'
  | 'calm'
  | 'focus'
  | 'love'
  | 'almost';

type Props = {size?: number; mood?: Mood; flame?: number; style?: React.CSSProperties; body?: string};

const Eyes: React.FC<{mood: Mood}> = ({mood}) => {
  const k = C.ink;
  switch (mood) {
    case 'wink':
      return (
        <>
          <circle cx="88" cy="96" r="6" fill={k} />
          <path d="M106 96 q6 -6 12 0" stroke={k} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'sleepy':
    case 'calm':
      return (
        <>
          <path d="M82 97 q6 5 12 0" stroke={k} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M106 97 q6 5 12 0" stroke={k} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'cheer':
    case 'proud':
      return (
        <>
          <path d="M82 99 q6 -8 12 0" stroke={k} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M106 99 q6 -8 12 0" stroke={k} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'love':
      return (
        <>
          <path d="M88 101 l-6 -6 a3.5 3.5 0 0 1 6 -4 a3.5 3.5 0 0 1 6 4z" fill={C.orange} />
          <path d="M112 101 l-6 -6 a3.5 3.5 0 0 1 6 -4 a3.5 3.5 0 0 1 6 4z" fill={C.orange} />
        </>
      );
    case 'wow':
      return (
        <>
          <circle cx="88" cy="96" r="8" fill={k} />
          <circle cx="112" cy="96" r="8" fill={k} />
          <circle cx="90" cy="93" r="2.5" fill="#fff" />
          <circle cx="114" cy="93" r="2.5" fill="#fff" />
        </>
      );
    case 'focus':
    case 'think':
      return (
        <>
          <rect x="82" y="93" width="12" height="6" rx="3" fill={k} />
          <rect x="106" y="93" width="12" height="6" rx="3" fill={k} />
        </>
      );
    default:
      return (
        <>
          <circle cx="88" cy="96" r="6" fill={k} />
          <circle cx="112" cy="96" r="6" fill={k} />
          <circle cx="90" cy="94" r="2" fill="#fff" />
          <circle cx="114" cy="94" r="2" fill="#fff" />
        </>
      );
  }
};

const Mouth: React.FC<{mood: Mood}> = ({mood}) => {
  const k = C.ink;
  if (mood === 'wow') return <ellipse cx="100" cy="116" rx="6" ry="7" fill={k} />;
  if (mood === 'think' || mood === 'focus' || mood === 'almost')
    return <path d="M92 116 h16" stroke={k} strokeWidth="4" strokeLinecap="round" />;
  if (mood === 'sleepy') return <circle cx="100" cy="116" r="3.5" fill={k} />;
  if (mood === 'cheer' || mood === 'launch')
    return <path d="M88 110 q12 16 24 0z" fill={k} />;
  return <path d="M90 112 q10 10 20 0" stroke={k} strokeWidth="4" fill="none" strokeLinecap="round" />;
};

/** Flat rocket mascot. Uses the exported Figma mascot when present, else this drawn version. */
export const Rocket: React.FC<Props> = ({size = 220, mood = 'happy', flame = 1, style, body = C.white}) => {
  const src = mood === 'launch' ? asset('brand/asset-mascot-launch.svg') ?? asset('brand/asset-mascot-launch.png') : null;
  if (src) return <Img src={src} style={{width: size, height: size * 1.4, objectFit: 'contain', ...style}} />;
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{overflow: 'visible', ...style}}>
      {/* flame */}
      <g style={{transformOrigin: '100px 215px', transform: `scaleY(${flame})`}}>
        <path d="M76 212 Q100 290 124 212z" fill={C.orange} />
        <path d="M86 212 Q100 262 114 212z" fill={C.yellow} />
      </g>
      {/* fins */}
      <path d="M58 150 L26 206 L64 200z" fill={C.orange} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      <path d="M142 150 L174 206 L136 200z" fill={C.orange} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      {/* body */}
      <path
        d="M100 12 C150 50 156 130 140 214 L60 214 C44 130 50 50 100 12z"
        fill={body}
        stroke={C.ink}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M100 12 C122 28 134 46 140 64 L60 64 C66 46 78 28 100 12z" fill={C.blue} stroke={C.ink} strokeWidth="6" strokeLinejoin="round" />
      <rect x="62" y="186" width="76" height="14" fill={C.yellow} stroke={C.ink} strokeWidth="5" />
      {/* face window */}
      <circle cx="100" cy="104" r="34" fill={C.yellow} stroke={C.ink} strokeWidth="6" />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
      {mood === 'love' || mood === 'proud' ? (
        <>
          <circle cx="78" cy="112" r="5" fill={C.orange} opacity="0.6" />
          <circle cx="122" cy="112" r="5" fill={C.orange} opacity="0.6" />
        </>
      ) : null}
    </svg>
  );
};

/** Wordmark: exported logo when present, else a typographic lockup. */
export const Logo: React.FC<{size?: number; color?: string}> = ({size = 120, color = C.white}) => {
  const src = asset('brand/logo-intilaqah.svg') ?? asset('brand/logo-intilaqah.png');
  if (src) return <Img src={src} style={{height: size, objectFit: 'contain'}} />;
  return (
    <div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: size * 0.18}}>
      <div
        style={{
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: size * 0.24,
          background: C.yellow,
          border: `${Math.max(4, size * 0.05)}px solid ${C.ink}`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Rocket size={size * 0.48} mood="launch" />
      </div>
      <div style={{fontSize: size * 0.95, fontWeight: 800, color, lineHeight: 1}}>انطلاقة</div>
    </div>
  );
};
