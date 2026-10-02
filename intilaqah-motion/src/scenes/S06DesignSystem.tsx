import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Counter} from '../components/Bits';
import {Caption} from '../components/Caption';
import {useEnter, useProgress} from '../components/motion';
import {Mood, Rocket} from '../components/Rocket';
import {asset, C, CAIRO} from '../theme';

const PANEL = 200; // 6 panels × 200f = 40s

/** Panel shell: zoom 1.15 → 1 over the launch token, flat white board with ink border. */
const Board: React.FC<{children: React.ReactNode; img?: string}> = ({children, img}) => {
  const z = useProgress(0, 19);
  const url = img ? asset(img) : null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 560,
        left: 70,
        right: 70,
        height: 980,
        transform: `scale(${1.15 - 0.15 * z})`,
        opacity: z,
      }}
    >
      <div style={{position: 'absolute', inset: 0, transform: 'translate(-18px, 18px)', background: C.yellow, borderRadius: 40}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: C.white,
          border: `6px solid ${C.ink}`,
          borderRadius: 40,
          overflow: 'hidden',
          padding: 48,
          boxSizing: 'border-box',
          fontFamily: CAIRO,
        }}
      >
        {url ? <Img src={url} style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : children}
      </div>
    </div>
  );
};

const Head: React.FC<{ar: string; en: string}> = ({ar, en}) => (
  <Caption ar={ar} en={en} delay={2} size={60} style={{position: 'absolute', top: 280, width: '100%'}} />
);

/* 6.1 Colors */
const Colors: React.FC = () => {
  const p = useProgress(16, 40);
  const swatches = [
    ['أصفر رئيسي', C.yellow],
    ['أزرق رئيسي', C.blue],
    ['كحلي', C.navy],
    ['سطح فاتح', C.surface],
    ['برتقالي', C.orange],
    ['أخضر', C.green],
    ['بنفسجي', C.purple],
    ['نص غامق', C.ink],
  ];
  return (
    <>
      <Head ar="ألوان بنظام 60-30-10" en="60-30-10 color system" />
      <Board img="ds/ds-colors.png">
        <div dir="ltr" style={{display: 'flex', height: 150, borderRadius: 24, overflow: 'hidden', border: `4px solid ${C.ink}`}}>
          {[
            [60, C.surface, C.ink],
            [30, C.blue, C.white],
            [10, C.yellow, C.ink],
          ].map(([v, bg, fg], i) => (
            <div
              key={i}
              style={{
                width: `${(v as number) * p + (1 - p) * 33.3}%`,
                background: bg as string,
                color: fg as string,
                display: 'grid',
                placeItems: 'center',
                fontSize: 40,
                fontWeight: 800,
              }}
            >
              <Counter to={v as number} delay={16} size={44} color={fg as string} suffix="%" />
            </div>
          ))}
        </div>
        <div dir="rtl" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 40}}>
          {swatches.map(([n, c], i) => {
            const e = useEnter(30 + i * 4, 14); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div key={c} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: e, transform: `translateY(${(1 - e) * 20}px)`}}>
                <div style={{width: 96, height: 96, borderRadius: 24, background: c, border: `3px solid ${C.line}`, flex: 'none'}} />
                <div>
                  <div style={{fontSize: 30, fontWeight: 700, color: C.ink}}>{n}</div>
                  <div dir="ltr" style={{fontSize: 24, fontWeight: 500, color: C.ink, opacity: 0.6, textAlign: 'right'}}>
                    {c}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Board>
    </>
  );
};

/* 6.2 Type */
const Type: React.FC = () => {
  const rows: [number, number, string][] = [
    [800, 72, 'Display · 72'],
    [700, 52, 'H1 · 52'],
    [600, 40, 'H2 · 40'],
    [500, 30, 'Body · 30'],
    [400, 24, 'Caption · 24'],
  ];
  return (
    <>
      <Head ar="خط Cairo — عربي أولًا" en="Cairo — Arabic-first type" />
      <Board img="ds/ds-type.png">
        <div dir="rtl" style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `3px solid ${C.line}`, paddingBottom: 20}}>
          <div style={{fontSize: 200, fontWeight: 800, color: C.ink, lineHeight: 1}}>أب</div>
          <div dir="ltr" style={{fontSize: 150, fontWeight: 800, color: C.blue, lineHeight: 1}}>
            Aa
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
          {rows.map(([w, sz, label], i) => {
            const e = useEnter(18 + i * 6, 14); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div key={i} dir="rtl" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: e, transform: `translateX(${(1 - e) * 60}px)`}}>
                <div style={{fontSize: sz, fontWeight: w, color: C.ink, lineHeight: 1.3}}>انطلاقة نحو الإتقان</div>
                <div dir="ltr" style={{fontSize: 22, fontWeight: 600, color: C.blue}}>
                  {label} · {w}
                </div>
              </div>
            );
          })}
        </div>
      </Board>
    </>
  );
};

/* 6.3 Spacing */
const Spacing: React.FC = () => {
  const steps = [2, 4, 8, 12, 16, 20, 24, 32, 40, 48];
  return (
    <>
      <Head ar="شبكة 4 بوينت: 2 · 4 · 8 · 12 … 48" en="4-point spacing grid" />
      <Board img="ds/ds-spacing.png">
        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          {steps.map((v, i) => {
            const p = useProgress(14 + i * 4, 24); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div key={v} dir="ltr" style={{display: 'flex', alignItems: 'center', gap: 24}}>
                <div style={{width: 120, fontSize: 30, fontWeight: 800, color: C.ink, textAlign: 'right'}}>{v}</div>
                <div style={{height: 52, width: v * 13 * p, background: i % 3 === 2 ? C.yellow : C.blue, borderRadius: 8, opacity: 0.4 + p * 0.6}} />
                <div style={{fontSize: 22, color: C.ink, opacity: 0.5 * p, fontWeight: 600}}>space/{v}</div>
              </div>
            );
          })}
        </div>
      </Board>
    </>
  );
};

/* 6.4 Components */
const Btn: React.FC<{bg: string; fg: string; label: string; border?: string; d: number; o?: number}> = ({bg, fg, label, border, d, o = 1}) => {
  const e = useEnter(d, 12);
  return (
    <div
      style={{
        height: 96,
        borderRadius: 48,
        background: bg,
        color: fg,
        border: border ? `4px solid ${border}` : 'none',
        display: 'grid',
        placeItems: 'center',
        fontSize: 32,
        fontWeight: 800,
        boxShadow: 'none',
        transform: `scale(${e})`,
        opacity: o,
        boxSizing: 'border-box',
        borderBottom: bg !== 'transparent' && bg !== C.line ? `8px solid ${C.ink}` : undefined,
      }}
    >
      {label}
    </div>
  );
};

const Components: React.FC = () => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame, [40, 110], [0, 0.72], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const toggle = frame > 70;
  return (
    <>
      <Head ar="236 مجموعة مكوّنات + 104 مكوّن" en="236 component sets + 104 components" />
      <Board img="ds/ds-buttons.png">
        <div dir="rtl" style={{display: 'flex', justifyContent: 'space-around', marginBottom: 30}}>
          <div style={{textAlign: 'center'}}>
            <Counter to={236} delay={10} size={110} color={C.blue} />
            <div style={{fontSize: 26, fontWeight: 700, color: C.ink}}>مجموعة مكوّنات · sets</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <Counter to={104} delay={16} size={110} color={C.orange} />
            <div style={{fontSize: 26, fontWeight: 700, color: C.ink}}>مكوّن · components</div>
          </div>
        </div>
        <div dir="rtl" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22}}>
          <Btn bg={C.yellow} fg={C.ink} label="ابدأ المهمة" d={24} />
          <Btn bg={C.blue} fg={C.white} label="كمّل الدرس" d={28} />
          <Btn bg="transparent" fg={C.ink} border={C.ink} label="جرّب تاني" d={32} />
          <Btn bg={C.line} fg={C.ink} label="مقفول 🔒" d={36} o={0.6} />
        </div>
        <div dir="rtl" style={{display: 'flex', gap: 16, marginTop: 30, flexWrap: 'wrap'}}>
          {[
            ['⭐ 120 XP', C.yellow],
            ['🔥 7 أيام', C.orange],
            ['✓ مكتمل', C.green],
            ['الوحدة 2', C.purple],
          ].map(([t, c], i) => {
            const e = useEnter(40 + i * 4, 12); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div key={i} style={{padding: '10px 24px', borderRadius: 30, background: c, color: c === C.yellow ? C.ink : C.white, fontSize: 26, fontWeight: 700, transform: `scale(${e})`}}>
                {t}
              </div>
            );
          })}
        </div>
        <div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 34}}>
          <div style={{flex: 1, height: 32, borderRadius: 16, background: C.line, overflow: 'hidden', display: 'flex'}}>
            <div style={{width: `${prog * 100}%`, background: C.green, borderRadius: 16}} />
          </div>
          <div style={{width: 120, height: 64, borderRadius: 32, background: toggle ? C.green : C.line, position: 'relative'}}>
            <div style={{position: 'absolute', top: 8, right: toggle ? 64 : 8, width: 48, height: 48, borderRadius: 24, background: C.white, border: `3px solid ${C.ink}`, boxSizing: 'border-box'}} />
          </div>
        </div>
      </Board>
    </>
  );
};

/* 6.5 Mascot */
const moods: [Mood, string][] = [
  ['happy', 'مبسوط'],
  ['launch', 'منطلق'],
  ['wink', 'غمزة'],
  ['proud', 'فخور'],
  ['think', 'بيفكّر'],
  ['sleepy', 'نعسان'],
  ['wow', 'مندهش'],
  ['cheer', 'بيهيّص'],
  ['calm', 'هادي'],
  ['focus', 'مركّز'],
  ['love', 'بيحب'],
  ['almost', 'قرّبت'],
];
const Mascot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Head ar="صاروخ عايش بـ12 حالة" en="A living rocket — 12 moods" />
      <Board img="ds/ds-mascot.png">
        <div dir="rtl" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 18}}>
          {moods.map(([m, n], i) => {
            const e = useEnter(10 + i * 4, 11); // eslint-disable-line react-hooks/rules-of-hooks
            const bob = Math.sin((frame + i * 9) / 12) * 6;
            return (
              <div key={m} style={{textAlign: 'center', transform: `scale(${e}) translateY(${bob}px)`}}>
                <Rocket size={118} mood={m} flame={m === 'launch' || m === 'cheer' ? 1 : 0.35} />
                <div style={{fontSize: 24, fontWeight: 700, color: C.ink, marginTop: -6}}>{n}</div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', bottom: 34, left: 48}}>
          <Counter to={12} delay={20} size={90} color={C.orange} />
        </div>
      </Board>
    </>
  );
};

/* 6.6 Icons & badges */
const icons = ['⚛️', '🧲', '💡', '🔭', '⚙️', '🌍', '🧪', '📐', '🔋', '🛰️', '📏', '🌡️'];
const badges = [
  {c: C.yellow, t: '100%', l: 'ولا غلطة'},
  {c: C.orange, t: '7🔥', l: 'سلسلة'},
  {c: C.purple, t: 'L5', l: 'مستوى'},
  {c: C.green, t: '★', l: 'إتقان'},
];
const Icons: React.FC = () => (
  <>
    <Head ar="أيقونات وشارات مرسومة مخصوص" en="Custom icons & badges" />
    <Board img="ds/ds-icons.png">
      <div dir="rtl" style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 18}}>
        {icons.map((ic, i) => {
          const e = useEnter(8 + i * 3, 11); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 24,
                background: [C.surface, C.yellow, C.surface][i % 3],
                border: `3px solid ${C.line}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 56,
                transform: `scale(${e})`,
              }}
            >
              {ic}
            </div>
          );
        })}
      </div>
      <div dir="rtl" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 50}}>
        {badges.map((b, i) => {
          const e = useEnter(50 + i * 6, 10); // eslint-disable-line react-hooks/rules-of-hooks
          return (
            <div key={i} style={{textAlign: 'center', transform: `scale(${e}) rotate(${(1 - e) * -40}deg)`}}>
              <svg width="170" height="190" viewBox="0 0 170 190">
                <path d="M85 6 L160 49 L160 141 L85 184 L10 141 L10 49z" fill={b.c} stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
                <path d="M85 30 L138 61 L138 129 L85 160 L32 129 L32 61z" fill="none" stroke={C.white} strokeWidth="5" opacity="0.6" />
                <text x="85" y="108" textAnchor="middle" fontFamily={CAIRO} fontWeight="800" fontSize="40" fill={b.c === C.yellow ? C.ink : C.white}>
                  {b.t}
                </text>
              </svg>
              <div style={{fontSize: 26, fontWeight: 700, color: C.ink}}>{b.l}</div>
            </div>
          );
        })}
      </div>
    </Board>
  </>
);

export const S06DesignSystem: React.FC = () => {
  const panels = [Colors, Type, Spacing, Components, Mascot, Icons];
  return (
    <AbsoluteFill style={{background: C.surface}}>
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          top: 200,
          width: '100%',
          textAlign: 'center',
          fontFamily: CAIRO,
          fontSize: 26,
          fontWeight: 700,
          color: C.blue,
          letterSpacing: 1,
        }}
      >
        ⚙️ Design System
      </div>
      {panels.map((P, i) => (
        <Sequence key={i} from={i * PANEL} durationInFrames={PANEL}>
          <P />
        </Sequence>
      ))}
      <PanelDots />
    </AbsoluteFill>
  );
};

const PanelDots: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(5, Math.floor(frame / PANEL));
  return (
    <div style={{position: 'absolute', top: 1580, width: '100%', display: 'flex', justifyContent: 'center', gap: 14, flexDirection: 'row-reverse'}}>
      {new Array(6).fill(0).map((_, i) => (
        <div key={i} style={{width: i === idx ? 48 : 16, height: 16, borderRadius: 8, background: i <= idx ? C.ink : C.line}} />
      ))}
    </div>
  );
};
