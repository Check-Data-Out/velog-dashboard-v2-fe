import type { Metadata } from 'next';
import { Button, Dropdown, Section, Summary } from '@/components';

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
    <div className="flex w-full h-full gap-[30px] overflow-hidden max-MBI:flex-col max-TBL:gap-[20px]">
      <Summary views={12345} likes={54321} posts={12} />
      <div className="w-full h-full flex flex-col gap-[30px] max-TBL:gap-[20px]">
        <div className="flex flex-col items-center p-[25px] bg-BG-SUB gap-5 rounded-[4px]">
          <span className="text-TEXT-ALT font-semibold text-[18px] max-MBI:text-[16px] MBI:hidden">
            마지막 업데이트 : 2024-12-20, 20:13:34
          </span>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Button size="SMALL">새로고침</Button>
              <span className="text-TEXT-ALT font-semibold text-[18px] max-TBL:text-[16px] max-MBI:hidden">
                마지막 업데이트 : 2024-12-20, 20:13:34
              </span>
            </div>
            <div className="flex items-center gap-5">
              <Dropdown options={['오름차순', '내림차순']} />
              <Dropdown options={['시간순', '조회순', '좋아요순', '댓글순']} />
            </div>
          </div>
        </div>

        <div className="w-full h-full flex flex-col gap-[30px] overflow-y-auto max-TBL:gap-[20px]">
          {datas?.map((i) => <Section key={i.id} {...i} />)}
        </div>
      </div>
    </div>
  );
}
