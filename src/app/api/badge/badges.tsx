/* eslint-disable react/no-unknown-property */

import { BadgeGenerator } from '@/app/components/BadgeGenerator';
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
    <div style={{ gap: 16 }} tw="flex flex-col w-full">
      <div tw="flex items-center justify-between w-full">
        <Title username={badge.user.username} origin={origin} />
        <Statistics
          assets={assets}
          totalLikes={badge.user.totalLikes}
          totalPosts={badge.user.totalPosts}
          totalViews={badge.user.totalViews}
        />
      </div>
      <Posts posts={badge.recentPosts} />
      <PoweredBy />
    </div>,
    { origin, size, type: 'default' },
  );
};
