import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {Confetti, Cutout, Halftone, Kicker, Mascot, MascotState, Paper, Tape} from '../components/Collage';
import {BrowserFrame, Cycle, PhoneFrame, Shot} from '../components/Frames';
import {useSnap} from '../components/motion';
import {C, CAIRO, s} from '../theme';

type Chapter = {
  sec: number;
  kicker: string;
  en: string;
  ar: string;
  sub: string;
  phone: [string, number, boolean?][]; // name, seconds, scroll
  web?: [string, number, boolean?][];
  mascot: MascotState;
  tint: string;
  dark?: boolean;
  extra?: 'orbit' | 'cards' | 'stack';
};

const chapters: Chapter[] = [
  {
    sec: 8,
    kicker: 'التسجيل',
    ar: 'تسجيل بسيط · وولي الأمر بيتأكّد بواتساب',
    en: 'Simple sign-up · parent verified on WhatsApp',
    sub: 'Sign-up',
    phone: [['m-login', 1.3], ['m-account', 1.2], ['m-grade', 1.2], ['m-otp', 1.2], ['m-whatsapp', 1.6], ['m-parent-ok', 1.5]],
    web: [['d-login', 2.6], ['d-grade', 2.6], ['d-whatsapp', 2.8]],
    mascot: 'ready',
    tint: C.green,
  },
  {
    sec: 8,
    kicker: 'مساري',
    ar: 'مساري: الخريطة اللي الطالب بيلعب عليها',
    en: 'My Path — the game map',
    sub: 'My Path',
    phone: [['m-subject', 1.6], ['m-path', 3.2], ['m-new-unit', 1.6], ['m-overlay-challenge', 1.6]],
    web: [['d-subject', 2.4], ['d-path', 3.2], ['d-new-unit', 2.4]],
    mascot: 'flying',
    tint: C.blue,
  },
  {
    sec: 10,
    kicker: 'التجربة والشراء',
    ar: 'التجربة المجانية: درس كامل ببلاش',
    en: 'Free trial: a full lesson — then a clear purchase',
    sub: 'Trial & purchase',
    phone: [['m-trial', 1.6], ['m-trial-lesson', 1.6], ['m-trial-result', 1.6], ['m-buy', 1.6], ['m-pay', 2.0, true], ['m-buy-ok', 1.6]],
    web: [['d-trial', 2.6], ['d-trial-result', 2.4], ['d-buy', 2.4], ['d-pay', 2.6]],
    mascot: 'encouraging',
    tint: C.orange,
  },
  {
    sec: 14,
    kicker: 'الدرس',
    ar: 'درس قصير على شكل مهمة',
    en: 'Video → Flashcards → Quiz — a lesson that feels like a mission',
    sub: 'Lesson',
    phone: [
      ['m-lesson-video', 1.5],
      ['m-flash-front', 1.2],
      ['m-flash-back', 1.2],
      ['m-mcq-selected', 1.2],
      ['m-mcq-correct', 1.3],
      ['m-mcq-wrong', 1.3],
      ['m-mcq-image', 1.3],
      ['m-true-false', 1.2],
      ['m-match', 1.3],
      ['m-lesson-done', 2.5],
    ],
    web: [['d-lesson-video', 2.8], ['d-flash', 2.6], ['d-mcq-correct', 2.8], ['d-mcq-explain', 2.8], ['d-match', 3.0]],
    mascot: 'thinking',
    tint: C.purple,
  },
  {
    sec: 10,
    kicker: 'اختبر شطارتك',
    ar: 'اختبر شطارتك: تحدّي آخر الوحدة',
    en: 'Unit challenge — score only at the end',
    sub: 'Unit challenge',
    phone: [['m-challenge-intro', 2.0], ['m-challenge-skip', 1.6], ['m-challenge-q', 1.6], ['m-challenge-match', 1.6], ['m-result-success', 1.6], ['m-result-near', 1.6]],
    web: [['d-challenge-intro', 3.4], ['d-overlay-challenge', 3.2], ['d-result-success', 3.4]],
    mascot: 'challenge',
    tint: C.navy,
    dark: true,
  },
  {
    sec: 6,
    kicker: '100%',
    ar: 'ولا غلطة! احتفال مخصوص للـ100%',
    en: 'A special celebration for 100%',
    sub: 'Perfect score',
    phone: [['m-100', 6]],
    web: [['d-100', 6]],
    mascot: 'completion',
    tint: C.yellow,
    dark: true,
    extra: 'orbit',
  },
  {
    sec: 6,
    kicker: 'الاختبار الأسبوعي',
    ar: 'اختبار أسبوعي + مراجعة بالبطاقات',
    en: 'Weekly test + flashcard review',
    sub: 'Weekly',
    phone: [['m-weekly-intro', 2], ['m-weekly-flash', 2], ['m-weekly-100', 2]],
    web: [['d-weekly-intro', 6]],
    mascot: 'ready',
    tint: C.blue,
  },
  {
    sec: 8,
    kicker: 'ملتقى العباقرة',
    ar: 'اسأل المعلّم · والمساعد الذكي يشرح',
    en: 'Genius Hub — ask a teacher · AI assistant',
    sub: 'Community & AI',
    phone: [['m-hub', 1.8], ['m-hub-question', 2.0, true], ['m-ask-teacher', 1.8], ['m-ai', 2.4]],
    web: [['d-hub', 2.8], ['d-ask-teacher', 2.4], ['d-ai', 2.8]],
    mascot: 'encouraging',
    tint: C.green,
  },
  {
    sec: 6,
    kicker: 'المتصدرون',
    ar: 'منافسة صحّية ومشاركة النتيجة',
    en: 'Friendly competition & shareable cards',
    sub: 'Leaderboard',
    phone: [['m-leaderboard', 6]],
    mascot: 'success',
    tint: C.yellow,
    extra: 'cards',
  },
  {
    sec: 8,
    kicker: 'المتجر والدفع',
    ar: 'متجر ودفع بطرق عُمانية',
    en: 'Store · OmanNet · Apple Pay · Thawani',
    sub: 'Store & payment',
    phone: [['m-store', 1.6], ['m-product', 1.4], ['m-cart', 1.4], ['m-pay-thawani', 1.8, true], ['m-order-ok', 1.8]],
    web: [['d-store', 2.8], ['d-pay-apple', 2.6], ['d-buy', 2.6]],
    mascot: 'launch',
    tint: C.orange,
  },
  {
    sec: 4,
    kicker: 'حسابي',
    ar: 'سلسلة الأيام · حسابي · الإشعارات',
    en: 'Streak · account · notifications',
    sub: 'Profile',
    phone: [['m-streak', 1.2], ['m-account-page', 1.0], ['m-more', 0.9], ['m-notifications', 0.9]],
    web: [['d-streak', 2], ['d-account-page', 2]],
    mascot: 'calm',
    tint: C.purple,
  },
];

const toShots = (l: [string, number, boolean?][]): Shot[] => l.map(([name, sec, scroll]) => ({name, dur: s(sec), scroll}));

/** Rocket on a 145px orbit with a yellow trail (same spec as the 100% screen). */
export const Orbit: React.FC<{start?: number; R?: number}> = ({start = 6, R = 145}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const ang = -Math.PI / 2 + t * Math.PI * 2;
  const L = 2 * Math.PI * R;
  const box = R * 2 + 120;
  const c = box / 2;
  return (
    <div style={{position: 'relative', width: box, height: box}}>
      <svg width={box} height={box} style={{position: 'absolute'}}>
        <circle cx={c} cy={c} r={R} stroke="rgba(255,255,255,.18)" strokeWidth={10} fill="none" strokeDasharray="14 12" />
        <circle cx={c} cy={c} r={R} stroke={C.yellow} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - t)} transform={`rotate(-90 ${c} ${c})`} />
      </svg>
      <div style={{position: 'absolute', left: c - 80, top: c - 80, width: 160, height: 160, borderRadius: 80, background: C.yellow, border: `6px solid ${C.ink}`, boxSizing: 'border-box', display: 'grid', placeItems: 'center', fontFamily: CAIRO, fontWeight: 800, fontSize: 50, color: C.ink}}>
        100%
      </div>
      <div style={{position: 'absolute', left: c + Math.cos(ang) * R - 32, top: c + Math.sin(ang) * R - 42, transform: `rotate(${(ang * 180) / Math.PI + 90}deg)`}}>
        <Mascot state="flying" size={64} />
      </div>
    </div>
  );
};

const Segment: React.FC<{ch: Chapter; n: number; len: number}> = ({ch, n, len}) => {
  const frame = useCurrentFrame();
  const phoneIn = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.25))});
  const webIn = interpolate(frame, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const side = useSnap(6);
  const out = interpolate(frame, [len - 8, len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const hasWeb = !!ch.web;
  const phoneScale = 0.6;
  const pw = (750 + 24) * phoneScale;
  const tilt = Math.sin(frame / 40) * 1.2;
  const fg = ch.dark ? C.white : C.ink;
  return (
    <AbsoluteFill style={{transform: `translateX(${-out * 160}px)`, opacity: 1 - out}}>
      <div style={{position: 'absolute', top: 262, width: '100%', textAlign: 'center'}}>
        <Kicker n={`${String(n + 1).padStart(2, '0')}`} ar={ch.kicker} en={ch.sub} bg={ch.tint === C.yellow ? C.yellow : ch.tint} color={ch.tint === C.yellow ? C.ink : C.white} />
      </div>
      <Caption ar={ch.ar} en={ch.en} size={50} delay={2} color={fg} style={{position: 'absolute', top: 345, left: 50, right: 50}} />
      {/* left column: mascot + web (or extras) */}
      {hasWeb && !ch.extra ? (
        <div style={{position: 'absolute', left: 40, top: 1010 + (1 - webIn) * 700, opacity: webIn, transform: `rotate(${-2 + tilt * 0.5}deg)`}}>
          <BrowserFrame width={640}>
            <Cycle shots={toShots(ch.web!)} />
          </BrowserFrame>
          <Tape x={60} y={-22} w={130} rot={-9} />
        </div>
      ) : null}
      {ch.extra === 'orbit' ? (
        <>
          <div style={{position: 'absolute', left: 30, top: 600, transform: `scale(${side})`}}>
            <Orbit start={6} />
          </div>
          <div style={{position: 'absolute', left: 40, top: 1080 + (1 - webIn) * 700, opacity: webIn, transform: 'rotate(-2deg)'}}>
            <BrowserFrame width={560}>
              <Cycle shots={toShots(ch.web!)} />
            </BrowserFrame>
          </div>
          <Confetti x={540} y={760} start={60} count={36} spread={520} seed="c100" />
        </>
      ) : null}
      {ch.extra === 'cards'
        ? ['m-sharecard-3', 'm-sharecard-2', 'm-sharecard-1'].map((c, i) => {
            const e = useSnap(10 + i * 6); // eslint-disable-line react-hooks/rules-of-hooks
            return (
              <div key={c} style={{position: 'absolute', left: 50 + i * 70, top: 640 + i * 150, transform: `scale(${e}) rotate(${[-12, -4, 5][i]}deg)`}}>
                <Cutout src={`screens/${c}.webp`} w={340} h={493} radius={30} border={5} />
              </div>
            );
          })
        : null}
      {/* phone */}
      <div style={{position: 'absolute', left: 1080 - pw - 50 + (1 - phoneIn) * 800, top: 540, transform: `rotate(${2 + tilt}deg)`}}>
        <div style={{position: 'absolute', inset: 0, transform: 'translate(-20px, 20px)', background: ch.tint === C.navy ? C.yellow : ch.tint, borderRadius: 40}} />
        <PhoneFrame scale={phoneScale}>
          <Cycle shots={toShots(ch.phone)} />
        </PhoneFrame>
      </div>
      <div style={{position: 'absolute', left: hasWeb && !ch.extra ? 70 : 90, top: hasWeb && !ch.extra ? 640 : 1300, transform: `scale(${side}) rotate(-6deg)`}}>
        <Mascot state={ch.mascot} size={hasWeb && !ch.extra ? 190 : 150} sticker />
      </div>
      {hasWeb && !ch.extra ? (
        <div dir="rtl" style={{position: 'absolute', left: 290, top: 690, width: 230, fontFamily: CAIRO, color: fg, opacity: side}}>
          <div style={{fontSize: 120, fontWeight: 800, lineHeight: 0.9, color: ch.tint === C.navy ? C.yellow : ch.tint}}>{String(n + 1).padStart(2, '0')}</div>
          <div dir="ltr" style={{fontSize: 22, fontWeight: 700, opacity: 0.6, textAlign: 'right'}}>📱 + 🖥️</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const Tour: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      {chapters.map((ch, i) => {
        const len = s(ch.sec);
        const from = at;
        at += len;
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            {ch.dark ? (
              <Paper color={C.navy} line="rgba(255,255,255,.05)">
                <Halftone x={-100} y={1250} w={520} h={520} color="rgba(252,194,8,.6)" />
              </Paper>
            ) : (
              <Paper>
                <Halftone x={i % 2 ? -140 : 700} y={i % 2 ? 1200 : 300} w={500} h={500} color={ch.tint === C.navy ? C.blue : ch.tint} />
              </Paper>
            )}
            <Segment ch={ch} n={i} len={len} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const TOUR_LEN = chapters.reduce((a, c) => a + s(c.sec), 0);
