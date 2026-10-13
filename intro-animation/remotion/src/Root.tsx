import { Composition } from "remotion";
import { FilmDraft } from "./FilmDraft";
import { Scene02Inbox } from "./Scene02Inbox";

export const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="FilmDraft" component={FilmDraft} durationInFrames={60 * FPS} fps={FPS} width={1280} height={720} />
    <Composition id="Scene02Inbox" component={Scene02Inbox} durationInFrames={10 * FPS} fps={FPS} width={1280} height={720} />
  </>
);
