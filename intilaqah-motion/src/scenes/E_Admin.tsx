import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {Halftone, Kicker, Mascot, Paper, Tape} from '../components/Collage';
import {BrowserFrame, Cycle, PhoneFrame, Screen, Shot} from '../components/Frames';
import {useSnap} from '../components/motion';
import {C, CAIRO, s} from '../theme';

/* ───────── Admin dashboard · 3:06 → 3:26 (20s) ───────── */
const modules: {name: string; ar: string; en: string; sec: number; scroll?: boolean}[] = [
  {name: 'a-home', ar: 'الصفحة الرئيسية', en: 'Overview', sec: 3.2, scroll: true},
  {name: 'a-units', ar: 'إدارة المحتوى', en: 'Content', sec: 2.2, scroll: true},
  {name: 'a-challenge-editor', ar: 'محرّر الأسئلة', en: 'Question editor', sec: 2.0, scroll: true},
  {name: 'a-weekly', ar: 'الاختبارات الأسبوعية', en: 'Weekly tests', sec: 1.8},
  {name: 'a-leaderboard', ar: 'لوحة الصدارة', en: 'Leaderboard', sec: 2.0},
  {name: 'a-store', ar: 'إدارة المتجر', en: 'Store', sec: 2.0, scroll: true},
  {name: 'a-students', ar: 'إدارة الطلاب', en: 'Students', sec: 2.2, scroll: true},
  {name: 'a-community', ar: 'المجتمع', en: 'Community', sec: 2.4, scroll: true},
  {name: 'a-revenue', ar: 'المعاملات والإيرادات', en: 'Revenue', sec: 2.2},
];

export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const shots: Shot[] = modules.map((m) => ({name: m.name, dur: s(m.sec), scroll: m.scroll}));
  let acc = 0;
  const starts = shots.map((sh) => {
    const a = acc;
    acc += sh.dur;
    return a;
  });
  const idx = Math.max(0, starts.filter((a) => frame >= a).length - 1);
  const bIn = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.2))});
  const label = useSnap(starts[idx]);
  return (
    <Paper>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 1080, background: C.navy}} />
      <Halftone x={720} y={200} w={420} h={420} color="rgba(252,194,8,.5)" />
      <div style={{position: 'absolute', top: 262, width: '100%', textAlign: 'center'}}>
        <Kicker n="+" ar="لوحة التحكم" en="Admin dashboard" />
      </div>
      <Caption ar="لوحة تحكم كاملة لإدارة المنصّة" en="A complete admin side — 9 modules, same design system" color={C.white} size={54} delay={2} style={{position: 'absolute', top: 345, left: 40, right: 40}} />
      <div style={{position: 'absolute', left: 40, top: 600 + (1 - bIn) * 900, transform: 'rotate(-1deg)'}}>
        <BrowserFrame width={1000}>
          <Cycle shots={shots} />
        </BrowserFrame>
        <Tape x={-10} y={-20} w={150} rot={-10} delay={10} />
        <Tape x={860} y={680} w={150} rot={-6} delay={14} />
      </div>
      {/* current module label */}
      <div dir="rtl" style={{position: 'absolute', top: 1360, right: 60, transform: `scale(${label}) rotate(2deg)`, transformOrigin: 'right center'}}>
        <div style={{background: C.yellow, border: `5px solid ${C.ink}`, borderRadius: 22, padding: '10px 28px', fontFamily: CAIRO}}>
          <span style={{fontSize: 40, fontWeight: 800, color: C.ink}}>{modules[idx].ar}</span>
          <span dir="ltr" style={{fontSize: 24, fontWeight: 600, color: C.ink, opacity: 0.6, marginRight: 14}}>
            {modules[idx].en}
          </span>
        </div>
      </div>
      {/* module rail */}
      <div style={{position: 'absolute', top: 1470, left: 60, right: 60, display: 'flex', gap: 8, flexDirection: 'row-reverse'}}>
        {modules.map((m, i) => (
          <div key={m.name} style={{flex: 1, height: 14, borderRadius: 7, background: i <= idx ? C.blue : C.line}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 60, top: 1310}}>
        <Mascot state="ready" size={130} sticker />
      </div>
    </Paper>
  );
};

/* ───────── Landing page · 3:26 → 3:34 (8s) ───────── */
export const Landing: React.FC = () => {
  const frame = useCurrentFrame();
  const bIn = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.2))});
  const pIn = interpolate(frame, [6, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.2))});
  return (
    <Paper>
      <Halftone x={-120} y={500} w={520} h={520} color={C.blue} />
      <div style={{position: 'absolute', top: 262, width: '100%', textAlign: 'center'}}>
        <Kicker n="+" ar="صفحة الهبوط" en="Landing page" bg={C.blue} color={C.white} />
      </div>
      <Caption ar="صفحة هبوط بتبيع الفكرة في ثواني" en="Web · Tablet · Phone — plus FAQ, contact & legal" size={52} delay={2} style={{position: 'absolute', top: 345, left: 40, right: 40}} />
      <div style={{position: 'absolute', left: 40, top: 620, transform: `translateY(${(1 - bIn) * 900}px) rotate(-2deg)`}}>
        <BrowserFrame width={640} height={900}>
          <Screen name="l-landing-web" scroll={[16, 230]} />
        </BrowserFrame>
      </div>
      <div style={{position: 'absolute', left: 620, top: 560, transform: `translateY(${(1 - pIn) * 900}px) rotate(3deg)`}}>
        <PhoneFrame scale={0.53}>
          <Screen name="l-landing-phone" scroll={[24, 236]} />
        </PhoneFrame>
        <Tape x={110} y={-22} w={150} rot={-8} delay={18} />
      </div>
    </Paper>
  );
};

export const DASH_LEN = modules.reduce((a, m) => a + s(m.sec), 0);
