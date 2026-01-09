/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */

import { COLORS } from '@/constants';
import { fontStyle } from '../util';

interface IProp {
  username: string;
  origin: string;
}

export const Title = ({ username, origin }: IProp) => {
  return (
    <div tw="flex items-center w-fit">
      <img tw="w-[24px] h-[24px] mr-[10px]" src={origin + '/velog.png'} />
      <div tw="flex relative w-fit h-fit">
        <span {...fontStyle('TITLE', '4', COLORS.TEXT.MAIN)}>{username}</span>
        <div tw="absolute w-full h-[1px] bg-white bottom-[6px]" />
        {/* transform scale 떄문인지 tw underline을 적용했음에도 밑줄이 보이지 않는 문제가 있음 */}
      </div>
    </div>
  );
};
