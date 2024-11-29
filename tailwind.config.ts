import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      bg: {
        main: '#121212',
        sub: '#1E1E1E',
        alt: '#252525',
      },
      text: {
        main: '#ECECEC',
        sub: '#D9D9D9',
        alt: '#ACACAC',
      },
      border: {
        main: '#2A2A2A',
        sub: '#4D4D4D',
        alt: '#E0E0E0',
      },
      primary: {
        main: '#96F2D7',
        sub: '#63E6BE',
      },
    },
  },
  plugins: [],
};

export default config;
