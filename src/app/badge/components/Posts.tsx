/* eslint-disable react/no-unknown-property */

import { COLORS } from '@/lib/constants/styles.constant';
import { recentPosts } from '@/lib/types/user.type';
import { convertDateToKST } from '@/lib/utils/datetime.util';
import { Icon } from '@/shared/Icon';
import { fontStyle } from '../util';

interface IProps {
  posts: recentPosts[];
}

export const Posts = ({ posts }: IProps) => {
  return (
    <div style={{ gap: 14 }} tw="flex flex-col w-full h-[218px]">
      {posts?.slice(0, 4)?.map((item, index) => (
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
            tw={fontStyle('TITLE', '5', COLORS.TEXT.MAIN, 'max-w-[225px] overflow-hidden').tw}
          >
            {item.title}
          </span>
          <span {...fontStyle('SUBTITLE', '5', COLORS.TEXT.ALT, 'ml-[10px]')}>
            {convertDateToKST(item.releasedAt)?.short}
          </span>
          <div tw="ml-auto flex items-center">
            <span {...fontStyle('SUBTITLE', '5', COLORS.TEXT.ALT)}>{item.viewCount}</span>
            <span {...fontStyle('SUBTITLE', '5', COLORS.TEXT.ALT, 'ml-[4px]')}>/</span>
            <Icon name="Like" size={14} color={COLORS.TEXT.ALT} tw="ml-[6px] mr-[6px]" />
            <span {...fontStyle('SUBTITLE', '5', COLORS.TEXT.ALT)}>{item.likeCount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
