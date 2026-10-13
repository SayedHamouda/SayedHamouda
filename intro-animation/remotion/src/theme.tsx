import "@fontsource/readex-pro/400.css";
import "@fontsource/readex-pro/600.css";
import "@fontsource/readex-pro/700.css";
import { interpolate, Easing } from "remotion";

export const FONT = "Readex Pro, sans-serif";
export const C = {
  night: "#0B1530",
  ink: "#141824",
  muted: "#6B7385",
  line: "#E4E8F0",
  surface: "#FFFFFF",
  window: "#F7F9FC",
  red: "#E5484D",
  redSoft: "#FDECEC",
  orange: "#FF7A1A",
  blue: "#0A66C2",
  green: "#16A34A",
};

// interpolate with clamping on both sides, the default for every animation in this film.
export const clamp = (f: number, input: number[], output: number[], ease?: (t: number) => number) =>
  interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

export const Cursor: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${scale})`, transformOrigin: "4px 2px" }}>
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.6-6.9L4 20z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  </div>
);
