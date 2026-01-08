/* eslint-disable react/no-unknown-property */

import { COLORS } from '@/constants';
import { Icon, NameType } from '@/shared/Icon';
import { parseNumber } from '@/utils';
import { fontStyle } from '../util';

interface IProp {
  assets?: ('views' | 'likes' | 'posts')[];
  totalViews: number;
  totalLikes: number;
  totalPosts: number;
}
const nameTable = {
  views: 'View',
  likes: 'Like',
  posts: 'Post',
};

export const Statistics = ({ assets, totalViews, totalLikes, totalPosts }: IProp) => {
  const statistics = { views: totalViews, likes: totalLikes, posts: totalPosts };

  return (
    <div style={{ gap: 18 }} tw="flex items-center">
      {assets?.map((item, index) => (
        <div tw="flex items-center" key={index}>
          <Icon
            name={nameTable[item] as NameType}
            size={18}
            tw="mr-[8px]"
            color={COLORS.TEXT.MAIN}
          />
          <span {...fontStyle('TITLE', '5', COLORS.TEXT.MAIN)}>
            {parseNumber(statistics[item])}
          </span>
        </div>
      ))}
    </div>
  );
};
