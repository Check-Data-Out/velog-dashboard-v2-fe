// 인터랙션 너비 값
export const SIZES = {
  FULL: 'w-[100%]',
  LARGE: 'w-[400px]',
  MEDIUM: 'w-[200px]',
  SMALL: 'w-[100px]',
};

// 각 디스플레이별 최소 사이즈 값
export const SCREENS = { DSK: 1512, TBL: 1194, MBI: 834 };

// Tailwindcss 폰트 팔레트
export const FONTS = {
  TITLE: {
    '1': ['32px', { lineHeight: '46.3px', fontWeight: 700 }],
    '2': ['28px', { lineHeight: '40.5px', fontWeight: 700 }],
    '3': ['24px', { lineHeight: '34.8px', fontWeight: 700 }],
    '4': ['20px', { lineHeight: '29px', fontWeight: 700 }],
    '5': ['16px', { lineHeight: '23.2px', fontWeight: 700 }],
    '6': ['12px', { lineHeight: '17.4px', fontWeight: 700 }],
  },
  SUBTITLE: {
    '1': ['30px', { lineHeight: '43.4px', fontWeight: 500 }],
    '2': ['26px', { lineHeight: '37.6px', fontWeight: 500 }],
    '3': ['22px', { lineHeight: '31.9px', fontWeight: 500 }],
    '4': ['18px', { lineHeight: '26.1px', fontWeight: 500 }],
    '5': ['14px', { lineHeight: '20.3px', fontWeight: 500 }],
  },
  INPUT: {
    '1': ['16px', { lineHeight: '23.2px', fontWeight: 700 }],
    '2': ['16px', { lineHeight: '23.2px', fontWeight: 400 }],
    '3': ['14px', { lineHeight: '20.3px', fontWeight: 700 }],
    '4': ['14px', { lineHeight: '20.3px', fontWeight: 400 }],
  },
} as const;

// Tailwindcss 컬러 팔레트
export const COLORS = {
  BG: { MAIN: '#121212', SUB: '#1E1E1E', ALT: '#252525' },
  TEXT: { MAIN: '#ECECEC', SUB: '#D9D9D9', ALT: '#ACACAC' },
  BORDER: { MAIN: '#2A2A2A', SUB: '#4D4D4D', ALT: '#E0E0E0' },
  PRIMARY: { MAIN: '#96F2D7', SUB: '#63E6BE' },
  DESTRUCTIVE: { MAIN: '#FFC9C9', SUB: '#FFA8A8' },
  TRANSPARENT: '#00000000',
} as const;
