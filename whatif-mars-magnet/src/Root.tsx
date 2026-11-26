import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import cues from './cues.json';
export const Root: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={cues.totalFrames} fps={30} width={1080} height={1920} />
);
