import type { Metadata } from 'next';
import { Section, Summary } from '@/components';

export const metadata: Metadata = {
  title: '대시보드',
  description: '각종 Velog 통계를 볼 수 있는 대시보드',
};

const datas = [
  {
    id: '129036-123512-590731-048113',
    title: '2024 스탠다드 회고록',
    date: '2024-12-15T13:06.16.325Z',
    total_views: 40234,
    before_views: 10,
    views: 31,
    likes: 200,
  },
  {
    id: '693518-067013-681903-406913',
    title: 'React의 내부 구조에 대해...',
    date: '2024-12-01T03:36.01.112Z',
    total_views: 1032,
    before_views: 30,
    views: 12,
    likes: 140,
  },
  {
    id: '050213-601471-693861-106831',
    title: '아파트 아파트, 아파트 아파트, 아파트 아파트, 어, 어허 어허',
    date: '2024-11-30T03:36.01.112Z',
    total_views: 1032,
    before_views: 30,
    views: 12,
    likes: 140,
  },
  {
    id: '692961-701396-070918-185602',
    title: 'Tree shaking이란 무엇일까?',
    date: '2024-11-29T03:36.01.112Z',
    total_views: 1032,
    before_views: 30,
    views: 12,
    likes: 140,
  },
  {
    id: '105321-691031-601301-681031',
    title:
      '"use client"가 CSR이라고 알고 있는 거 아니죠? Next.js 면접질문 정복',
    date: '2024-11-28T03:36.01.112Z',
    total_views: 1032,
    before_views: 30,
    views: 12,
    likes: 140,
  },
];

export default function Page() {
  return (
    <div className="flex w-full h-full gap-[30px] overflow-hidden max-mbi:flex-col max-tbl:gap-[20px]">
      <Summary
        total_likes={12345}
        total_posts={12}
        total_views={54321}
        views={123}
        likes={321}
      />
      <div className="w-full h-full flex flex-col gap-[30px] overflow-y-auto max-tbl:gap-[20px]">
        {datas?.map((i) => <Section key={i.id} {...i} />)}
      </div>
    </div>
  );
}
