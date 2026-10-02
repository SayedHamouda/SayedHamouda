import React from 'react';
import {CAIRO, C} from '../theme';
import {useEnter} from './motion';

type Props = {
  ar: React.ReactNode;
  en?: React.ReactNode;
  delay?: number;
  color?: string;
  enColor?: string;
  align?: 'right' | 'center';
  size?: number; // Arabic size; English = 0.53× (64 → 34)
  weight?: number;
  style?: React.CSSProperties;
};

/** Arabic headline (Cairo 800 · 64) with a smaller English line under it. Slide-up 24px + fade. */
export const Caption: React.FC<Props> = ({
  ar,
  en,
  delay = 0,
  color = C.ink,
  enColor,
  align = 'center',
  size = 64,
  weight = 800,
  style,
}) => {
  const p = useEnter(delay);
  const p2 = useEnter(delay + 4);
  return (
    <div style={{fontFamily: CAIRO, textAlign: align, ...style}}>
      <div
        dir="rtl"
        style={{
          fontSize: size,
          fontWeight: weight,
          lineHeight: 1.35,
          color,
          opacity: p,
          transform: `translateY(${(1 - p) * 24}px)`,
        }}
      >
        {ar}
      </div>
      {en ? (
        <div
          dir="ltr"
          style={{
            fontSize: Math.round(size * 0.53),
            fontWeight: 500,
            lineHeight: 1.4,
            marginTop: 10,
            color: enColor ?? color,
            opacity: p2 * 0.7,
            transform: `translateY(${(1 - p2) * 24}px)`,
          }}
        >
          {en}
        </div>
      ) : null}
    </div>
  );
};
