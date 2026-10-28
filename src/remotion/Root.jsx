import React from 'react';
import { Composition } from 'remotion';
import { AetherReelComposition } from './AetherReelComposition';

export const RemotionRoot = () => {
  return (
    <>
      {/* 16:9 Widescreen Lossless 60fps Composition */}
      <Composition
        id="AetherReel"
        component={AetherReelComposition}
        durationInFrames={900}
        fps={60}
        width={1920}
        height={1080}
      />
      {/* 9:16 Vertical Reel Lossless 60fps Composition */}
      <Composition
        id="AetherReelVertical"
        component={AetherReelComposition}
        durationInFrames={900}
        fps={60}
        width={1080}
        height={1920}
      />
    </>
  );
};
export default RemotionRoot;
