import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Caption} from '../components/Caption';
import {BrowserFrame, PhoneFrame, Screen} from '../components/Frames';
import {useEnter, useHover} from '../components/motion';
import {Rocket} from '../components/Rocket';
import {C, CAIRO, s} from '../theme';

type Shot = {src: string; label: string; scroll?: boolean};
type Seg = {
  sec: number;
  ar: string;
  en: string;
  phone: Shot[];
  web?: Shot[];
  side: 'number' | 'orbit';
  tint: string;
};

const segs: Seg[] = [
  {
    sec: 8,
    ar: 'تسجيل بسيط · وولي الأمر بيتأكّد بواتساب',
    en: 'Simple sign-up · parent verified on WhatsApp',
    phone: [
      {src: 'screens/m-login.png', label: 'تسجيل الدخول'},
      {src: 'screens/m-whatsapp.png', label: 'واتساب ولي الأمر'},
    ],
    web: [{src: 'screens/d-login.png', label: 'تسجيل الدخول · ويب'}],
    side: 'number',
    tint: C.green,
  },
  {
    sec: 10,
    ar: 'مساري: الخريطة اللي الطالب بيلعب عليها',
    en: 'My Path — the game map',
    phone: [{src: 'screens/m-path.png', label: 'مسار المادة', scroll: true}],
    web: [{src: 'screens/d-path.png', label: 'مسار المادة · ويب', scroll: true}],
    side: 'number',
    tint: C.blue,
  },
  {
    sec: 8,
    ar: 'التجربة المجانية: درس كامل ببلاش',
    en: 'Free trial: a full lesson',
    phone: [{src: 'screens/m-trial.png', label: 'التجربة المجانية', scroll: true}],
    web: [{src: 'screens/d-trial.png', label: 'التجربة المجانية · ويب'}],
    side: 'number',
    tint: C.orange,
  },
  {
    sec: 12,
    ar: 'درس قصير على شكل مهمة',
    en: 'A lesson that feels like a mission',
    phone: [
      {src: 'screens/m-lesson-video.png', label: 'الدرس · فيديو'},
      {src: 'screens/m-lesson-card.png', label: 'الدرس · بطاقة'},
      {src: 'screens/m-lesson-quiz.png', label: 'الدرس · سؤال'},
    ],
    web: [{src: 'screens/d-lesson-quiz.png', label: 'الدرس · سؤال · ويب'}],
    side: 'number',
    tint: C.purple,
  },
  {
    sec: 10,
    ar: 'اختبر شطارتك: تحدّي آخر الوحدة',
    en: 'Unit challenge',
    phone: [
      {src: 'screens/m-challenge-intro.png', label: 'اختبر شطارتك'},
      {src: 'screens/m-challenge-q.png', label: 'اختبر شطارتك · سؤال'},
    ],
    side: 'number',
    tint: C.navy,
  },
  {
    sec: 10,
    ar: 'ولا غلطة! احتفال مخصوص للـ100%',
    en: 'A special celebration for 100%',
    phone: [{src: 'screens/m-100.png', label: 'احتفال 100%'}],
    web: [{src: 'screens/d-100.png', label: 'احتفال 100% · ويب'}],
    side: 'orbit',
    tint: C.navy,
  },
  {
    sec: 6,
    ar: 'منافسة صحّية ومشاركة النتيجة',
    en: 'Friendly competition & sharing',
    phone: [
      {src: 'screens/m-leaderboard.png', label: 'المتصدرون', scroll: true},
      {src: 'screens/m-sharecard.png', label: 'كارت المشاركة'},
    ],
    side: 'number',
    tint: C.yellow,
  },
  {
    sec: 6,
    ar: 'متجر ودفع بطرق عُمانية',
    en: 'Store & Omani payment methods',
    phone: [{src: 'screens/m-pay.png', label: 'ملخّص الدفع'}],
    web: [
      {src: 'screens/d-store.png', label: 'المتجر · ويب'},
      {src: 'screens/d-pay-visa.png', label: 'الدفع · فيزا · ويب'},
    ],
    side: 'number',
    tint: C.green,
  },
];

/** Crossfades through `shots`, each getting an equal slice of `len` frames. */
const ShotStack: React.FC<{shots: Shot[]; len: number; kind: 'mobile' | 'web'; tint: string}> = ({shots, len, kind, tint}) => {
  const frame = useCurrentFrame();
  const slice = len / shots.length;
  return (
    <>
      {shots.map((sh, i) => {
        const a = i * slice;
        const o = i === 0 ? 1 : interpolate(frame, [a - 6, a + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const x = i === 0 ? 0 : interpolate(frame, [a - 6, a + 8], [100, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return (
          <div key={sh.src} style={{position: 'absolute', inset: 0, opacity: o, transform: `translateX(${x}px)`}}>
            <Screen src={sh.src} label={sh.label} kind={kind} tint={tint} scroll={sh.scroll ? [a + 20, a + slice - 10] : undefined} />
          </div>
        );
      })}
    </>
  );
};

/** Rocket on a 145px orbit around the avatar, yellow trail via strokeDashoffset (same spec as the 100% screen). */
const Orbit: React.FC<{size?: number; start?: number}> = ({size = 1, start = 10}) => {
  const frame = useCurrentFrame();
  const R = 145;
  const t = interpolate(frame, [start, start + 75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const ang = -Math.PI / 2 + t * Math.PI * 2;
  const L = 2 * Math.PI * R;
  const pop = useEnter(start + 70, 8);
  return (
    <div style={{position: 'relative', width: 400, height: 400, transform: `scale(${size})`}}>
      <svg width={400} height={400} style={{position: 'absolute'}}>
        <circle cx={200} cy={200} r={R} stroke="rgba(255,255,255,.18)" strokeWidth={10} fill="none" />
        <circle
          cx={200}
          cy={200}
          r={R}
          stroke={C.yellow}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - t)}
          transform="rotate(-90 200 200)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 200 - 90,
          top: 200 - 90,
          width: 180,
          height: 180,
          borderRadius: 90,
          background: C.yellow,
          border: `6px solid ${C.ink}`,
          boxSizing: 'border-box',
          display: 'grid',
          placeItems: 'center',
          fontFamily: CAIRO,
          fontWeight: 800,
          fontSize: 56,
          color: C.ink,
          transform: `scale(${0.85 + pop * 0.15})`,
        }}
      >
        100%
      </div>
      <div
        style={{
          position: 'absolute',
          left: 200 + Math.cos(ang) * R - 30,
          top: 200 + Math.sin(ang) * R - 42,
          transform: `rotate(${(ang * 180) / Math.PI + 180}deg)`,
        }}
      >
        <Rocket size={60} mood="cheer" />
      </div>
    </div>
  );
};

const Segment: React.FC<{seg: Seg; n: number; len: number}> = ({seg, n, len}) => {
  const frame = useCurrentFrame();
  const phoneIn = interpolate(frame, [0, 19], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.2))});
  const webIn = interpolate(frame, [6, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const side = useEnter(10, 14);
  const hover = useHover(8);
  const hasWeb = !!seg.web;
  const phoneScale = hasWeb ? 0.6 : 0.66;
  const phoneLeft = hasWeb ? 560 : 1080 - 750 * phoneScale - 90;
  return (
    <AbsoluteFill>
      <Caption ar={seg.ar} en={seg.en} size={52} delay={2} style={{position: 'absolute', top: 268, left: 60, right: 60}} />
      {/* side element: step counter or the 100% orbit */}
      <div style={{position: 'absolute', left: 60, top: 560, width: 460, height: 560, opacity: side, transform: `translateY(${(1 - side) * 30}px)`}}>
        {seg.side === 'orbit' ? (
          <div style={{position: 'absolute', inset: 0, background: C.navy, borderRadius: 40, display: 'grid', placeItems: 'center', overflow: 'hidden'}}>
            <Orbit size={1.05} start={14} />
          </div>
        ) : (
          <div style={{fontFamily: CAIRO, paddingTop: 30}}>
            <div style={{fontSize: 200, fontWeight: 800, color: seg.tint === C.yellow ? C.orange : seg.tint, lineHeight: 0.9}}>{`0${n + 1}`}</div>
            <div style={{fontSize: 28, fontWeight: 700, color: C.ink, opacity: 0.5, marginTop: 10}}>/ 08</div>
            <div style={{marginTop: 40, transform: `translateY(${hover}px)`}}>
              <Rocket size={130} mood={(['happy', 'launch', 'wow', 'focus', 'think', 'cheer', 'proud', 'love'] as const)[n]} flame={0.6} />
            </div>
          </div>
        )}
      </div>
      {/* web strip (behind the phone) */}
      {hasWeb ? (
        <div style={{position: 'absolute', left: 50, top: 1190 + (1 - webIn) * 900, opacity: webIn}}>
          <BrowserFrame width={720} height={480}>
            <ShotStack shots={seg.web!} len={len} kind="web" tint={seg.tint} />
          </BrowserFrame>
        </div>
      ) : null}
      {/* phone slides in from the right (RTL) */}
      <div style={{position: 'absolute', left: phoneLeft + (1 - phoneIn) * 700, top: hasWeb ? 520 : 520}}>
        <div style={{position: 'absolute', inset: 0, transform: 'translate(-20px, 20px)', background: seg.tint, borderRadius: 56 * phoneScale + 6}} />
        <PhoneFrame scale={phoneScale}>
          <ShotStack shots={seg.phone} len={len} kind="mobile" tint={seg.tint} />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

export const S07Tour: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{background: C.surface}}>
      {segs.map((seg, i) => {
        const len = s(seg.sec);
        const from = at;
        at += len;
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <Segment seg={seg} n={i} len={len} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export {Orbit};
