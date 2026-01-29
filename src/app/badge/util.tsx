/* eslint-disable react/no-unknown-property */

// TODO: 해당 타입이 있는데도 불구하고 문제가 생김..
// eslint-disable-next-line import/named
import satori, { SatoriOptions } from 'satori';
import sharp from 'sharp';
import { COLORS, FONTS } from '@/constants';

type fontType = [string, { lineHeight: string; fontWeight: string }];

export const fontStyle = <T extends keyof typeof FONTS>(
  type: T,
  index: keyof (typeof FONTS)[T],
  color?: string,
  tw?: string,
) => {
  const [size, { lineHeight, fontWeight }] = FONTS[type][index] as fontType;

  return {
    style: { fontFamily: `Noto${fontWeight}` },
    tw: `text-[${parseInt(size)}px] leading-[${parseFloat(lineHeight)}px] text-[${color}] ${tw ? tw : ''}`,
  };
};

const loadFonts = async (url: string): Promise<ArrayBuffer> => {
  const response = await fetch(new URL(url));
  if (!response.ok) {
    throw new Error(`Failed to load font from ${url}: ${response.statusText}`);
  }
  return await response.arrayBuffer();
};

const sizeTable = {
  default: [550, 350, 25],
  simple: [350, 140, 20],
};

interface options {
  origin: string;
  type: keyof typeof sizeTable;
  size: number;
}

export const createImageResponse = async (node: React.ReactNode, options: options) => {
  const { origin, type, size } = options;
  const [width, height, padding] = sizeTable[type];

  try {
    // 폰트 로드는 병렬로 처리하여 속도 개선
    const [NotoMedium, NotoBold] = await Promise.all([
      loadFonts(origin + '/NotoSansKR-Medium.ttf'),
      loadFonts(origin + '/NotoSansKR-Bold.ttf'),
    ]);

    const satoriOptions: SatoriOptions = {
      width: width * size,
      height: height * size,
      fonts: [
        { data: NotoMedium, name: 'Noto500', weight: 500 },
        { data: NotoBold, name: 'Noto700', weight: 700 },
      ],
    };

    const svg = await satori(
      <div
        style={{ width: width * size, height: height * size }}
        tw="flex items-center justify-center"
      >
        <div
          style={{
            width,
            height,
            padding: `${padding - 5}px ${padding}px`,
            transform: `scale(${size})`,
          }}
          tw={`flex bg-[${COLORS.BG.MAIN}]`}
        >
          {node}
        </div>
      </div>,
      satoriOptions,
    );

    return await sharp(Buffer.from(svg)).png().toBuffer();
  } catch (error) {
    console.error('Satori/Sharp Error:', error);
    const fallbackSvg = `<svg>뱃지 생성 중 오류가 발생했습니다.</svg>`;
    return await sharp(Buffer.from(fallbackSvg)).png().toBuffer();
  }
};
