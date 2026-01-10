import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { badge as badgeApi } from '@/apis';
import { defaultBadgeGenerator, simpleBadgeGenerator } from './badges';

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { origin, searchParams } = new URL(request.url);
    const size = Number(searchParams.get('size')) || 2;
    const username = searchParams.get('username') || '';
    const type = (searchParams.get('type') as 'default' | 'simple') || 'default';
    const assets = searchParams.get('assets')?.split(',') as ('views' | 'likes' | 'posts')[];

    if (!username) {
      return NextResponse.json({ error: "'username' parameter is required" }, { status: 400 });
    }

    const badge = await badgeApi(username);

    if (type === 'simple') return await simpleBadgeGenerator({ assets, origin, badge, size });

    return await defaultBadgeGenerator({ assets, origin, badge, size });
  } catch (e) {
    Sentry.captureException(e);
    await Sentry.flush(2000);
    console.error('[Badge Route Error]', e);
    return NextResponse.json({ error: 'An error had been occured' }, { status: 500 });
  }
}
