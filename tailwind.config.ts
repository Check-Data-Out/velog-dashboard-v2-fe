import type { Config } from 'tailwindcss';
import { colors, sizes, screens as customScreen } from './src/constants';

const screens: Record<string, string> = {};

Object.entries(customScreen).forEach((i) => (screens[i[0]] = i[1] + 'px'));

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { colors, screens: screens },
  plugins: [],
  safelist: Object.values(sizes),
};

export default config;
