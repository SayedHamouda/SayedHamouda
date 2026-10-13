import "./theme";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CallCenterQueue } from "./CallCenterQueue";
import { CodeEditorFail } from "./CodeEditorFail";
import { LinkedInPost } from "./LinkedInPost";
import { MomPhonePOV } from "./MomPhonePOV";
import { Placeholder } from "./Placeholder";
import { Scene02Inbox } from "./Scene02Inbox";
import { FONT, clamp } from "./theme";

const Title: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: clamp(f, [0, 15, 55, 75], [0, 1, 1, 0]) }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 84, color: "#fff", direction: "rtl", transform: `translateY(${clamp(f, [0, 20], [12, 0])}px)`, textShadow: "0 4px 24px rgba(0,0,0,.35)" }}>
        الخطوة الأولى
      </div>
    </AbsoluteFill>
  );
};

// Edit decision list for the first minute (30 fps). [CHAR] slots are reserved for AI-video clips.
export const FilmDraft: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* 0:00 Scene 1: graduation (generated clip) */}
    <Sequence durationInFrames={300}>
      <OffthreadVideo src={staticFile("scene01-graduation-v1.mp4")} style={{ width: "100%", height: "100%" }} />
      <Sequence from={12} durationInFrames={75}><Title /></Sequence>
    </Sequence>
    {/* 0:10 Scene 2A: rejection inbox */}
    <Sequence from={300} durationInFrames={300}><Scene02Inbox /></Sequence>
    {/* 0:20 Scene 2B [CHAR] */}
    <Sequence from={600} durationInFrames={240}>
      <Placeholder code="2B · 0:20–0:28" title="ماما سعاد عند الباب" action="الباب يتفتح ونور الطرقة يدخل. زياد يقفل اللاب بسرعة ويبتسم ابتسامة مصطنعة. تحط الشاي وتطبطب عليه، وتمد له الموبايل وهي مبعداه عن عينيها والنضارة على طرف مناخيرها." />
    </Sequence>
    {/* 0:28 Scene 2C: mom's POV of the unreadable app */}
    <Sequence from={840} durationInFrames={90}><MomPhonePOV /></Sequence>
    {/* 0:31 Scene 3A [CHAR] */}
    <Sequence from={930} durationInFrames={120}>
      <Placeholder code="3A · 0:31–0:35" title="الكول سنتر" action="Wide متماثل: صفوف Cubicles رمادي ولمبات نيون. زياد بسماعة وبولو الشركة، بيرد بنفس الحركة وعينيه فاضية." />
    </Sequence>
    {/* 0:35 Scene 3B: day montage on his screen */}
    <Sequence from={1050} durationInFrames={180}><CallCenterQueue /></Sequence>
    {/* 0:41 Scene 4A: classmate's post + course ad */}
    <Sequence from={1230} durationInFrames={270}><LinkedInPost /></Sequence>
    {/* 0:50 Scene 4B [CHAR] */}
    <Sequence from={1500} durationInFrames={60}>
      <Placeholder code="4B · 0:50–0:52" title="الشرارة" action="Close-up: الساندوتش يقف في نص الطريق، وانعكاس الشاشة يلمع في عينيه، وإيده تتقفل بحماس." />
    </Sequence>
    {/* 0:52 Scene 5: frontend attempt */}
    <Sequence from={1560} durationInFrames={240}><CodeEditorFail /></Sequence>
  </AbsoluteFill>
);
