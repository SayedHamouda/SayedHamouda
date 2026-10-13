import "@fontsource/readex-pro/400.css";
import "@fontsource/readex-pro/600.css";
import "@fontsource/readex-pro/700.css";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Scene 2, shot 5 (film 0:10–0:20): the camera pushes into the laptop on the desk and lands
// on an inbox filling up with rejections. Everything on the screen is crisp UI, not AI text.

const FONT = "Readex Pro, sans-serif";
const C = {
  night: "#0B1530",
  glow: "#3B82F6",
  window: "#F7F9FC",
  surface: "#FFFFFF",
  line: "#E4E8F0",
  ink: "#141824",
  muted: "#6B7385",
  red: "#E5484D",
  redSoft: "#FDECEC",
  orange: "#FF7A1A",
};

// Window geometry (absolute px inside 1280x720) so the cursor can hit real targets.
const WIN = { x: 80, y: 48, w: 1120, h: 624 };
const SIDEBAR_W = 210;
const LIST_X = WIN.x + SIDEBAR_W;
const TOOLBAR_Y = WIN.y + 64;
const LIST_TOP = TOOLBAR_Y + 52;
const ROW_H = 76;
const REFRESH = { x: LIST_X + 74, y: TOOLBAR_Y + 26 };

// Frames are relative to this scene (30 fps).
const PUSH_END = 48; // still-frame push-in into the laptop
const UI_IN = 42; // inbox fades/zooms in
const CLICK = 176; // cursor clicks refresh

type Mail = { from: string; subject: string; snippet: string; time: string; at: number };

// `at` = frame the email lands. Earlier ones are already there when the UI appears.
const MAILS: Mail[] = [
  { from: "Cairo Tech Hub", subject: "Application status", snippet: "Unfortunately, after careful review we will not be moving forward…", time: "Sun", at: 0 },
  { from: "Pixel Studio", subject: "Your CV", snippet: "This role requires 3+ years of professional experience…", time: "Mon", at: 0 },
  { from: "Delta Systems", subject: "Junior Designer role", snippet: "We regret to inform you that the position has been filled…", time: "Yesterday", at: 0 },
  { from: "BrightApps", subject: "Re: Frontend Intern", snippet: "Thank you for your interest. Unfortunately…", time: "8:02 PM", at: 74 },
  { from: "Orbit Digital", subject: "Application update", snippet: "Unfortunately, we are looking for candidates with 3+ years…", time: "9:15 PM", at: 104 },
  { from: "Nova Labs", subject: "Junior UI Designer", snippet: "Unfortunately, we have decided to move forward with other candidates.", time: "Now", at: CLICK + 8 },
];

const RefreshIcon: React.FC<{ spin: number }> = ({ spin }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" style={{ transform: `rotate(${spin}deg)` }}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" fill="none" stroke={C.muted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cursor: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24">
    <path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.6-6.9L4 20z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

const Row: React.FC<{ mail: Mail; y: number; enter: number; flash: number }> = ({ mail, y, enter, flash }) => (
  <div
    style={{
      position: "absolute",
      left: LIST_X,
      top: y,
      width: WIN.x + WIN.w - LIST_X,
      height: ROW_H,
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 28px",
      boxSizing: "border-box",
      background: flash > 0 ? `rgba(229,72,77,${0.16 * flash})` : C.surface,
      borderBottom: `1px solid ${C.line}`,
      opacity: enter,
      transform: `translateY(${(1 - enter) * -18}px)`,
      fontFamily: FONT,
    }}
  >
    <div style={{ width: 40, height: 40, borderRadius: 20, background: "#DCE3F0", color: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 17, flexShrink: 0 }}>
      {mail.from[0]}
    </div>
    <div style={{ width: 160, fontWeight: 700, fontSize: 17, color: C.ink, flexShrink: 0 }}>{mail.from}</div>
    <div style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 16 }}>
      <span style={{ fontWeight: 600, color: C.ink }}>{mail.subject}</span>
      <span style={{ color: C.muted }}> — {mail.snippet}</span>
    </div>
    <div style={{ background: C.redSoft, color: C.red, fontWeight: 700, fontSize: 13, padding: "5px 12px", borderRadius: 999, flexShrink: 0 }}>✕ Rejected</div>
    <div style={{ width: 78, textAlign: "right", color: C.muted, fontSize: 14, flexShrink: 0 }}>{mail.time}</div>
  </div>
);

const Inbox: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const landed = (m: Mail) => (m.at === 0 ? 1 : spring({ frame: f - m.at, fps, config: { damping: 16, stiffness: 140 } }));

  // Each row is pushed down smoothly by every newer row as it lands.
  const rows = MAILS.map((m, i) => {
    const newer = MAILS.slice(i + 1).reduce((sum, n) => sum + landed(n), 0);
    return { m, y: LIST_TOP + newer * ROW_H, enter: landed(m) };
  });

  const sent = Math.round(interpolate(f, [60, 150], [84, 87], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Cursor path: drifts in, travels to the refresh button, clicks.
  const cx = interpolate(f, [120, 172], [820, REFRESH.x - 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cy = interpolate(f, [120, 172], [560, REFRESH.y - 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const press = interpolate(f, [CLICK - 2, CLICK, CLICK + 4], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ripple = interpolate(f, [CLICK, CLICK + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spin = interpolate(f, [CLICK, CLICK + 18], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const shake = f > CLICK + 8 && f < CLICK + 22 ? Math.sin((f - CLICK) * 2.4) * interpolate(f, [CLICK + 8, CLICK + 22], [7, 0]) : 0;
  const newest = MAILS[MAILS.length - 1];
  const flash = interpolate(f, [newest.at + 4, newest.at + 10, newest.at + 40], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
      {/* Window */}
      <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, background: C.window, borderRadius: 18, overflow: "hidden", boxShadow: `0 0 120px ${C.glow}55, 0 30px 80px rgba(0,0,0,.45)` }}>
        {/* Title bar */}
        <div style={{ height: 64, background: C.surface, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 10, fontFamily: FONT }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
          <div style={{ marginLeft: 26, fontWeight: 700, fontSize: 20, color: C.ink }}>Mail</div>
          <div style={{ marginLeft: 34, flex: 1, maxWidth: 520, height: 38, borderRadius: 10, background: "#EEF1F6", display: "flex", alignItems: "center", padding: "0 16px", color: C.muted, fontSize: 15 }}>Search mail</div>
          <div style={{ marginLeft: "auto", fontSize: 15, color: C.muted }}>
            CVs sent: <span style={{ fontWeight: 700, color: C.ink, fontSize: 17 }}>{sent}</span>
          </div>
        </div>
        {/* Sidebar */}
        <div style={{ position: "absolute", left: 0, top: 64, width: SIDEBAR_W, bottom: 0, background: C.window, borderRight: `1px solid ${C.line}`, padding: "20px 14px", boxSizing: "border-box", fontFamily: FONT }}>
          <div style={{ background: "#E3ECFF", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", fontWeight: 700, color: C.ink, fontSize: 16 }}>
            <span>Inbox</span>
            <span>{MAILS.filter((m) => m.at <= f).length}</span>
          </div>
          {["Starred", "Sent", "Drafts"].map((s) => (
            <div key={s} style={{ padding: "10px 14px", color: C.muted, fontSize: 16 }}>{s}</div>
          ))}
        </div>
        {/* Toolbar */}
        <div style={{ position: "absolute", left: SIDEBAR_W, top: 64, right: 0, height: 52, background: C.surface, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 32 }}>
          <div style={{ width: 18, height: 18, border: `2px solid ${C.muted}`, borderRadius: 4 }} />
          <div style={{ width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: ripple > 0 && ripple < 1 ? `rgba(59,130,246,${0.25 * (1 - ripple)})` : "transparent" }}>
            <RefreshIcon spin={spin} />
          </div>
        </div>
      </div>
      {/* Rows (absolute so the push-down animation is exact) */}
      <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 18, overflow: "hidden", clipPath: `inset(${LIST_TOP - WIN.y}px 0 0 0 round 0 0 18px 18px)` }}>
        <div style={{ position: "absolute", left: -WIN.x, top: -WIN.y, width: 1280, height: 720 }}>
          {rows.filter((r) => r.enter > 0.001).map((r) => (
            <Row key={r.m.from} mail={r.m} y={r.y} enter={Math.min(1, r.enter)} flash={r.m === newest ? flash : 0} />
          ))}
        </div>
      </div>
      {/* Cursor */}
      {f >= 110 && (
        <div style={{ position: "absolute", left: cx, top: cy, transform: `scale(${press})`, transformOrigin: "4px 2px", opacity: interpolate(f, [110, 124], [0, 1], { extrapolateRight: "clamp" }) }}>
          <Cursor />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Scene02Inbox: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 1) Push into the laptop on the desk (continuity with the last frame of scene 1).
  const photoScale = interpolate(f, [0, PUSH_END], [1, 2.2], { extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const photoOpacity = interpolate(f, [UI_IN, UI_IN + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 2) Inbox arrives from the screen glow.
  const uiIn = interpolate(f, [UI_IN, UI_IN + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // 3) Final slow push toward the newest rejection, then the screen dims.
  const endPush = interpolate(f, [205, durationInFrames], [1, 1.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const dim = interpolate(f, [250, durationInFrames], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: photoOpacity, transform: `scale(${photoScale})`, transformOrigin: "16% 82%" }}>
        <Img src={staticFile("scene01-last.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: uiIn,
          transform: `scale(${interpolate(uiIn, [0, 1], [0.86, 1]) * endPush})`,
          transformOrigin: `${(LIST_X + 300) / 12.8}% ${(LIST_TOP + 30) / 7.2}%`,
        }}
      >
        <Inbox />
      </AbsoluteFill>

      {/* Cold night grade + vignette so the screen reads as the only light in the room */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(5,10,30,.75) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "rgba(40,80,200,.08)", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "#050A1E", opacity: dim }} />
    </AbsoluteFill>
  );
};
