import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Idea, Opening, Problem} from './scenes/A_Intro';
import {Decisions, Journey} from './scenes/B_UX';
import {DesignSystem} from './scenes/C_DesignSystem';
import {Tour} from './scenes/D_Tour';
import {Dashboard, Landing} from './scenes/E_Admin';
import {Closing, Fixes, Numbers} from './scenes/F_End';
import timeline from './timeline.json';
import {asset, C, CAIRO, s} from './theme';

const SCENES: Record<string, React.FC> = {
  opening: Opening,
  problem: Problem,
  idea: Idea,
  journey: Journey,
  decisions: Decisions,
  designSystem: DesignSystem,
  tour: Tour,
  dashboard: Dashboard,
  landing: Landing,
  numbers: Numbers,
  fixes: Fixes,
  closing: Closing,
};

/** Brand transition A: a #FCC208 panel sweeps in from the right and out to the left (12 frames). */
const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const cover = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const reveal = interpolate(frame, [6, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 0, bottom: 0, right: frame < 6 ? 0 : undefined, left: frame < 6 ? undefined : 0, width: 1080 * (frame < 6 ? cover : 1 - reveal), background: C.yellow}} />
    </AbsoluteFill>
  );
};

/** Brand transition B: three skewed bars (yellow · blue · navy) staggered by 2 frames. */
const Stripes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {[C.yellow, C.blue, C.navy].map((c, i) => {
        const f = frame - i * 2;
        const x = interpolate(f, [0, 7, 9, 14], [1300, 0, 0, -1500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
        return <div key={c} style={{position: 'absolute', top: -200, bottom: -200, left: -200, width: 1480, background: c, transform: `translateX(${x}px) skewX(-12deg)`}} />;
      })}
    </AbsoluteFill>
  );
};

export const Intilaqah: React.FC = () => {
  const music = asset('audio/music.mp3');
  return (
    <AbsoluteFill style={{background: C.navy, fontFamily: CAIRO}}>
      {timeline.scenes.map((sc) => {
        const Scene = SCENES[sc.id];
        return (
          <Sequence key={sc.id} from={s(sc.from)} durationInFrames={s(sc.to - sc.from)} name={sc.id}>
            <Scene />
          </Sequence>
        );
      })}
      {timeline.scenes.slice(1).map((sc, i) => (
        <Sequence key={`t${sc.id}`} from={s(sc.from) - 7} durationInFrames={20} name={`→ ${sc.id}`}>
          {i % 2 ? <Stripes /> : <Wipe />}
        </Sequence>
      ))}
      {music ? <Audio src={music} /> : null}
    </AbsoluteFill>
  );
};
