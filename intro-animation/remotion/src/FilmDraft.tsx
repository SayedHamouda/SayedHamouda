import "@fontsource/readex-pro/400.css";
import "@fontsource/readex-pro/700.css";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Scene02Inbox } from "./Scene02Inbox";

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 15, 55, 75], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const y = interpolate(f, [0, 20], [12, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ fontFamily: "Readex Pro", fontWeight: 700, fontSize: 84, color: "#fff", direction: "rtl",
        transform: `translateY(${y}px)`, textShadow: "0 4px 24px rgba(0,0,0,.35)" }}>الخطوة الأولى</div>
    </AbsoluteFill>
  );
};

export const FilmDraft: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence durationInFrames={300}>
      <OffthreadVideo src={staticFile("scene01-graduation-v1.mp4")} style={{ width: "100%", height: "100%" }} />
      <Sequence from={12} durationInFrames={75}><Title /></Sequence>
    </Sequence>
    <Sequence from={300} durationInFrames={300}>
      <Scene02Inbox />
    </Sequence>
  </AbsoluteFill>
);
