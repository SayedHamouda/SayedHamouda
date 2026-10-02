import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Avatar, Card, Stars} from '../components/Bits';
import {Caption} from '../components/Caption';
import {useEnter, useHover, useProgress} from '../components/motion';
import {Logo, Rocket} from '../components/Rocket';
import {C, CAIRO} from '../theme';

/* ───────── Scene 1 · Opening (0:00 → 0:12) ───────── */
export const S01Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = useProgress(8, 40, Easing.out(Easing.back(1.1)));
  const y = interpolate(rise, [0, 1], [2100, 560]);
  const hover = useHover(10);
  const flame = 0.85 + Math.sin(frame * 0.9) * 0.15;
  const logo = useEnter(54, 12);
  const credit = useEnter(150);
  return (
    <AbsoluteFill style={{background: C.navy}}>
      <Stars />
      {/* yellow trail from the bottom edge to the rocket */}
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path
          d={`M540 1920 L540 ${y + 300 + (rise > 0.98 ? hover : 0)}`}
          stroke={C.yellow}
          strokeWidth={22}
          strokeLinecap="round"
          opacity={interpolate(frame, [48, 110], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        />
      </svg>
      <div style={{position: 'absolute', left: 540 - 110, top: y + (rise > 0.98 ? hover : 0)}}>
        <Rocket size={220} mood="launch" flame={flame} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 940,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          fontFamily: CAIRO,
          transform: `scale(${logo})`,
          opacity: logo,
        }}
      >
        <Logo size={110} />
      </div>
      <Caption
        ar="انطلاقة — أكاديمية الفيزياء"
        en="Intilaqah — a game-like physics journey"
        color={C.white}
        delay={80}
        size={66}
        style={{position: 'absolute', top: 1110, width: '100%'}}
      />
      <Caption
        ar="تصميم UX/UI كامل · موبايل + ويب"
        en="Full UX/UI design · Mobile + Web"
        color={C.yellow}
        enColor={C.white}
        delay={112}
        size={40}
        weight={700}
        style={{position: 'absolute', top: 1310, width: '100%'}}
      />
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          top: 1440,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 18,
          fontFamily: CAIRO,
          color: C.white,
          opacity: credit,
          transform: `translateY(${(1 - credit) * 24}px)`,
        }}
      >
        <Avatar src={staticFile('brand/sayed-avatar.jpg')} size={84} />
        <div>
          <div style={{fontSize: 30, fontWeight: 700}}>تصميم: سيد حمودة</div>
          <div dir="ltr" style={{fontSize: 20, fontWeight: 500, opacity: 0.7, textAlign: 'right'}}>
            Designed by Sayed Hamouda
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Scene 2 · Problem (0:12 → 0:30) ───────── */
const problems = [
  {e: '📚', ar: 'محتوى كتير ومن غير ترتيب', en: 'Scattered content', c: C.orange},
  {e: '😴', ar: 'مفيش حافز يكمّل', en: 'No reason to keep going', c: C.purple},
  {e: '🇴🇲', ar: 'منهج عُماني بلغة عربية · RTL', en: 'Omani curriculum · Arabic RTL', c: C.green},
];

export const S02Problem: React.FC = () => {
  const r = useEnter(150);
  const hover = useHover(8);
  return (
    <AbsoluteFill style={{background: C.surface}}>
      <Caption
        ar={
          <>
            المذاكرة بقت تقيلة
            <br />
            على طالب الصف التاسع
          </>
        }
        en="Studying physics feels heavy for Grade 9 students"
        delay={6}
        style={{position: 'absolute', top: 280, width: '100%'}}
      />
      <div style={{position: 'absolute', top: 640, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 40}}>
        {problems.map((p, i) => (
          <Card key={i} delay={40 + i * 8} from="right" style={{display: 'flex', alignItems: 'center', gap: 32, padding: '34px 40px'}}>
            <div
              dir="rtl"
              style={{display: 'flex', alignItems: 'center', gap: 32, width: '100%', fontFamily: CAIRO}}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  flex: 'none',
                  borderRadius: 28,
                  background: p.c,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 64,
                }}
              >
                {p.e}
              </div>
              <div>
                <div style={{fontSize: 44, fontWeight: 800, color: C.ink, lineHeight: 1.3}}>{p.ar}</div>
                <div dir="ltr" style={{fontSize: 28, fontWeight: 500, color: C.ink, opacity: 0.6, textAlign: 'right'}}>
                  {p.en}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{position: 'absolute', left: 90, top: 1340 + hover, opacity: r, transform: `rotate(${-12 + (1 - r) * 20}deg)`}}>
        <Rocket size={150} mood="sleepy" flame={0.3} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── Scene 3 · Idea (0:30 → 0:45) ───────── */
const steps = [
  {x: 770, y: 680, e: '🗺️', ar: 'خريطة', en: 'Map', c: C.blue},
  {x: 310, y: 900, e: '🎯', ar: 'مهمة', en: 'Mission', c: C.orange},
  {x: 770, y: 1120, e: '⚡', ar: 'تحدّي', en: 'Challenge', c: C.purple},
  {x: 310, y: 1340, e: '📈', ar: 'تقدّم', en: 'Progress', c: C.green},
];

export const S03Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const d = steps
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y}`;
      const a = steps[i - 1];
      return `C${a.x} ${(a.y + p.y) / 2 + 60}, ${p.x} ${(a.y + p.y) / 2 - 60}, ${p.x} ${p.y}`;
    })
    .join(' ');
  const draw = interpolate(frame, [50, 230], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const L = 2000;
  return (
    <AbsoluteFill style={{background: C.white}}>
      <Caption
        ar="حوّلنا المذاكرة لرحلة لعبة"
        en="We turned studying into a game journey"
        delay={6}
        style={{position: 'absolute', top: 290, width: '100%'}}
      />
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d={d} stroke={C.line} strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray="2 34" />
        <path d={d} stroke={C.yellow} strokeWidth={18} fill="none" strokeLinecap="round" pathLength={L} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
      </svg>
      {steps.map((p, i) => {
        const at = 40 + i * 60;
        const e = useEnter(at, 11); // eslint-disable-line react-hooks/rules-of-hooks
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x - 90,
              top: p.y - 90,
              width: 180,
              textAlign: 'center',
              fontFamily: CAIRO,
              transform: `scale(${e})`,
            }}
          >
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                background: p.c,
                border: `8px solid ${C.ink}`,
                boxSizing: 'border-box',
                display: 'grid',
                placeItems: 'center',
                fontSize: 80,
              }}
            >
              {p.e}
            </div>
            <div style={{fontSize: 44, fontWeight: 800, color: C.ink, marginTop: 8}}>{p.ar}</div>
            <div style={{fontSize: 24, fontWeight: 500, color: C.ink, opacity: 0.6}}>{p.en}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
