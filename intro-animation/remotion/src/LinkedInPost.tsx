import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, Cursor, FONT, clamp, easeInOut, easeOut } from "./theme";

// Scene 4 (0:41–0:50): on his break, a classmate's "new job" post, then a course ad. He enrolls.
const COMMENTS = [
  { name: "Mona A.", text: "Congrats Omar! 👏", at: 50 },
  { name: "Youssef T.", text: "مبروك يا صاحبي 🔥", at: 72 },
  { name: "Hana M.", text: "So proud of you!!", at: 94 },
];
const CLICK = 222;

export const LinkedInPost: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const likes = Math.round(clamp(f, [10, 140], [12, 348], easeOut));
  const scroll = clamp(f, [140, 172], [0, -560], easeInOut);
  const adIn = spring({ frame: f - 150, fps, config: { damping: 18 } });
  const cx = clamp(f, [178, 216], [980, 372], easeInOut);
  const cy = clamp(f, [178, 216], [640, 444], easeInOut);
  const press = clamp(f, [CLICK - 2, CLICK, CLICK + 5], [1, 0.9, 1]);
  const done = clamp(f, [CLICK + 4, CLICK + 12], [0, 1]);

  return (
    <AbsoluteFill style={{ background: "#F3F2EF", fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, background: "#fff", borderBottom: "1px solid #E0DFDC", display: "flex", alignItems: "center", padding: "0 40px", gap: 14, zIndex: 2 }}>
        <div style={{ width: 34, height: 34, borderRadius: 6, background: C.blue, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>in</div>
        <div style={{ width: 280, height: 34, borderRadius: 6, background: "#EEF3F8", color: C.muted, fontSize: 14, display: "flex", alignItems: "center", padding: "0 14px" }}>Search</div>
      </div>
      <div style={{ position: "absolute", left: 280, width: 720, top: 80 + scroll }}>
        {/* The post */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E0DFDC", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 14, padding: "20px 22px 10px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: "#2E5AAC", color: "#fff", fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>OK</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: C.ink }}>Omar Khaled · <span style={{ color: C.muted, fontWeight: 400 }}>1st</span></div>
              <div style={{ fontSize: 14, color: C.muted }}>Junior Frontend Developer at Nova Labs</div>
              <div style={{ fontSize: 13, color: C.muted }}>2h · 🌐</div>
            </div>
          </div>
          <div style={{ padding: "6px 22px 16px", fontSize: 17, color: C.ink, lineHeight: 1.5 }}>
            I'm happy to share that I'm starting a new position as <b>Junior Frontend Developer</b> at Nova Labs! 🎉
          </div>
          <div style={{ height: 250, background: "linear-gradient(135deg,#0A66C2,#4F9BE8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <div style={{ fontSize: 16, opacity: 0.85 }}>Starting a New Position</div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Junior Frontend Developer</div>
            <div style={{ fontSize: 46, marginTop: 6 }}>🎉 💻</div>
          </div>
          <div style={{ padding: "10px 22px", fontSize: 15, color: C.muted, borderBottom: "1px solid #EEE" }}>👍❤️👏 {likes} · {COMMENTS.filter((c) => f >= c.at).length} comments</div>
          {COMMENTS.map((c) => {
            const s = spring({ frame: f - c.at, fps, config: { damping: 15 } });
            return s > 0.01 ? (
              <div key={c.name} style={{ padding: "8px 22px", opacity: s, transform: `translateY(${(1 - s) * 12}px)` }}>
                <div style={{ background: "#F2F2F2", borderRadius: 10, padding: "8px 14px", display: "inline-block", fontSize: 15, color: C.ink }}>
                  <b>{c.name}</b> {c.text}
                </div>
              </div>
            ) : null;
          })}
          <div style={{ height: 14 }} />
        </div>
        {/* Sponsored course ad */}
        <div style={{ marginTop: 18, background: "#fff", borderRadius: 12, border: "1px solid #E0DFDC", overflow: "hidden", opacity: adIn, transform: `translateY(${(1 - adIn) * 40}px)`, direction: "rtl" }}>
          <div style={{ padding: "14px 22px", fontSize: 13, color: C.muted }}>Promoted · إعلان</div>
          <div style={{ height: 210, background: "linear-gradient(135deg,#111827,#1F2A44)", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 34px", gap: 8 }}>
            <div style={{ fontSize: 38, fontWeight: 700 }}>اتعلم برمجة في 3 شهور بس 🚀</div>
            <div style={{ fontSize: 22, color: "#FBBF24" }}>مرتبات تبدأ من 25,000 جنيه</div>
          </div>
          <div style={{ padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 15, color: C.muted }}>+12,000 طالب اشتركوا</div>
            <div style={{ transform: `scale(${press})`, background: done > 0.5 ? C.green : C.orange, color: "#fff", fontWeight: 700, fontSize: 18, padding: "10px 26px", borderRadius: 999 }}>
              {done > 0.5 ? "تم التسجيل ✓" : "سجّل دلوقتي"}
            </div>
          </div>
        </div>
      </div>
      {f >= 178 && <Cursor x={cx} y={cy} scale={press} />}
    </AbsoluteFill>
  );
};
