import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {S01Opening, S02Problem, S03Idea} from './scenes/S01to03';
import {S04Journey, S05Decisions} from './scenes/S04to05';
import {S06DesignSystem} from './scenes/S06DesignSystem';
import {S07Tour} from './scenes/S07Tour';
import {S08Numbers, S09Fixes, S10Closing} from './scenes/S08to10';
import {asset, C, CAIRO, s} from './theme';

// Scene table (seconds). Every boundary is an even second = a bar start at 120 BPM.
export const SCENES: [number, number, React.FC][] = [
  [0, 12, S01Opening],
  [12, 30, S02Problem],
  [30, 45, S03Idea],
  [45, 70, S04Journey],
  [70, 90, S05Decisions],
  [90, 130, S06DesignSystem],
  [130, 200, S07Tour],
  [200, 215, S08Numbers],
  [215, 230, S09Fixes],
  [230, 240, S10Closing],
];

/** Brand transition: a #FCC208 panel covers the frame from the right, then uncovers to the left (12 frames). */
const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const cover = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const reveal = interpolate(frame, [6, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const right = 0;
  const width = 1080 * (frame < 6 ? cover : 1 - reveal);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: frame < 6 ? right : undefined,
          left: frame < 6 ? undefined : 0,
          width,
          background: C.yellow,
        }}
      />
    </AbsoluteFill>
  );
};

export const Intilaqah: React.FC = () => {
  const music = asset('audio/music.mp3');
  return (
    <AbsoluteFill style={{background: C.navy, fontFamily: CAIRO}}>
      {SCENES.map(([a, b, Scene], i) => (
        <Sequence key={i} from={s(a)} durationInFrames={s(b - a)} name={Scene.displayName ?? Scene.name}>
          <Scene />
        </Sequence>
      ))}
      {SCENES.slice(1).map(([a], i) => (
        <Sequence key={`w${i}`} from={s(a) - 6} durationInFrames={12} name="wipe">
          <Wipe />
        </Sequence>
      ))}
      {music ? <Audio src={music} /> : null}
    </AbsoluteFill>
  );
};
