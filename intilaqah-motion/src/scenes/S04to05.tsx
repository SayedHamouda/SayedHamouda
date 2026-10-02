import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Card, Ticker} from '../components/Bits';
import {Caption} from '../components/Caption';
import {useEnter} from '../components/motion';
import {Rocket} from '../components/Rocket';
import {C, CAIRO} from '../theme';

/* ───────── Scene 4 · User journey (0:45 → 1:10) ───────── */
const stations = [
  {e: '👀', ar: 'زائر', en: 'Visitor'},
  {e: '📲', ar: 'تسجيل + ولي الأمر عبر واتساب', en: 'Sign-up + parent via WhatsApp'},
  {e: '🎁', ar: 'تجربة مجانية', en: 'Free trial'},
  {e: '💳', ar: 'شراء', en: 'Purchase'},
  {e: '🎬', ar: 'الدرس', en: 'Lesson'},
  {e: '⚡', ar: 'اختبر شطارتك', en: 'Challenge'},
  {e: '🏆', ar: 'المتصدرون والمتجر', en: 'Leaderboard & Store'},
];
const GAP = 290;
const START = 40;
const STEP = 72;

export const S04Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const pos = interpolate(frame, [START, START + STEP * (stations.length - 1)], [0, stations.length - 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // camera eases between stations rather than drifting linearly
  const i0 = Math.floor(pos);
  const f = pos - i0;
  const cam = i0 + Easing.inOut(Easing.cubic)(Math.min(1, f * 1.6));
  const active = Math.round(cam);
  const note = useEnter(590);
  const mapTop = 1000 - cam * GAP;
  return (
    <AbsoluteFill style={{background: C.surface}}>
      {/* map */}
      <div style={{position: 'absolute', left: 0, right: 0, top: mapTop}}>
        <svg width={1080} height={GAP * stations.length} style={{position: 'absolute', top: 0}}>
          {stations.slice(1).map((_, i) => {
            const x1 = i % 2 === 0 ? 640 : 440;
            const x2 = i % 2 === 0 ? 440 : 640;
            const done = i < cam;
            return (
              <path
                key={i}
                d={`M${x1} ${i * GAP} C${x1} ${i * GAP + GAP / 2}, ${x2} ${i * GAP + GAP / 2}, ${x2} ${(i + 1) * GAP}`}
                stroke={done ? C.yellow : C.line}
                strokeWidth={14}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {stations.map((st, i) => {
          const on = i === active;
          const past = i < active;
          const x = i % 2 === 0 ? 140 : 300;
          return (
            <div
              key={i}
              dir="rtl"
              style={{
                position: 'absolute',
                top: i * GAP - 95,
                left: x,
                width: 640,
                height: 190,
                borderRadius: 32,
                background: on ? C.yellow : C.white,
                border: `${on ? 6 : 3}px solid ${on ? C.ink : C.line}`,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '0 32px',
                fontFamily: CAIRO,
                transform: `scale(${on ? 1.06 : 1})`,
                opacity: past || on ? 1 : 0.75,
              }}
            >
              <div
                style={{
                  width: 104,
                  height: 104,
                  flex: 'none',
                  borderRadius: 52,
                  background: on ? C.white : past ? C.yellow : C.surface,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 52,
                }}
              >
                {st.e}
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 22, fontWeight: 700, color: C.blue}}>{`0${i + 1}`}</div>
                <div style={{fontSize: st.ar.length > 18 ? 32 : 40, fontWeight: 800, color: C.ink, lineHeight: 1.25}}>{st.ar}</div>
                <div dir="ltr" style={{fontSize: 22, fontWeight: 500, color: C.ink, opacity: 0.6, textAlign: 'right'}}>
                  {st.en}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* title band stays on top of the moving map */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 560, background: C.surface}} />
      <div style={{position: 'absolute', top: 540, left: 0, right: 0, height: 40, background: `linear-gradient(${C.surface}, rgba(245,245,245,0))`}} />
      <Caption
        ar={
          <>
            رحلة طالب كاملة
            <br />
            من أول زيارة لحد الإتقان
          </>
        }
        en="One complete student journey"
        delay={6}
        size={58}
        style={{position: 'absolute', top: 270, width: '100%'}}
      />
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 1400,
          opacity: note,
          transform: `translateY(${(1 - note) * 30}px)`,
          background: C.navy,
          color: C.white,
          borderRadius: 28,
          padding: '24px 32px',
          fontFamily: CAIRO,
          textAlign: 'center',
        }}
      >
        <div style={{fontSize: 40, fontWeight: 800}}>
          <span style={{color: C.yellow}}>17</span> قسم · مرتّبين بترتيب الرحلة
        </div>
        <div style={{fontSize: 24, fontWeight: 500, opacity: 0.7}}>17 sections in journey order</div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Scene 5 · UX decisions (1:10 → 1:30) ───────── */
const decisions = [
  {ar: 'مساري = أول شاشة · مش داشبورد', en: 'My Path first — not a dashboard', c: C.blue},
  {ar: 'الدرس: فيديو ← بطاقات ← أسئلة', en: 'Lesson: Video → Flashcards → Quiz', c: C.orange},
  {ar: 'النجاح: 3 من 5 في الدرس · 50% في الأسبوعي', en: 'Pass: 3/5 lesson · 50% weekly', c: C.green},
  {ar: 'مفيش «فشلت» — في «قربت» و«جرّب تاني»', en: 'No "you failed" — "almost" & "try again"', c: C.purple},
  {ar: 'الامتحان من غير صح/غلط لحد النهاية', en: 'Exams: score only at the end', c: C.navy},
  {ar: 'التجربة المجانية = أول درس كامل', en: 'Free trial = the full first lesson', c: C.orange},
];
const D0 = 24;
const DLEN = 90;
const moods = ['happy', 'focus', 'proud', 'almost', 'think', 'cheer'] as const;

export const S05Decisions: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.max(0, Math.min(decisions.length - 1, Math.floor((frame - D0) / DLEN)));
  return (
    <AbsoluteFill style={{background: C.surface}}>
      <Caption ar="قرارات UX المهمة" en="Key UX decisions" delay={4} style={{position: 'absolute', top: 280, width: '100%'}} />
      {decisions.map((d, i) => {
        const start = D0 + i * DLEN;
        const inP = interpolate(frame, [start, start + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const last = i === decisions.length - 1;
        const outP = last
          ? 0
          : interpolate(frame, [start + DLEN - 10, start + DLEN + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
        if (inP === 0 || outP === 1) return null;
        const x = (1 - inP) * 1100 - outP * 1100;
        return (
          <div key={i} style={{position: 'absolute', top: 640, left: 90, right: 90, transform: `translateX(${x}px) rotate(${(1 - inP) * 4}deg)`}}>
            <div style={{position: 'absolute', inset: 0, transform: 'translate(-18px, 18px)', background: d.c, borderRadius: 36}} />
            <div
              dir="rtl"
              style={{
                position: 'relative',
                background: C.white,
                border: `6px solid ${C.ink}`,
                borderRadius: 36,
                padding: '48px 48px 56px',
                fontFamily: CAIRO,
                minHeight: 480,
                boxSizing: 'border-box',
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{fontSize: 96, fontWeight: 800, color: d.c, lineHeight: 1}}>{`0${i + 1}`}</div>
                <Rocket size={110} mood={moods[i]} flame={0.5} />
              </div>
              <div style={{fontSize: 56, fontWeight: 800, color: C.ink, lineHeight: 1.35, marginTop: 20}}>{d.ar}</div>
              <div dir="ltr" style={{fontSize: 32, fontWeight: 500, color: C.ink, opacity: 0.6, textAlign: 'right', marginTop: 12}}>
                {d.en}
              </div>
            </div>
          </div>
        );
      })}
      {/* progress dots */}
      <div style={{position: 'absolute', top: 1250, width: '100%', display: 'flex', justifyContent: 'center', gap: 16, flexDirection: 'row-reverse'}}>
        {decisions.map((_, i) => (
          <div key={i} style={{width: i === idx ? 56 : 18, height: 18, borderRadius: 9, background: i <= idx ? C.yellow : C.line}} />
        ))}
      </div>
      <Ticker items={decisions.map((d) => d.ar)} y={1420} speed={2.4} />
    </AbsoluteFill>
  );
};
