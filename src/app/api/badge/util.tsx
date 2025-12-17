/* eslint-disable react/no-unknown-property */

import { ImageResponse } from '@vercel/og';
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
    tw: `text-[${parseInt(size)}px] leading-[${parseInt(lineHeight)}px] text-[${color}] ${tw}`,
  };
};

export const loadFonts = async (url: string) => await (await fetch(new URL(url)))?.arrayBuffer();

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

  const NotoBold = await loadFonts(origin + '/NotoSansKR-Bold.ttf');
  const NotoMedium = await loadFonts(origin + '/NotoSansKR-Medium.ttf');
  const [width, height, padding] = sizeTable[type];

  return new ImageResponse(
    (
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
      </div>
    ),
    {
      width: width * size,
      height: height * size,
      fonts: [
        { data: NotoMedium, name: 'Noto500', weight: 500 },
        { data: NotoBold, name: 'Noto700', weight: 700 },
      ],
    },
  );
};
