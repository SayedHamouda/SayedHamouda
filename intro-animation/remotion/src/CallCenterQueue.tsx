import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, clamp, easeOut } from "./theme";

// Shot 3B (0:35–0:41): the same screen on three different days. Only the numbers change.
const DAYS = [
  { day: 1, calls: 38, start: 0 },
  { day: 23, calls: 96, start: 60 },
  { day: 61, calls: 143, start: 120 },
];
const CALLERS = ["Customer #48213", "Customer #48214", "Customer #48215", "Customer #48216", "Customer #48217", "Customer #48218", "Customer #48219"];

export const CallCenterQueue: React.FC = () => {
  const f = useCurrentFrame();
  const d = [...DAYS].reverse().find((x) => f >= x.start)!;
  const local = f - d.start;
  const slam = clamp(local, [0, 8], [1.6, 1], easeOut);
  const cardOpacity = clamp(local, [0, 6, 40, 52], [0, 1, 1, 0]);
  const queueShift = (local * 2.2) % 64;
  const clockMin = Math.floor(clamp(f, [0, 180], [0, 59]));
  return (
    <AbsoluteFill style={{ background: "#2C3530", fontFamily: FONT, filter: "saturate(.55)" }}>
      {/* Dashboard */}
      <div style={{ position: "absolute", left: 90, top: 70, right: 90, bottom: 70, background: "#E9ECEA", borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
        <div style={{ height: 64, background: "#5B6B63", color: "#fff", display: "flex", alignItems: "center", padding: "0 26px", gap: 28, fontSize: 17 }}>
          <b>CallDesk</b>
          <span>Agent: Ziad</span>
          <span style={{ background: C.red, padding: "4px 12px", borderRadius: 999, fontSize: 14 }}>● On call</span>
          <span style={{ marginLeft: "auto" }}>Calls today: <b style={{ fontSize: 22 }}>{d.calls}</b></span>
          <span>Avg handle: <b>04:32</b></span>
        </div>
        <div style={{ display: "flex", height: "calc(100% - 64px)" }}>
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -queueShift, left: 0, right: 0 }}>
              {[...CALLERS, ...CALLERS].map((c, i) => (
                <div key={i} style={{ height: 64, display: "flex", alignItems: "center", padding: "0 26px", borderBottom: "1px solid #D3D8D5", gap: 18, color: "#38423D", fontSize: 17 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 6, background: i % 3 === 0 ? C.red : "#9AA59F" }} />
                  <span style={{ flex: 1 }}>{c}</span>
                  <span style={{ color: "#7A857F" }}>waiting 0{(i % 5) + 1}:{(i * 7) % 60 < 10 ? "0" : ""}{(i * 7) % 60}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: 300, borderLeft: "1px solid #D3D8D5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "#38423D" }}>
            <div style={{ fontSize: 16, color: "#7A857F" }}>Shift ends in</div>
            <div style={{ fontSize: 64, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>07:{String(59 - clockMin).padStart(2, "0")}</div>
            <div style={{ fontSize: 15, color: "#7A857F" }}>Script: "Thank you for calling…"</div>
          </div>
        </div>
      </div>
      {/* Day stamp */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: cardOpacity }}>
        <div style={{ transform: `scale(${slam}) rotate(-4deg)`, background: "rgba(20,24,36,.92)", color: "#fff", padding: "18px 46px", borderRadius: 16, fontSize: 72, fontWeight: 700, letterSpacing: 2 }}>
          Day {d.day}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(120,160,130,.10)" }} />
    </AbsoluteFill>
  );
};
