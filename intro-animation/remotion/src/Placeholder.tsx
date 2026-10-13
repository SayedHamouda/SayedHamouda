import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, clamp } from "./theme";

// Reserved slot for a character-acting clip that must come from an AI video tool.
// Same length as the final shot, so swapping in the real clip keeps the edit timing.
export const Placeholder: React.FC<{ code: string; title: string; action: string }> = ({ code, title, action }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = clamp(f, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #1A2547 0%, #070B18 100%)", fontFamily: FONT, color: "#fff", opacity: fade }}>
      <AbsoluteFill style={{ border: "2px dashed rgba(255,122,26,.55)", margin: 36, borderRadius: 24 }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", direction: "rtl", textAlign: "center", padding: 120, gap: 18 }}>
        <div style={{ fontSize: 18, letterSpacing: 2, color: C.orange, fontWeight: 600 }}>🎬 لقطة شخصيات · {code}</div>
        <div style={{ fontSize: 46, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 24, lineHeight: 1.6, color: "rgba(255,255,255,.75)", maxWidth: 900 }}>{action}</div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,.45)" }}>هتتولّد في أداة الفيديو وتتحط مكان الشاشة دي</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 60, height: 4, background: "rgba(255,255,255,.12)", borderRadius: 2 }}>
        <div style={{ width: `${(f / durationInFrames) * 100}%`, height: "100%", background: C.orange, borderRadius: 2 }} />
      </div>
    </AbsoluteFill>
  );
};
