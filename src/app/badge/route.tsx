import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { badge as badgeApi } from '@/lib/apis/user.request';
import { defaultBadgeGenerator, simpleBadgeGenerator } from './badges';

export const maxDuration = 60;

const VALID_TYPES = new Set(['default', 'simple']);
const VALID_ASSETS = new Set(['views', 'likes', 'posts']);
const MIN_SIZE = 1;
const MAX_SIZE = 5;

export async function GET(request: Request) {
  try {
    const { origin, searchParams } = new URL(request.url);
    const username = searchParams.get('username') || '';
    const rawType = searchParams.get('type') || 'default';
    const rawSize = Number(searchParams.get('size'));
    const rawAssets = searchParams.get('assets')?.split(',') ?? [];

    if (!username) {
      return NextResponse.json({ error: "'username' parameter is required" }, { status: 400 });
    }

    const type = VALID_TYPES.has(rawType) ? (rawType as 'default' | 'simple') : 'default';
    const size =
      Number.isFinite(rawSize) && rawSize >= MIN_SIZE && rawSize <= MAX_SIZE ? rawSize : 2;
    const assets = rawAssets.filter((a) => VALID_ASSETS.has(a)) as ('views' | 'likes' | 'posts')[];

    const badge = await badgeApi(username);

    const badgeBuffer =
      type === 'simple'
        ? await simpleBadgeGenerator({ assets, origin, badge, size })
        : await defaultBadgeGenerator({ assets, origin, badge, size });

    // TODO: 타입 단언 정리
    return new NextResponse(badgeBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    Sentry.captureException(e);
    await Sentry.flush(2000);
    console.error('[Badge Route Error]', e);
    return new NextResponse(null, { status: 500 });
  }
}
