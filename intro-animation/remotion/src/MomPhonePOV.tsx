import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, clamp, easeInOut } from "./theme";

// Shot 2C (0:28–0:31): Mama Soad's point of view. The app text is tiny and grey, she pushes the
// phone away to read it, nothing gets sharper. This is the problem the film pays off at the end.
const MEDS = ["Panadol Extra 500mg", "Concor 5mg", "Glucophage 850mg", "Vitamin D3 10,000 IU", "Omeprazole 20mg", "Aspocid 75mg"];

export const MomPhonePOV: React.FC = () => {
  const f = useCurrentFrame();
  // Arm's length: the phone backs away, comes closer, backs away again.
  const scale = clamp(f, [0, 25, 50, 75, 90], [1.25, 0.95, 1.15, 0.9, 0.9], easeInOut);
  const blur = clamp(f, [0, 25, 50, 75], [2.2, 0.9, 1.8, 1.1]);
  const tap = clamp(f, [56, 62, 74], [0, 1, 0]);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #6B4A2E 0%, #2A1B12 70%, #120B07 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", filter: `blur(${blur}px)` }}>
        <div style={{ transform: `scale(${scale})`, width: 330, height: 660, borderRadius: 46, background: "#F4B9C8", padding: 12, boxShadow: "0 40px 90px rgba(0,0,0,.55)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 36, background: "#FAFAFA", overflow: "hidden", fontFamily: FONT, position: "relative" }}>
            <div style={{ height: 70, background: "#F1F1F1", display: "flex", alignItems: "flex-end", padding: "0 18px 10px", fontSize: 11, color: "#B9B9B9" }}>صيدلية · طلب علاج</div>
            {MEDS.map((m, i) => (
              <div key={m} style={{ padding: "12px 18px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "#C4C4C4" }}>
                <span>{m}</span><span>EGP {(i + 2) * 17}.50</span>
              </div>
            ))}
            <div style={{ position: "absolute", bottom: 26, left: 18, right: 18, height: 30, borderRadius: 6, background: "#E9E9E9", color: "#C8C8C8", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>Proceed to checkout</div>
            {/* A wrong tap: she hits empty space */}
            <div style={{ position: "absolute", left: 210, top: 300, width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: 30, border: "3px solid rgba(229,72,77,.6)", opacity: tap, transform: `scale(${0.6 + tap})` }} />
          </div>
        </div>
      </AbsoluteFill>
      {/* Reading-glasses rim at the bottom of her view */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", opacity: clamp(f, [30, 50], [0, 0.85]) }}>
        <svg width="1280" height="200" viewBox="0 0 1280 200">
          <path d="M120 200 Q 330 40 600 150 M680 150 Q 950 40 1160 200" stroke="#3B2A20" strokeWidth="18" fill="none" strokeLinecap="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
