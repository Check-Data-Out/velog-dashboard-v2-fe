/* eslint-disable react/no-unknown-property */

import { NextResponse } from 'next/server';
import { Posts, PoweredBy, Statistics, Title } from './components';
import { createImageResponse } from './util';

const DATA = {
  username: 'six-standard',
  totalViews: 12345,
  totalLikes: 6789,
  totalPosts: 123,
  posts: [
    {
      id: '1',
      title: '제목',
      createdAt: '2025-12-16',
      viewCount: 123,
      viewDiff: 456,
      likeCount: 789,
    },
    {
      id: '1',
      title: '제목',
      createdAt: '2025-12-16',
      viewCount: 123,
      viewDiff: 456,
      likeCount: 789,
    },
    {
      id: '1',
      title: '제목',
      createdAt: '2025-12-16',
      viewCount: 123,
      viewDiff: 456,
      likeCount: 789,
    },
    {
      id: '1',
      title: '제목',
      createdAt: '2025-12-16',
      viewCount: 123,
      viewDiff: 456,
      likeCount: 789,
    },
  ],
};

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const size = Number(searchParams.get('size')) || 1;
  const username = searchParams.get('username') || 0;
  const type = (searchParams.get('type') as 'default' | 'simple') || 'default';
  const assets = (searchParams.get('assets')?.split(',') as ('views' | 'likes' | 'posts')[]) || [
    'views',
    'likes',
    'posts',
  ];

  if (!username) {
    return NextResponse.json({ error: "'username' parameter is required" }, { status: 400 });
  }

  if (type === 'simple') {
    return await createImageResponse(
      <div style={{ gap: 12 }} tw="flex flex-col items-center w-full">
        <Title username={DATA.username} origin={origin} />
        <Statistics
          assets={assets}
          totalLikes={DATA.totalLikes}
          totalPosts={DATA.totalPosts}
          totalViews={DATA.totalViews}
        />
        <PoweredBy />
      </div>,
      { origin, size, type: 'simple' },
    );
  }

  return await createImageResponse(
    <div style={{ gap: 16 }} tw="flex flex-col w-full">
      <div tw="flex items-center justify-between w-full">
        <Title username={DATA.username} origin={origin} />
        <Statistics
          assets={assets}
          totalLikes={DATA.totalLikes}
          totalPosts={DATA.totalPosts}
          totalViews={DATA.totalViews}
        />
      </div>
      <Posts posts={DATA.posts} />
      <PoweredBy />
    </div>,
    { origin, size, type: 'default' },
  );
}
