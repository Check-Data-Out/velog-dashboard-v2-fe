export const COLORS = {
  BG: {
    MAIN: '#121212',
    SUB: '#1E1E1E',
    ALT: '#252525',
  },
  TEXT: {
    MAIN: '#ECECEC',
    SUB: '#D9D9D9',
    ALT: '#ACACAC',
  },
  BORDER: {
    MAIN: '#2A2A2A',
    SUB: '#4D4D4D',
    ALT: '#E0E0E0',
  },
  PRIMARY: {
    MAIN: '#96F2D7',
    SUB: '#63E6BE',
  },
  DESTRUCTIVE: {
    MAIN: '#FFC9C9',
    SUB: '#FFA8A8',
  },
  TRANSPARENT: '#00000000',
};

export type ColorType = Record<keyof typeof COLORS, 'MAIN' | 'SUB' | 'ALT'>;
