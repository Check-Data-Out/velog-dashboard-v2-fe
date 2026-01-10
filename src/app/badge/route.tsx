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
    console.log(e); // 추후 오류가 발생할 경우 어떤 오류인지 확인하기 위한 용도
    // TODO: 어떤 오류인지 확인 후 captureException으로 개선
    return NextResponse.json({ error: 'An error had been occured' }, { status: 500 });
  }
}
