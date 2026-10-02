import React from 'react';
import {Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Counter} from '../components/Bits';
import {Caption} from '../components/Caption';
import {Halftone, Kicker, Mascot, MascotState, Paper, Tape} from '../components/Collage';
import {useProgress, useSnap} from '../components/motion';
import {C, CAIRO} from '../theme';

const PANEL = 150; // 6 × 5s = 30s

/** Board: zoom 1.15 → 1 (launch token) then holds; content clipped inside a flat card. */
const Board: React.FC<{children: React.ReactNode; top?: number; height?: number; tilt?: number}> = ({children, top = 560, height = 900, tilt = -1.2}) => {
  const z = useProgress(0, 19, Easing.out(Easing.cubic));
  return (
    <div style={{position: 'absolute', top, left: 60, right: 60, height, transform: `scale(${1.15 - 0.15 * z}) rotate(${tilt * z}deg)`, opacity: z}}>
      <div style={{position: 'absolute', inset: 0, transform: 'translate(-18px, 18px)', background: C.yellow, borderRadius: 40}} />
      <div style={{position: 'absolute', inset: 0, background: C.white, border: `6px solid ${C.ink}`, borderRadius: 40, overflow: 'hidden', fontFamily: CAIRO}}>
        {children}
      </div>
    </div>
  );
};

/** Pans a tall board image vertically: image scaled to `w`, from y0 to y1 (in scaled px). */
const Pan: React.FC<{src: string; w: number; y0: number; y1: number; x?: number; start?: number; dur?: number}> = ({src, w, y0, y1, x = 0, start = 10, dur = 130}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [start, start + dur], [y0, y1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return <Img src={staticFile(src)} style={{position: 'absolute', left: -x, top: -y, width: w}} />;
};

const Head: React.FC<{n: string; ar: string; en: string}> = ({n, ar, en}) => (
  <>
    <div style={{position: 'absolute', top: 262, width: '100%', textAlign: 'center'}}>
      <Kicker n={n} ar="Design System" bg={C.navy} color={C.white} />
    </div>
    <Caption ar={ar} en={en} delay={3} size={58} style={{position: 'absolute', top: 350, width: '100%'}} />
  </>
);

/* 6.1 · Colors — real Foundations board, colour section, + 60-30-10 bar */
const Colors: React.FC = () => {
  const p = useProgress(20, 30);
  return (
    <>
      <Head n="6.1" ar="ألوان بنظام 60-30-10" en="60-30-10 color system · 3 token layers" />
      <Board>
        <Pan src="ds/ds-foundations.webp" w={1900} y0={2150} y1={2620} x={20} />
      </Board>
      <div dir="ltr" style={{position: 'absolute', top: 1400, left: 110, right: 110, height: 110, display: 'flex', borderRadius: 26, overflow: 'hidden', border: `5px solid ${C.ink}`, transform: 'rotate(1.5deg)'}}>
        {[
          [60, C.surface, C.ink],
          [30, C.blue, C.white],
          [10, C.yellow, C.ink],
        ].map(([v, bg, fg], i) => (
          <div key={i} style={{width: `${(v as number) * p + (1 - p) * 33.3}%`, background: bg as string, display: 'grid', placeItems: 'center'}}>
            <Counter to={v as number} delay={20} size={46} color={fg as string} suffix="%" />
          </div>
        ))}
      </div>
    </>
  );
};

/* 6.2 · Type — real Typography board */
const Type: React.FC = () => {
  const big = useSnap(8);
  return (
    <>
      <Head n="6.2" ar="خط Cairo — عربي أولًا" en="Cairo — Arabic-first type scale" />
      <Board>
        <Pan src="ds/ds-type.webp" w={1900} y0={620} y1={2950} x={960} />
      </Board>
      <div style={{position: 'absolute', top: 1300, left: 90, transform: `scale(${big}) rotate(-6deg)`, background: C.yellow, border: `6px solid ${C.ink}`, borderRadius: 30, padding: '6px 34px'}}>
        <span style={{fontFamily: CAIRO, fontWeight: 800, fontSize: 120, color: C.ink}}>أب</span>
        <span dir="ltr" style={{fontFamily: CAIRO, fontWeight: 800, fontSize: 96, color: C.blue, marginLeft: 20}}>
          Aa 09
        </span>
      </div>
    </>
  );
};

/* 6.3 · Spacing & radius — Foundations board, top */
const Spacing: React.FC = () => (
  <>
    <Head n="6.3" ar="شبكة 4 بوينت: 2 · 4 · 8 · 12 … 48" en="4-point spacing grid · radius · stroke" />
    <Board>
      <Pan src="ds/ds-foundations.webp" w={1900} y0={380} y1={980} x={20} />
    </Board>
    <div dir="ltr" style={{position: 'absolute', top: 1420, left: 120, right: 120, display: 'flex', alignItems: 'flex-end', gap: 14}}>
      {[2, 4, 8, 12, 16, 20, 24, 32, 40, 48].map((v, i) => {
        const e = useSnap(14 + i * 3); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div key={v} style={{flex: 1, textAlign: 'center'}}>
            <div style={{height: v * 2 * e, background: i % 3 === 2 ? C.yellow : C.blue, borderRadius: 6, border: `3px solid ${C.ink}`}} />
            <div style={{fontFamily: CAIRO, fontWeight: 800, fontSize: 22, color: C.ink}}>{v}</div>
          </div>
        );
      })}
    </div>
  </>
);

/* 6.4 · Components — real button / card / HUD boards + counters */
const Components: React.FC = () => {
  const frame = useCurrentFrame();
  const items: {src: string; w: number; top: number; left: number; rot: number; d: number}[] = [
    {src: 'ds/ds-buttons.webp', w: 900, top: 760, left: 90, rot: -2, d: 6},
    {src: 'ds/ds-cards.webp', w: 900, top: 960, left: 90, rot: 1.5, d: 14},
    {src: 'ds/ds-hud.webp', w: 900, top: 1290, left: 90, rot: -1, d: 22},
  ];
  return (
    <>
      <Head n="6.4" ar="236 مجموعة مكوّنات + 104 مكوّن" en="236 component sets + 104 components" />
      <div dir="rtl" style={{position: 'absolute', top: 560, width: '100%', display: 'flex', justifyContent: 'center', gap: 60, fontFamily: CAIRO}}>
        <div style={{textAlign: 'center'}}>
          <Counter to={236} delay={6} size={110} color={C.blue} />
          <div style={{fontSize: 24, fontWeight: 700, color: C.ink}}>Component sets</div>
        </div>
        <div style={{textAlign: 'center'}}>
          <Counter to={104} delay={10} size={110} color={C.orange} />
          <div style={{fontSize: 24, fontWeight: 700, color: C.ink}}>Components</div>
        </div>
      </div>
      {items.map((it, i) => {
        const e = useSnap(it.d); // eslint-disable-line react-hooks/rules-of-hooks
        const drift = Math.sin((frame + i * 30) / 40) * 6;
        return (
          <div key={i} style={{position: 'absolute', top: it.top + drift, left: it.left, transform: `translateX(${(1 - e) * (i % 2 ? -1100 : 1100)}px) rotate(${it.rot}deg)`}}>
            <div style={{border: `5px solid ${C.ink}`, borderRadius: 24, overflow: 'hidden', background: C.white}}>
              <Img src={staticFile(it.src)} style={{width: it.w, display: 'block', ...(it.src.includes('hud') ? {height: 220, objectFit: 'cover', objectPosition: '0 30%'} : {})}} />
            </div>
            <Tape x={i % 2 ? 40 : 700} y={-20} w={120} rot={i % 2 ? -8 : 8} delay={it.d + 4} />
          </div>
        );
      })}
    </>
  );
};

/* 6.5 · Mascot — the real 12 states */
const moods: [MascotState, string][] = [
  ['idle', 'هادي'],
  ['ready', 'جاهز'],
  ['launch', 'منطلق'],
  ['flying', 'طاير'],
  ['thinking', 'بيفكّر'],
  ['challenge', 'متحدّي'],
  ['encouraging', 'مشجّع'],
  ['success', 'نجح'],
  ['completion', 'خلّص'],
  ['try-again', 'جرّب تاني'],
  ['calm', 'رايق'],
  ['locked', 'مقفول'],
];
const MascotPanel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Head n="6.5" ar="صاروخ عايش بـ12 حالة" en="A living rocket — 12 moods" />
      <Halftone x={300} y={700} w={500} h={700} color={C.yellow} />
      <div dir="rtl" style={{position: 'absolute', top: 600, left: 70, right: 70, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 26}}>
        {moods.map(([m, n], i) => {
          const e = useSnap(6 + i * 3); // eslint-disable-line react-hooks/rules-of-hooks
          const bob = Math.sin((frame + i * 11) / 10) * 7;
          return (
            <div key={m} style={{textAlign: 'center', transform: `scale(${e}) translateY(${bob}px) rotate(${(i % 3) - 1}deg)`}}>
              <Mascot state={m} size={170} sticker />
              <div style={{fontFamily: CAIRO, fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 2}}>{n}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* 6.6 · Icons, badges, stickers */
const Icons: React.FC = () => {
  const strips: {src: string; w: number; top: number; rot: number; d: number; scale?: number}[] = [
    {src: 'ds/ds-icons.webp', w: 1920, top: 640, rot: -1.5, d: 4},
    {src: 'ds/ds-badges.webp', w: 990, top: 940, rot: 2, d: 12},
    {src: 'ds/ds-stickers.webp', w: 490, top: 1130, rot: -3, d: 20},
  ];
  const frame = useCurrentFrame();
  return (
    <>
      <Head n="6.6" ar="أيقونات وشارات مرسومة مخصوص" en="Custom icons, badges & stickers" />
      {strips.map((s, i) => {
        const e = useSnap(s.d); // eslint-disable-line react-hooks/rules-of-hooks
        const pan = i === 0 ? interpolate(frame, [10, 140], [0, -960], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
        const scale = i === 0 ? 1 : i === 1 ? 0.95 : 1.6;
        return (
          <div key={i} style={{position: 'absolute', top: s.top, left: 60, right: 60, transform: `scale(${e}) rotate(${s.rot}deg)`}}>
            <div style={{background: C.white, border: `5px solid ${C.ink}`, borderRadius: 26, overflow: 'hidden', height: i === 0 ? 200 : i === 1 ? 120 : 220, position: 'relative'}}>
              <Img
                src={staticFile(s.src)}
                style={{position: 'absolute', top: '50%', left: i === 0 ? 0 : '50%', width: s.w * scale, transform: `translate(${i === 0 ? pan : -(s.w * scale) / 2}px, -50%)`}}
              />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 1400, right: 120}}>
        <Mascot state="success" size={150} sticker />
      </div>
    </>
  );
};

export const DesignSystem: React.FC = () => {
  const panels = [Colors, Type, Spacing, Components, MascotPanel, Icons];
  const frame = useCurrentFrame();
  const idx = Math.min(5, Math.floor(frame / PANEL));
  return (
    <Paper>
      {panels.map((P, i) => (
        <Sequence key={i} from={i * PANEL} durationInFrames={PANEL}>
          <P />
        </Sequence>
      ))}
      <div style={{position: 'absolute', top: 1525, width: '100%', display: 'flex', justifyContent: 'center', gap: 12, flexDirection: 'row-reverse'}}>
        {panels.map((_, i) => (
          <div key={i} style={{width: i === idx ? 46 : 14, height: 14, borderRadius: 7, background: i <= idx ? C.ink : C.line}} />
        ))}
      </div>
    </Paper>
  );
};
