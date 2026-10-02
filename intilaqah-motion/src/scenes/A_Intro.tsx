import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Avatar, Stars} from '../components/Bits';
import {Caption} from '../components/Caption';
import {Cutout, Halftone, Kicker, LogoMark, Mascot, MascotState, Paper, Tape, Torn} from '../components/Collage';
import {useHover, useProgress, useSnap} from '../components/motion';
import {C, CAIRO} from '../theme';

/* ───────── Opening · 0:00 → 0:10 ───────── */
export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = useProgress(4, 26, Easing.out(Easing.back(1.4)));
  const y = interpolate(rise, [0, 1], [2100, 380]);
  const hv = useHover(10);
  const hover = rise > 0.99 ? hv : 0;
  const shake = frame < 30 ? Math.sin(frame * 2.2) * (1 - frame / 30) * 6 : 0;
  const logo = useSnap(30);
  const flash = interpolate(frame, [28, 31, 40], [0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const credit = useSnap(150);
  // screens flying past behind the title — a teaser of the whole product
  const teaser = ['m-path', 'm-lesson-video', 'm-100', 'm-leaderboard', 'm-store', 'm-hub'];
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <Stars count={110} />
      {teaser.map((n, i) => {
        const t = interpolate(frame, [70 + i * 9, 300], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        if (t <= 0) return null;
        const col = i % 3;
        return (
          <div
            key={n}
            style={{
              position: 'absolute',
              left: [-40, 380, 800][col] - 60,
              top: 2000 - t * 2600 - (i > 2 ? 500 : 0),
              transform: `rotate(${[-9, 4, 10][col]}deg)`,
              opacity: 0.22,
            }}
          >
            <Cutout src={`screens/${n}.webp`} w={300} h={675} radius={30} border={4} />
          </div>
        );
      })}
      {/* launch trail */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path
          d={`M540 1920 L540 ${y + 360}`}
          stroke={C.yellow}
          strokeWidth={26}
          strokeLinecap="round"
          opacity={interpolate(frame, [26, 70], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        />
      </svg>
      <div style={{position: 'absolute', left: 540 - 130 + shake, top: y + hover}}>
        <Mascot state="launch" size={260} />
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
      <div style={{position: 'absolute', top: 760, width: '100%', display: 'flex', justifyContent: 'center', transform: `scale(${logo})`}}>
        <div style={{background: C.white, borderRadius: 40, padding: '18px 40px', border: `6px solid ${C.ink}`, transform: 'rotate(-2deg)'}}>
          <LogoMark size={190} glyph="blue" />
        </div>
      </div>
      <Tape x={330} y={740} w={150} rot={-14} delay={40} />
      <Tape x={640} y={1060} w={140} rot={10} delay={44} />
      <Caption
        ar="انطلاقة — أكاديمية الفيزياء"
        en="Intilaqah — a game-like physics journey"
        color={C.white}
        delay={52}
        size={70}
        style={{position: 'absolute', top: 1150, width: '100%'}}
      />
      <div style={{position: 'absolute', top: 1360, width: '100%', textAlign: 'center'}}>
        <Kicker ar="تصميم UX/UI كامل · موبايل + ويب + لوحة تحكم" delay={84} />
        <div dir="ltr" style={{fontFamily: CAIRO, fontSize: 24, color: C.white, opacity: 0.7, marginTop: 12}}>
          Full UX/UI · Mobile + Web + Admin dashboard
        </div>
      </div>
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          top: 1490,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 18,
          fontFamily: CAIRO,
          color: C.white,
          opacity: credit,
          transform: `translateY(${(1 - credit) * 30}px)`,
        }}
      >
        <Avatar src={staticFile('brand/sayed-avatar.jpg')} size={78} />
        <div>
          <div style={{fontSize: 28, fontWeight: 700}}>تصميم: سيد حمودة</div>
          <div dir="ltr" style={{fontSize: 19, opacity: 0.7, textAlign: 'right'}}>
            Designed by Sayed Hamouda
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Problem · 0:10 → 0:22 ───────── */
const problems: {e: string; ar: string; en: string; c: string; m: MascotState}[] = [
  {e: '📚', ar: 'محتوى كتير ومن غير ترتيب', en: 'Scattered content', c: C.orange, m: 'thinking'},
  {e: '😴', ar: 'مفيش حافز يكمّل', en: 'No reason to keep going', c: C.purple, m: 'calm'},
  {e: '🇴🇲', ar: 'منهج عُماني بلغة عربية · RTL', en: 'Omani curriculum · Arabic RTL', c: C.green, m: 'encouraging'},
];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Paper>
      <Halftone x={700} y={160} w={460} h={460} color={C.orange} />
      <Halftone x={-120} y={1350} w={480} h={480} color={C.blue} />
      <Caption
        ar={
          <>
            المذاكرة بقت تقيلة
            <br />
            على طالب الصف التاسع
          </>
        }
        en="Studying physics feels heavy for Grade 9 students"
        delay={2}
        size={66}
        style={{position: 'absolute', top: 270, width: '100%'}}
      />
      {problems.map((p, i) => {
        const at = 26 + i * 10;
        const e = useSnap(at); // eslint-disable-line react-hooks/rules-of-hooks
        const rot = [-3, 2.5, -2][i];
        const wob = Math.sin((frame + i * 20) / 18) * 0.6;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 650 + i * 270,
              left: 90,
              right: 90,
              transform: `translateX(${(1 - e) * (i % 2 ? -1200 : 1200)}px) rotate(${rot + wob}deg)`,
            }}
          >
            <div style={{position: 'absolute', inset: 0, transform: 'translate(-16px, 16px)', background: p.c, borderRadius: 30}} />
            <div
              dir="rtl"
              style={{
                position: 'relative',
                background: C.white,
                border: `5px solid ${C.ink}`,
                borderRadius: 30,
                padding: '26px 34px',
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                fontFamily: CAIRO,
              }}
            >
              <div style={{width: 112, height: 112, flex: 'none', borderRadius: 26, background: p.c, display: 'grid', placeItems: 'center', fontSize: 60}}>{p.e}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 44, fontWeight: 800, color: C.ink, lineHeight: 1.3}}>{p.ar}</div>
                <div dir="ltr" style={{fontSize: 26, fontWeight: 500, color: C.ink, opacity: 0.6, textAlign: 'right'}}>
                  {p.en}
                </div>
              </div>
              <Mascot state={p.m} size={96} />
            </div>
            <Tape x={i % 2 ? 40 : 700} y={-22} w={130} rot={i % 2 ? -10 : 8} delay={at + 6} />
          </div>
        );
      })}
    </Paper>
  );
};

/* ───────── Idea · 0:22 → 0:34 ───────── */
const steps: {ar: string; en: string; c: string; shot: string; m: MascotState}[] = [
  {ar: 'خريطة', en: 'Map', c: C.blue, shot: 'm-path', m: 'idle'},
  {ar: 'مهمة', en: 'Mission', c: C.orange, shot: 'm-lesson-video', m: 'ready'},
  {ar: 'تحدّي', en: 'Challenge', c: C.purple, shot: 'm-challenge-intro', m: 'challenge'},
  {ar: 'تقدّم', en: 'Progress', c: C.green, shot: 'm-result-success', m: 'success'},
];

export const Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [30, 250], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  // zig-zag positions (RTL: start top-right)
  const P = [
    {x: 760, y: 700},
    {x: 320, y: 930},
    {x: 760, y: 1160},
    {x: 320, y: 1390},
  ];
  const d = P.map((p, i) => (i === 0 ? `M${p.x} ${p.y}` : `C${P[i - 1].x} ${P[i - 1].y + 140}, ${p.x} ${p.y - 140}, ${p.x} ${p.y}`)).join(' ');
  const L = 1600;
  const travel = draw * (P.length - 1);
  const k = Math.min(P.length - 2, Math.floor(travel));
  const f = travel - k;
  const rx = P[k].x + (P[k + 1].x - P[k].x) * f;
  const ry = P[k].y + (P[k + 1].y - P[k].y) * f;
  return (
    <Paper color={C.navy} line="rgba(255,255,255,.05)">
      <Caption
        ar="حوّلنا المذاكرة لرحلة لعبة"
        en="We turned studying into a game journey"
        color={C.white}
        delay={2}
        style={{position: 'absolute', top: 280, width: '100%'}}
      />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d={d} stroke="rgba(255,255,255,.15)" strokeWidth={16} fill="none" strokeDasharray="2 30" strokeLinecap="round" />
        <path d={d} stroke={C.yellow} strokeWidth={16} fill="none" strokeLinecap="round" pathLength={L} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
      </svg>
      {steps.map((s, i) => {
        const at = 18 + i * 62;
        const e = useSnap(at); // eslint-disable-line react-hooks/rules-of-hooks
        const p = P[i];
        const side = i % 2 === 0 ? -1 : 1; // screenshot on the opposite side of the node
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: p.x + side * 330 - 105,
                top: p.y - 150,
                transform: `scale(${e}) rotate(${side * 6}deg)`,
                opacity: Math.min(1, e),
              }}
            >
              <Cutout src={`screens/${s.shot}.webp`} w={210} h={300} radius={22} border={4} pos="50% 20%" />
            </div>
            <div style={{position: 'absolute', left: p.x - 95, top: p.y - 95, width: 190, textAlign: 'center', transform: `scale(${e})`}}>
              <div
                style={{
                  width: 190,
                  height: 190,
                  borderRadius: 95,
                  background: s.c,
                  border: `8px solid ${C.white}`,
                  boxSizing: 'border-box',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: CAIRO,
                  fontWeight: 800,
                  fontSize: 46,
                  color: C.white,
                }}
              >
                {s.ar}
              </div>
              <div style={{fontFamily: CAIRO, fontSize: 26, color: C.white, opacity: 0.75, marginTop: 6}}>{s.en}</div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{position: 'absolute', left: rx - 55, top: ry - 165, opacity: draw > 0 ? 1 : 0}}>
        <Mascot state={draw >= 1 ? 'success' : 'flying'} size={110} />
      </div>
      <Torn y={1650} color={C.yellow} seed="idea" />
    </Paper>
  );
};
