import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Avatar, Counter, Stars} from '../components/Bits';
import {Caption} from '../components/Caption';
import {Confetti, Halftone, Kicker, LogoMark, Mascot, Paper, Tape} from '../components/Collage';
import {useSnap} from '../components/motion';
import {C, CAIRO} from '../theme';

/* ───────── Numbers · 3:34 → 3:46 (12s) ───────── */
const stats = [
  {n: 244, ar: 'شاشة', sub: '122 موبايل + 122 ويب', en: 'screens', c: C.blue},
  {n: 17, ar: 'قسم في الرحلة', en: 'journey sections', c: C.orange},
  {n: 340, ar: 'مكوّن ومجموعة مكوّنات', en: 'components & sets', c: C.purple},
  {n: 987, ar: 'رابط Prototype', sub: '862 تنقّل + 125 رجوع', en: 'prototype links', c: C.blue},
  {n: 61, ar: 'رحلة جاهزة للتجربة', en: 'ready-to-play flows', c: C.green},
  {n: 0, ar: 'روابط بايظة أو طرق مسدودة', en: 'broken links / dead ends', c: C.green},
];

export const Numbers: React.FC = () => (
  <Paper>
    <Halftone x={640} y={180} w={480} h={480} color={C.yellow} />
    <div style={{position: 'absolute', top: 262, width: '100%', textAlign: 'center'}}>
      <Kicker ar="بالأرقام" en="By the numbers" />
    </div>
    <Caption ar="المشروع بالأرقام" en="The whole project, counted" delay={2} style={{position: 'absolute', top: 345, width: '100%'}} />
    <div dir="rtl" style={{position: 'absolute', top: 560, left: 60, right: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26}}>
      {stats.map((st, i) => {
        const e = useSnap(10 + i * 4); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div key={i} style={{position: 'relative', height: 290, transform: `scale(${e}) rotate(${i % 2 ? 1.5 : -1.5}deg)`}}>
            <div style={{position: 'absolute', inset: 0, transform: 'translate(-12px, 12px)', background: st.c, borderRadius: 28}} />
            <div style={{position: 'absolute', inset: 0, background: C.white, border: `5px solid ${C.ink}`, borderRadius: 28, padding: '24px 28px', fontFamily: CAIRO}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <Counter to={st.n} delay={10 + i * 4} size={100} color={st.c} />
                {st.n === 0 ? <div style={{width: 54, height: 54, borderRadius: 27, background: C.green, color: C.white, display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 800}}>✓</div> : null}
              </div>
              <div style={{fontSize: 30, fontWeight: 800, color: C.ink, lineHeight: 1.3, marginTop: 4}}>{st.ar}</div>
              {st.sub ? <div style={{fontSize: 22, fontWeight: 600, color: C.ink, opacity: 0.7}}>{st.sub}</div> : null}
              <div dir="ltr" style={{fontSize: 20, fontWeight: 500, color: C.ink, opacity: 0.55, textAlign: 'right'}}>
                {st.en}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </Paper>
);

/* ───────── Fixes · 3:46 → 3:54 (8s) ───────── */
const fixes = [
  {b: 'ويب ممطوط من الموبايل', be: 'Stretched mobile on web', a: 'ويب متصمّم من الأول بعمودين', ae: 'Web designed natively'},
  {b: '332 نص تباينه ضعيف', be: '332 low-contrast texts', a: '0 — كله يعدّي WCAG', ae: '0 — all pass WCAG'},
  {b: 'محتوى مش مطابق للمنهج', be: 'Off-curriculum content', a: 'مطابق لمنهج الصف التاسع العُماني', ae: 'Aligned to the Omani Grade 9 book'},
];

export const Fixes: React.FC = () => {
  const frame = useCurrentFrame();
  const line = useSnap(170);
  return (
    <Paper>
      <div style={{position: 'absolute', top: 262, width: '100%', textAlign: 'center'}}>
        <Kicker ar="قبل ⇠ بعد" en="Before → After" bg={C.navy} color={C.white} />
      </div>
      <Caption ar="صعوبات اتحلّت" en="Problems we solved" delay={2} style={{position: 'absolute', top: 345, width: '100%'}} />
      {fixes.map((f, i) => {
        const at = 8 + i * 44;
        const e = useSnap(at); // eslint-disable-line react-hooks/rules-of-hooks
        const strike = interpolate(frame, [at + 14, at + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
        const after = useSnap(at + 24); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div key={i} style={{position: 'absolute', top: 560 + i * 270, left: 70, right: 70, transform: `translateX(${(1 - e) * 1200}px) rotate(${i % 2 ? 1 : -1}deg)`}}>
            <div dir="rtl" style={{background: C.white, border: `5px solid ${C.ink}`, borderRadius: 28, padding: '20px 30px', fontFamily: CAIRO, minHeight: 230, boxSizing: 'border-box'}}>
              <div style={{display: 'inline-block', position: 'relative', opacity: 1 - strike * 0.5}}>
                <div style={{fontSize: 32, fontWeight: 700, color: C.ink}}>
                  <span style={{fontSize: 22, fontWeight: 800, color: C.red, marginLeft: 12}}>قبل</span>
                  {f.b}
                </div>
                <div style={{position: 'absolute', top: 26, right: 0, height: 6, width: `${strike * 100}%`, background: C.red, borderRadius: 3}} />
              </div>
              <div style={{marginTop: 12, display: 'flex', alignItems: 'center', gap: 16, opacity: after, transform: `translateY(${(1 - after) * 20}px)`}}>
                <div style={{width: 54, height: 54, flex: 'none', borderRadius: 27, background: C.green, color: C.white, display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 800}}>✓</div>
                <div>
                  <div style={{fontSize: 38, fontWeight: 800, color: C.ink, lineHeight: 1.3}}>{f.a}</div>
                  <div dir="ltr" style={{fontSize: 22, color: C.ink, opacity: 0.6, textAlign: 'right', fontWeight: 500}}>
                    {f.ae}
                  </div>
                </div>
              </div>
            </div>
            <Tape x={i % 2 ? 50 : 760} y={-20} w={110} rot={i % 2 ? -8 : 9} delay={at + 4} />
          </div>
        );
      })}
      <div dir="rtl" style={{position: 'absolute', top: 1400, left: 70, right: 70, background: C.yellow, border: `5px solid ${C.ink}`, borderRadius: 26, padding: '14px 26px', fontFamily: CAIRO, textAlign: 'center', transform: `scale(${line})`}}>
        <div style={{fontSize: 34, fontWeight: 800, color: C.ink, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
          <span dir="ltr" style={{display: 'flex', alignItems: 'center'}}>
            +<Counter to={2700} delay={170} size={34} />
          </span>
          <span>قيمة لون ومسافة اتربطت بالتوكنز</span>
        </div>
        <div dir="ltr" style={{fontSize: 20, fontWeight: 500, color: C.ink, opacity: 0.7}}>
          2,700+ colors & spacings bound to tokens
        </div>
      </div>
    </Paper>
  );
};

/* ───────── Closing · 3:54 → 4:00 (6s) ───────── */
export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const R = 260;
  const cx = 540;
  const cy = 730;
  const t = interpolate(frame, [4, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const ang = Math.PI / 2 + t * Math.PI * 2;
  const L = 2 * Math.PI * R;
  const logo = useSnap(2);
  const me = useSnap(60);
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Stars seed="end" count={110} />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <circle cx={cx} cy={cy} r={R} stroke="rgba(255,255,255,.15)" strokeWidth={14} fill="none" strokeDasharray="16 14" />
        <circle cx={cx} cy={cy} r={R} stroke={C.yellow} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - t)} transform={`rotate(90 ${cx} ${cy})`} />
      </svg>
      <div style={{position: 'absolute', top: cy - 150, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${logo})`}}>
        <LogoMark size={200} glyph="white" />
      </div>
      <div style={{position: 'absolute', left: cx + Math.cos(ang) * R - 55, top: cy + Math.sin(ang) * R - 70, transform: `rotate(${(ang * 180) / Math.PI + 90}deg)`}}>
        <Mascot state="flying" size={110} />
      </div>
      <Confetti x={540} y={760} start={70} count={40} spread={600} seed="end" />
      <Caption ar="جاهز للتنفيذ 🚀" en="Ready for development" color={C.white} delay={40} size={78} style={{position: 'absolute', top: 1130, width: '100%'}} />
      <div dir="rtl" style={{position: 'absolute', top: 1340, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, fontFamily: CAIRO, color: C.white, opacity: me, transform: `translateY(${(1 - me) * 30}px)`}}>
        <Avatar src={staticFile('brand/sayed-avatar.jpg')} size={170} />
        <div>
          <div style={{fontSize: 48, fontWeight: 800}}>سيد حمودة</div>
          <div dir="ltr" style={{fontSize: 28, fontWeight: 600, color: C.yellow, textAlign: 'right'}}>
            Sayed Hamouda · UI/UX Designer
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
