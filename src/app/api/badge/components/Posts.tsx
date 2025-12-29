/* eslint-disable react/no-unknown-property */

import { COLORS } from '@/constants';
import { Icon } from '@/shared/Icon';
import { recentPosts } from '@/types';
import { convertDateToKST } from '@/utils';
import { fontStyle } from '../util';

interface IProps {
  posts: recentPosts[];
}

export const Posts = ({ posts }: IProps) => {
  return (
    <div style={{ gap: 14 }} tw="flex flex-col w-full h-[218px]">
      {posts?.map((item, index) => (
        <div
          key={index}
          tw={`flex items-center w-full h-[43px] rounded-[4px] p-[12px] bg-[${COLORS.BG.SUB}]`}
        >
          <span
            style={{
              ...fontStyle('TITLE', '5', COLORS.TEXT.MAIN).style,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflowWrap: 'break-word',
            }}
            tw={fontStyle('TITLE', '5', COLORS.TEXT.MAIN, 'max-w-[225px] w-fit overflow-hidden').tw}
          >
            {item.title}
          </span>
          <span {...fontStyle('SUBTITLE', '5', COLORS.TEXT.ALT, 'ml-[10px]')}>
            {convertDateToKST(item.releasedAt)?.short}
          </span>
          <div tw="ml-auto w-fit flex items-center">
            <span {...fontStyle('SUBTITLE', '5', COLORS.TEXT.ALT, `mr-[4px]`)}>
              {item.viewCount} / {item.viewDiff}{' '}
              <span tw={`text-[${COLORS.PRIMARY.SUB}] ml-[2px] mr-[4px]`}>⬆</span> /{' '}
            </span>
            <Icon name="Like" size={14} color={COLORS.TEXT.ALT} tw="mr-[6px]" />
            <span {...fontStyle('SUBTITLE', '5', COLORS.TEXT.ALT)}>{item.likeCount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
