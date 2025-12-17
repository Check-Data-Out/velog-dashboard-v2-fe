/* eslint-disable react/no-unknown-property */

import { NextResponse } from 'next/server';
import { Posts, PoweredBy, Statistics, Title } from './components';
import { MOCK_DATA } from './mock';
import { createImageResponse } from './util';

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const size = Number(searchParams.get('size')) || 2;
  const username = searchParams.get('username') || '';
  const type = (searchParams.get('type') as 'default' | 'simple') || 'default';
  const assets = searchParams.get('assets')?.split(',') as ('views' | 'likes' | 'posts')[];

  if (!username) {
    return NextResponse.json({ error: "'username' parameter is required" }, { status: 400 });
  }

  if (type === 'simple') {
    return await createImageResponse(
      <div style={{ gap: 12 }} tw="flex flex-col items-center w-full">
        <Title username={MOCK_DATA.username} origin={origin} />
        <Statistics
          assets={assets}
          totalLikes={MOCK_DATA.totalLikes}
          totalPosts={MOCK_DATA.totalPosts}
          totalViews={MOCK_DATA.totalViews}
        />
        <PoweredBy />
      </div>,
      { origin, size, type: 'simple' },
    );
  }

  return await createImageResponse(
    <div style={{ gap: 16 }} tw="flex flex-col w-full">
      <div tw="flex items-center justify-between w-full">
        <Title username={MOCK_DATA.username} origin={origin} />
        <Statistics
          assets={assets}
          totalLikes={MOCK_DATA.totalLikes}
          totalPosts={MOCK_DATA.totalPosts}
          totalViews={MOCK_DATA.totalViews}
        />
      </div>
      <Posts posts={MOCK_DATA.posts} />
      <PoweredBy />
    </div>,
    { origin, size, type: 'default' },
  );
}
