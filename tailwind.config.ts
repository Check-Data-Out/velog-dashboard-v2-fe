import type { Config } from 'tailwindcss';
import { COLORS, SIZES, SCREENS as CUSTOMSCREENS } from './src/constants';

const SCREENS: Record<string, string> = {};

Object.entries(CUSTOMSCREENS).forEach((i) => (SCREENS[i[0]] = i[1] + 'px'));

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { COLORS, screens: SCREENS },
  plugins: [],
  safelist: Object.values(SIZES),
};

export default config;
