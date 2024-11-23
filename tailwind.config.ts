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
        1: '#121212',
        2: '#1E1E1E',
        3: '#252525',
      },
      text: {
        1: '#ECECEC',
        2: '#D9D9D9',
        3: '#ACACAC',
      },
      border: {
        1: '#2A2A2A',
        2: '#4D4D4D',
        3: '#E0E0E0',
      },
      primary: {
        1: '#96F2D7',
        2: '#63E6BE',
      },
    },
  },
  plugins: [],
};

export default config;
