import typograhpy from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import { COLORS, SIZES, SCREENS as CUSTOMSCREENS, FONTS as CUSTOMFONTS } from './src/constants';

const SCREENS: Record<string, string> = {};
const FONTS: Record<string, [string, { lineHeight: string; fontWeight: number }]> = {};

Object.entries(CUSTOMSCREENS).forEach(([key, value]) => (SCREENS[key] = value + 'px'));
Object.entries(CUSTOMFONTS).map(([section, items]) => {
  Object.entries(items).forEach(([key, value]) => (FONTS[`${section}-${key}`] = value));
});

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { colors: COLORS, screens: SCREENS, fontSize: FONTS },
  plugins: [typograhpy()],
  safelist: Object.values(SIZES),
};

export default config;
