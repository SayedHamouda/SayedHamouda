import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, clamp, easeOut } from "./theme";

// Scene 5 (0:52–1:00): late-night coding, one run, and the console floods with red.
const CODE = [
  "const btn = document.querySelector('#start');",
  "",
  "btn.addEventListener('click', () => {",
  "  user.profile.name = input.value;",
  "  renderDashboard(user);",
  "});",
];
const ERR = "Uncaught TypeError: Cannot read properties of undefined (reading 'profile')";
const MONO = "'DejaVu Sans Mono', 'Courier New', monospace";
const TYPE_END = 96;
const RUN = 104;

export const CodeEditorFail: React.FC = () => {
  const f = useCurrentFrame();
  const total = CODE.join("\n").length;
  const shown = Math.floor(clamp(f, [4, TYPE_END], [0, total]));
  let left = shown;
  const lines = CODE.map((l) => {
    const take = Math.max(0, Math.min(l.length, left));
    left -= l.length + 1;
    return l.slice(0, take);
  });
  const errCount = Math.floor(clamp(f, [RUN + 6, 200], [0, 26]));
  const panel = clamp(f, [RUN, RUN + 12], [0, 1], easeOut);
  const redWash = clamp(f, [150, 215], [0, 0.55]);
  const hours = ["11:48 PM", "12:57 AM", "2:06 AM", "3:12 AM"];
  const hour = hours[Math.min(3, Math.floor(clamp(f, [0, 200], [0, 3.99])))];
  const fadeOut = clamp(f, [212, 240], [0, 1]);
  const shake = f > RUN + 6 && f < RUN + 20 ? Math.sin(f * 2.6) * 6 : 0;

  return (
    <AbsoluteFill style={{ background: "#0B0F17", transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", left: 70, top: 46, right: 70, bottom: 46, background: "#1E1E2A", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,.6)" }}>
        <div style={{ height: 44, background: "#171722", display: "flex", alignItems: "center", gap: 2, padding: "0 16px", fontFamily: FONT, fontSize: 14 }}>
          <div style={{ background: "#1E1E2A", color: "#E5E7EB", padding: "10px 18px", borderRadius: "8px 8px 0 0" }}>app.js</div>
          <div style={{ color: "#6B7280", padding: "10px 18px" }}>index.html</div>
          <div style={{ marginLeft: "auto", color: "#9CA3AF" }}>🕒 {hour}</div>
        </div>
        <div style={{ padding: "26px 30px", fontFamily: MONO, fontSize: 22, lineHeight: 1.7 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 26, minHeight: 37 }}>
              <span style={{ color: "#4B5563", width: 22, textAlign: "right" }}>{i + 1}</span>
              <span style={{ color: i === 3 ? "#F9A8D4" : "#C7D2FE", whiteSpace: "pre" }}>
                {l}
                {f < TYPE_END && lines[i].length > 0 && (lines[i + 1] ?? "").length === 0 && Math.floor(f / 8) % 2 === 0 ? "▍" : ""}
              </span>
            </div>
          ))}
        </div>
        {/* Console */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${18 + panel * 34}%`, background: "#13131C", borderTop: "1px solid #2A2A3A", transform: `translateY(${(1 - panel) * 100}%)`, overflow: "hidden" }}>
          <div style={{ padding: "8px 18px", fontFamily: FONT, fontSize: 13, color: "#9CA3AF" }}>CONSOLE {errCount > 0 ? `· ${errCount} errors` : ""}</div>
          <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            {Array.from({ length: errCount }).map((_, i) => (
              <div key={i} style={{ fontFamily: MONO, fontSize: 15, color: "#FCA5A5", background: "rgba(229,72,77,.12)", borderBottom: "1px solid rgba(229,72,77,.25)", padding: "5px 18px", whiteSpace: "nowrap" }}>
                ✖ {ERR}
              </div>
            ))}
          </div>
        </div>
        {/* Tutorial player in the corner, playing at 2x */}
        <div style={{ position: "absolute", right: 24, top: 64, width: 250, height: 140, background: "#000", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, opacity: clamp(f, [20, 30], [0, 1]) }}>
          <span style={{ fontSize: 34 }}>▶</span>
          <span style={{ position: "absolute", top: 8, right: 10, background: "#E5484D", fontSize: 13, padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>2x</span>
          <span style={{ position: "absolute", bottom: 8, left: 10, fontSize: 12, color: "#D1D5DB" }}>JavaScript in 1 Hour – Part 7</span>
        </div>
      </div>
      <AbsoluteFill style={{ background: "#B91C1C", opacity: redWash, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
    </AbsoluteFill>
  );
};
