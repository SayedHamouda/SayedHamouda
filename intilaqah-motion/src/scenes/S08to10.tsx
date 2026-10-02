import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Avatar, Card, Counter, Stars} from '../components/Bits';
import {Caption} from '../components/Caption';
import {useEnter, useHover} from '../components/motion';
import {Logo, Rocket} from '../components/Rocket';
import {C, CAIRO} from '../theme';

/* ───────── Scene 8 · Numbers (3:20 → 3:35) ───────── */
const stats = [
  {n: 244, ar: 'شاشة', sub: '122 موبايل + 122 ويب', en: 'screens (122 mobile + 122 web)', c: C.blue},
  {n: 17, ar: 'قسم في الرحلة', en: 'journey sections', c: C.orange},
  {n: 340, ar: 'مكوّن ومجموعة مكوّنات', en: 'components & sets', c: C.purple},
  {n: 987, ar: 'رابط Prototype', sub: '862 تنقّل + 125 رجوع', en: 'prototype links', c: C.blue},
  {n: 61, ar: 'رحلة جاهزة للتجربة', en: 'ready-to-play flows', c: C.green},
  {n: 0, ar: 'روابط بايظة أو طرق مسدودة', en: 'broken links / dead ends', c: C.green},
];

export const S08Numbers: React.FC = () => (
  <AbsoluteFill style={{background: C.surface}}>
    <Caption ar="المشروع بالأرقام" en="By the numbers" delay={2} style={{position: 'absolute', top: 280, width: '100%'}} />
    <div dir="rtl" style={{position: 'absolute', top: 520, left: 60, right: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28}}>
      {stats.map((st, i) => (
        <Card key={i} delay={16 + i * 4} style={{height: 300, padding: '30px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div dir="rtl" style={{fontFamily: CAIRO}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Counter to={st.n} delay={16 + i * 4} size={104} color={st.c} />
              {st.n === 0 ? (
                <div style={{width: 56, height: 56, borderRadius: 28, background: C.green, color: C.white, display: 'grid', placeItems: 'center', fontSize: 34, fontWeight: 800}}>
                  ✓
                </div>
              ) : null}
            </div>
            <div style={{fontSize: 30, fontWeight: 800, color: C.ink, lineHeight: 1.3, marginTop: 6}}>{st.ar}</div>
            {st.sub ? <div style={{fontSize: 22, fontWeight: 600, color: C.ink, opacity: 0.7}}>{st.sub}</div> : null}
            <div dir="ltr" style={{fontSize: 20, fontWeight: 500, color: C.ink, opacity: 0.55, textAlign: 'right'}}>
              {st.en}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </AbsoluteFill>
);

/* ───────── Scene 9 · Problems solved (3:35 → 3:50) ───────── */
const fixes = [
  {b: 'ويب ممطوط من الموبايل', be: 'Stretched mobile on web', a: 'ويب متصمّم من الأول بعمودين', ae: 'Web designed natively'},
  {b: '332 نص تباينه ضعيف', be: '332 low-contrast texts', a: '0 — كله يعدّي WCAG', ae: '0 — all pass WCAG'},
  {b: 'محتوى مش مطابق للمنهج', be: 'Off-curriculum content', a: 'مطابق لمنهج الصف التاسع العُماني', ae: 'Aligned to the Omani Grade 9 book'},
];

const Fix: React.FC<{f: (typeof fixes)[number]; at: number}> = ({f, at}) => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [at + 36, at + 54], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const after = useEnter(at + 58, 14);
  return (
    <Card delay={at} from="right" style={{padding: '26px 36px', minHeight: 250}}>
      <div dir="rtl" style={{fontFamily: CAIRO}}>
        <div style={{display: 'inline-block', position: 'relative', opacity: 1 - strike * 0.5}}>
          <div style={{fontSize: 34, fontWeight: 700, color: C.ink}}>
            <span style={{fontSize: 22, fontWeight: 800, color: C.red, marginLeft: 12}}>قبل</span>
            {f.b}
          </div>
          <div dir="ltr" style={{fontSize: 20, color: C.ink, opacity: 0.55, textAlign: 'right'}}>
            {f.be}
          </div>
          <div style={{position: 'absolute', top: 30, right: 0, height: 6, width: `${strike * 100}%`, background: C.red, borderRadius: 3}} />
        </div>
        <div style={{marginTop: 14, opacity: after, transform: `translateY(${(1 - after) * 20}px)`, display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 52, height: 52, flex: 'none', borderRadius: 26, background: C.green, color: C.white, display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 800}}>✓</div>
          <div>
            <div style={{fontSize: 38, fontWeight: 800, color: C.ink, lineHeight: 1.3}}>{f.a}</div>
            <div dir="ltr" style={{fontSize: 22, color: C.ink, opacity: 0.6, textAlign: 'right', fontWeight: 500}}>
              {f.ae}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const S09Fixes: React.FC = () => {
  const line = useEnter(330);
  return (
    <AbsoluteFill style={{background: C.surface}}>
      <Caption ar="صعوبات اتحلّت" en="Problems we solved" delay={2} style={{position: 'absolute', top: 280, width: '100%'}} />
      <div style={{position: 'absolute', top: 500, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 26}}>
        {fixes.map((f, i) => (
          <Fix key={i} f={f} at={14 + i * 100} />
        ))}
      </div>
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          top: 1380,
          left: 70,
          right: 70,
          background: C.yellow,
          borderRadius: 28,
          padding: '20px 30px',
          fontFamily: CAIRO,
          textAlign: 'center',
          opacity: line,
          transform: `scale(${0.9 + line * 0.1})`,
        }}
      >
        <div style={{fontSize: 36, fontWeight: 800, color: C.ink, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
          <span dir="ltr" style={{display: 'flex', alignItems: 'center'}}>
            +<Counter to={2700} delay={330} size={36} />
          </span>
          <span>قيمة لون ومسافة اتربطت بالتوكنز</span>
        </div>
        <div dir="ltr" style={{fontSize: 22, fontWeight: 500, color: C.ink, opacity: 0.7}}>
          2,700+ colors & spacings bound to tokens
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Scene 10 · Closing (3:50 → 4:00) ───────── */
export const S10Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const R = 300;
  const cx = 540;
  const cy = 760;
  const t = interpolate(frame, [8, 98], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const ang = Math.PI / 2 + t * Math.PI * 2; // starts below the logo, loops once
  const L = 2 * Math.PI * R;
  const logo = useEnter(4, 12);
  const me = useEnter(140);
  const hover = useHover(6);
  const rx = cx + Math.cos(ang) * R;
  const ry = cy + Math.sin(ang) * R + (t >= 1 ? hover : 0);
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Stars seed="end" />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <circle
          cx={cx}
          cy={cy}
          r={R}
          stroke={C.yellow}
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - t)}
          transform={`rotate(90 ${cx} ${cy})`}
        />
      </svg>
      <div style={{position: 'absolute', top: cy - 60, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${logo})`}}>
        <Logo size={120} />
      </div>
      <div style={{position: 'absolute', left: rx - 50, top: ry - 70, transform: `rotate(${(ang * 180) / Math.PI + 180}deg)`}}>
        <Rocket size={100} mood="cheer" />
      </div>
      <Caption ar="جاهز للتنفيذ 🚀" en="Ready for development" color={C.white} delay={100} size={76} style={{position: 'absolute', top: 1120, width: '100%'}} />
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          top: 1340,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 26,
          fontFamily: CAIRO,
          color: C.white,
          opacity: me,
          transform: `translateY(${(1 - me) * 24}px)`,
        }}
      >
        <Avatar src={staticFile('brand/sayed-avatar.jpg')} size={170} />
        <div>
          <div style={{fontSize: 46, fontWeight: 800}}>سيد حمودة</div>
          <div dir="ltr" style={{fontSize: 28, fontWeight: 600, color: C.yellow, textAlign: 'right'}}>
            Sayed Hamouda · UI/UX Designer
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
