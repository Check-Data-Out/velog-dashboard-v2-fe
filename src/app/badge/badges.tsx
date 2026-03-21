/* eslint-disable react/no-unknown-property */

import { BadgeDto } from '@/types';
import { Posts, PoweredBy, Statistics, Title } from './components';
import { createImageResponse } from './util';

interface BadgeGenerator {
  badge: BadgeDto;
  assets: ('views' | 'likes' | 'posts')[];
  size: number;
  origin: string;
}

export const simpleBadgeGenerator = async ({ badge, assets, size, origin }: BadgeGenerator) => {
  return await createImageResponse(
    <div style={{ gap: 12 }} tw="flex flex-col items-center w-full">
      <Title username={badge.user.username} origin={origin} />
      <Statistics
        assets={assets}
        totalLikes={badge.user.totalLikes}
        totalPosts={badge.user.totalPosts}
        totalViews={badge.user.totalViews}
      />
      <PoweredBy />
    </div>,
    { origin, size, type: 'simple' },
  );
};

export const defaultBadgeGenerator = async ({ badge, assets, size, origin }: BadgeGenerator) => {
  return await createImageResponse(
    <div tw="flex flex-col w-full h-full relative">
      <div tw="flex items-center justify-between w-full">
        <Title username={badge.user.username} origin={origin} />
        <Statistics
          assets={assets}
          totalLikes={badge.user.totalLikes}
          totalPosts={badge.user.totalPosts}
          totalViews={badge.user.totalViews}
        />
      </div>
      <div tw="absolute flex w-full" style={{ top: 46 }}>
        <Posts posts={badge.recentPosts} />
      </div>
      <div tw="absolute flex bottom-0">
        <PoweredBy />
      </div>
    </div>,
    { origin, size, type: 'default' },
  );
};
