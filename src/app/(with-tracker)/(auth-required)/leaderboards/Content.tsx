'use client';

import { Dropdown, Ranker, Rank } from '@/components';
import { SCREENS } from '@/constants';
import { useResponsive, useSearchParam } from '@/hooks';

const data = [
  { rank: 1, name: '정현우', count: 1235 },
  { rank: 2, name: '최하온', count: 1234 },
  { rank: 3, name: '이하준', count: 1233 },
  { rank: 4, name: '육기준', count: 1232 },
  { rank: 5, name: '칠기준', count: 1231 },
  { rank: 6, name: '팔기준', count: 1230 },
];

export const Content = () => {
  const width = useResponsive();
  const { setSearchParams } = useSearchParam();

  return (
    <div className="flex w-full h-full flex-col gap-[30px] overflow-auto items-center max-TBL:gap-5">
      <Dropdown
        options={[
          ['조회수', 'views'],
          ['좋아요', 'likes'],
        ]}
        onChange={(data) => setSearchParams({ type: data as string })}
        defaultValue={'조회수'}
      />
      <div className="w-full flex gap-10 max-MBI:flex-col max-MBI:gap-5">
        {width < SCREENS.MBI && <Ranker name="정현우" rank={1} count={1235} />}
        <Ranker name="최하온" rank={2} count={1234} />
        {width > SCREENS.MBI && <Ranker name="정현우" rank={1} count={1235} />}
        <Ranker name="이호준" rank={3} count={1233} />
      </div>
      <div className="w-full flex flex-wrap gap-10 max-TBL:gap-5">
        {data?.map((i) => (i.rank > 3 ? <Rank key={i.rank} {...i} /> : null))}
      </div>
    </div>
  );
};
