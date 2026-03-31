/* eslint-disable react/no-unknown-property */

import { BadgeDto } from '@/lib/types/user.type';
import { Posts } from './components/Posts';
import { PoweredBy } from './components/PoweredBy';
import { Statistics } from './components/Statistics';
import { Title } from './components/Title';
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
