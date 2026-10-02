import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {M} from '../theme';

/** Spring 0→1 starting at `delay` frames (damping 18 per the Caption spec). */
export const useEnter = (delay = 0, damping = 18) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping}});
};

/** Linear-time 0→1 over [start, start+dur] with an easing curve. */
export const useProgress = (start: number, dur: number, ease = Easing.out(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
};

/** Hover token: ±amp px sine float on a 2400ms period. */
export const useHover = (amp = 10, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(((frame + phase) / M.hover) * Math.PI * 2) * amp;
};

/** Fade out over the last `dur` frames of a sequence of length `len`. */
export const useExit = (len: number, dur = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [len - dur, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};
