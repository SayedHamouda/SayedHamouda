import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {Ticker} from '../components/Bits';
import {Caption} from '../components/Caption';
import {Cutout, Halftone, Kicker, Mascot, MascotState, Paper, Tape} from '../components/Collage';
import {useSnap} from '../components/motion';
import {C, CAIRO} from '../theme';

/* ───────── Journey · 0:34 → 0:52 (18s) ───────── */
const stations: {ar: string; en: string; shot: string; c: string}[] = [
  {ar: 'زائر', en: 'Visitor', shot: 'l-landing-phone', c: C.blue},
  {ar: 'تسجيل + ولي الأمر عبر واتساب', en: 'Sign-up + parent via WhatsApp', shot: 'm-whatsapp', c: C.green},
  {ar: 'تجربة مجانية', en: 'Free trial', shot: 'm-trial', c: C.orange},
  {ar: 'شراء', en: 'Purchase', shot: 'm-buy', c: C.blue},
  {ar: 'الدرس', en: 'Lesson', shot: 'm-lesson-video', c: C.purple},
  {ar: 'اختبر شطارتك', en: 'Challenge', shot: 'm-challenge-intro', c: C.navy},
  {ar: 'المتصدرون والمتجر', en: 'Leaderboard & Store', shot: 'm-leaderboard', c: C.yellow},
];
const STEP = 66; // frames per station

export const Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const raw = interpolate(frame, [24, 24 + STEP * (stations.length - 1)], [0, stations.length - 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const i0 = Math.floor(raw);
  const f = raw - i0;
  const cam = i0 + Easing.inOut(Easing.cubic)(Math.min(1, f * 2.2));
  const active = Math.round(cam);
  const note = useSnap(470);
  const GAP = 300;
  return (
    <Paper>
      <Halftone x={760} y={520} w={420} h={420} color={C.yellow} />
      {/* rail of stations moving under a fixed playhead */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000 - cam * GAP}}>
        <svg width={1080} height={GAP * stations.length} style={{position: 'absolute', top: 0}}>
          <line x1={210} y1={0} x2={210} y2={GAP * (stations.length - 1)} stroke={C.line} strokeWidth={14} strokeLinecap="round" />
          <line x1={210} y1={0} x2={210} y2={GAP * cam} stroke={C.yellow} strokeWidth={14} strokeLinecap="round" />
        </svg>
        {stations.map((st, i) => {
          const on = i === active;
          const past = i < cam - 0.5;
          return (
            <div key={i} dir="rtl" style={{position: 'absolute', top: i * GAP - 70, left: 150, right: 330, display: 'flex', alignItems: 'center', gap: 26, flexDirection: 'row-reverse', justifyContent: 'flex-end'}}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  flex: 'none',
                  borderRadius: 60,
                  background: on || past ? st.c : C.white,
                  border: `6px solid ${C.ink}`,
                  boxSizing: 'border-box',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: CAIRO,
                  fontWeight: 800,
                  fontSize: 44,
                  color: on || past ? (st.c === C.yellow ? C.ink : C.white) : C.ink,
                  transform: `scale(${on ? 1.12 : 1})`,
                }}
              >
                {i + 1}
              </div>
              <div style={{fontFamily: CAIRO, opacity: on ? 1 : 0.45, transform: `translateX(${on ? 0 : -10}px)`}}>
                <div style={{fontSize: on ? 46 : 38, fontWeight: 800, color: C.ink, lineHeight: 1.25}}>{st.ar}</div>
                <div dir="ltr" style={{fontSize: 24, fontWeight: 500, color: C.ink, opacity: 0.6, textAlign: 'right'}}>
                  {st.en}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* the active station's real screen, swapping with a flip */}
      {stations.map((st, i) => {
        const t = frame - (24 + i * STEP) + 10;
        if (i !== active) return null;
        const flip = interpolate(t, [0, 10], [90, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
        return (
          <div key={i} style={{position: 'absolute', left: 740, top: 700, transform: `perspective(1200px) rotateY(${flip}deg) rotate(4deg)`}}>
            <Cutout src={`screens/${st.shot}.webp`} w={300} h={i === 0 ? 640 : 675} radius={30} border={6} pos="50% 0%" />
            <Tape x={80} y={-24} w={140} rot={-6} />
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 560, background: C.surface}} />
      <Caption
        ar={
          <>
            رحلة طالب كاملة
            <br />
            من أول زيارة لحد الإتقان
          </>
        }
        en="One complete student journey"
        size={60}
        delay={2}
        style={{position: 'absolute', top: 268, width: '100%'}}
      />
      <div style={{position: 'absolute', top: 1440, width: '100%', textAlign: 'center', transform: `scale(${note})`}}>
        <Kicker ar="17 قسم · مرتّبين بترتيب الرحلة" en="17 sections in journey order" bg={C.navy} color={C.white} />
      </div>
    </Paper>
  );
};

/* ───────── UX decisions · 0:52 → 1:08 (16s) ───────── */
const decisions: {ar: string; en: string; c: string; shot: string; m: MascotState}[] = [
  {ar: 'مساري = أول شاشة · مش داشبورد', en: 'My Path first — not a dashboard', c: C.blue, shot: 'm-path', m: 'idle'},
  {ar: 'الدرس: فيديو ← بطاقات ← أسئلة', en: 'Lesson: Video → Flashcards → Quiz', c: C.orange, shot: 'm-flash-front', m: 'ready'},
  {ar: 'النجاح: 3 من 5 في الدرس · 50% في الأسبوعي', en: 'Pass: 3/5 lesson · 50% weekly', c: C.green, shot: 'm-lesson-done', m: 'success'},
  {ar: 'مفيش «فشلت» — في «قربت» و«جرّب تاني»', en: 'No "you failed" — "almost" & "try again"', c: C.purple, shot: 'm-result-near', m: 'try-again'},
  {ar: 'الامتحان من غير صح/غلط لحد النهاية', en: 'Exams: score only at the end', c: C.navy, shot: 'm-challenge-q', m: 'thinking'},
  {ar: 'التجربة المجانية = أول درس كامل', en: 'Free trial = the full first lesson', c: C.orange, shot: 'm-trial-lesson', m: 'completion'},
];
const D0 = 14;
const DLEN = 74;

export const Decisions: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.max(0, Math.min(decisions.length - 1, Math.floor((frame - D0) / DLEN)));
  return (
    <Paper>
      <Caption ar="قرارات UX المهمة" en="Key UX decisions" delay={2} style={{position: 'absolute', top: 270, width: '100%'}} />
      {decisions.map((d, i) => {
        const start = D0 + i * DLEN;
        const inP = interpolate(frame, [start, start + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.3))});
        const last = i === decisions.length - 1;
        const outP = last ? 0 : interpolate(frame, [start + DLEN - 6, start + DLEN + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
        if (inP === 0 || outP === 1) return null;
        const x = (1 - inP) * 1100 - outP * 1300;
        const r = (1 - inP) * 10 - outP * 12 + (i % 2 ? 1.5 : -1.5);
        return (
          <React.Fragment key={i}>
            {/* screenshot pinned behind the card */}
            <div style={{position: 'absolute', left: 560, top: 560, transform: `translateX(${x * 0.7}px) rotate(${6 - r}deg)`}}>
              <Cutout src={`screens/${d.shot}.webp`} w={380} h={820} radius={34} border={6} />
              <Tape x={120} y={-22} w={150} rot={4} />
            </div>
            <div style={{position: 'absolute', top: 820, left: 70, width: 600, transform: `translateX(${x}px) rotate(${r}deg)`}}>
              <div style={{position: 'absolute', inset: 0, transform: 'translate(-16px, 16px)', background: d.c, borderRadius: 34}} />
              <div dir="rtl" style={{position: 'relative', background: C.white, border: `6px solid ${C.ink}`, borderRadius: 34, padding: '34px 38px 40px', fontFamily: CAIRO}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{fontSize: 86, fontWeight: 800, color: d.c, lineHeight: 1}}>{`0${i + 1}`}</div>
                  <Mascot state={d.m} size={100} />
                </div>
                <div style={{fontSize: 46, fontWeight: 800, color: C.ink, lineHeight: 1.35, marginTop: 14}}>{d.ar}</div>
                <div dir="ltr" style={{fontSize: 26, fontWeight: 500, color: C.ink, opacity: 0.6, textAlign: 'right', marginTop: 8}}>
                  {d.en}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', top: 1450, width: '100%', display: 'flex', justifyContent: 'center', gap: 14, flexDirection: 'row-reverse'}}>
        {decisions.map((_, i) => (
          <div key={i} style={{width: i === idx ? 54 : 16, height: 16, borderRadius: 8, background: i <= idx ? C.ink : C.line}} />
        ))}
      </div>
      <Ticker items={decisions.map((d) => d.ar)} y={1500} speed={3} />
    </Paper>
  );
};
