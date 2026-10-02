import React from 'react';
import {Composition} from 'remotion';
import {Intilaqah} from './Video';
import {FPS, H, W} from './theme';

export const Root: React.FC = () => (
  <Composition id="Intilaqah" component={Intilaqah} durationInFrames={7200} fps={FPS} width={W} height={H} />
);
