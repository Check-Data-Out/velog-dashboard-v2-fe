export const COLORS = {
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
  destructive: {
    main: '#FFC9C9',
    sub: '#FFA8A8',
  },
};

export type colorType = Record<keyof typeof COLORS, 'main' | 'sub' | 'alt'>;
