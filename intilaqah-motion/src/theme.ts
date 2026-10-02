import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import manifest from './manifest.json';

// Cairo is bundled in /public/fonts (from @fontsource/cairo) so renders never depend on the network.
export const CAIRO = 'Cairo';
const RANGES = {
  arabic: 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC,U+102E0-102FB,U+10E60-10E7E,U+10EC2-10EC4,U+10EFC-10EFF,U+1EE00-1EE03,U+1EE05-1EE1F,U+1EE21-1EE22,U+1EE24,U+1EE27,U+1EE29-1EE32,U+1EE34-1EE37,U+1EE39,U+1EE3B,U+1EE42,U+1EE47,U+1EE49,U+1EE4B,U+1EE4D-1EE4F,U+1EE51-1EE52,U+1EE54,U+1EE57,U+1EE59,U+1EE5B,U+1EE5D,U+1EE5F,U+1EE61-1EE62,U+1EE64,U+1EE67-1EE6A,U+1EE6C-1EE72,U+1EE74-1EE77,U+1EE79-1EE7C,U+1EE7E,U+1EE80-1EE89,U+1EE8B-1EE9B,U+1EEA1-1EEA3,U+1EEA5-1EEA9,U+1EEAB-1EEBB,U+1EEF0-1EEF1',
  latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
};
for (const weight of ['400', '500', '600', '700', '800'])
  for (const sub of ['arabic', 'latin'] as const)
    loadFont({
      family: CAIRO,
      url: staticFile(`fonts/cairo-${sub}-${weight}-normal.woff2`),
      weight,
      unicodeRange: RANGES[sub],
    });

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const s = (sec: number) => Math.round(sec * FPS);

// Brand tokens (Figma ⚙️ Design System)
export const C = {
  yellow: '#FCC208',
  blue: '#1976D2',
  navy: '#0B2A5B',
  surface: '#F5F5F5',
  orange: '#FF592C',
  green: '#3DAA52',
  purple: '#9C27B0',
  ink: '#16202B',
  white: '#FFFFFF',
  line: '#E2E8F2',
  red: '#E53935',
};

// Motion tokens (ms → frames)
export const M = {
  pop: s(0.22),
  launch: s(0.64),
  pulse: s(1.6),
  hover: s(2.4),
};

// Social safe zone: keep text out of the top 250px and bottom 350px
export const SAFE = {top: 250, bottom: 350};

const have = new Set<string>(manifest as string[]);
/** Returns the static URL of an exported asset, or null when it hasn't been exported yet. */
export const asset = (path: string): string | null => (have.has(path) ? staticFile(path) : null);
