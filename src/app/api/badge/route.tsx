import { NextResponse } from 'next/server';
import { badge as badgeApi } from '@/apis';
import { defaultBadgeGenerator, simpleBadgeGenerator } from './badges';

export const maxDuration = 60;

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const size = Number(searchParams.get('size')) || 2;
  const username = searchParams.get('username') || '';
  const type = (searchParams.get('type') as 'default' | 'simple') || 'default';
  const assets = searchParams.get('assets')?.split(',') as ('views' | 'likes' | 'posts')[];

  if (!username) {
    return NextResponse.json({ error: "'username' parameter is required" }, { status: 400 });
  }

  const badge = await badgeApi(username);

  if (!badge) {
    return NextResponse.json({ error: 'could not load data' }, { status: 500 });
  }

  if (type === 'simple') return await simpleBadgeGenerator({ assets, origin, badge, size });

  return await defaultBadgeGenerator({ assets, origin, badge, size });
}
