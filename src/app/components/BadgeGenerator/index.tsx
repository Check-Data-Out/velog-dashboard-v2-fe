'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { me } from '@/apis';
import { PATHS, ENVS } from '@/constants';
import { Check, CopyButton, Dropdown, Modal as Layout } from '@/shared';

export const BadgeGenerator = () => {
  const [type, setType] = useState('default');
  const [assets, setAssets] = useState({ views: true, likes: true, posts: true });

  const handleChangeAssets = ({ currentTarget }: FormEvent<HTMLInputElement>) => {
    const { id, checked } = currentTarget;
    setAssets((prev) => ({ ...prev, [id]: checked }));
  };

  const {
    data: profiles,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [PATHS.ME],
    queryFn: me,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const selectedAssets = Object.entries(assets)
    .filter((value) => value[1])
    .map(([key]) => key);

  const url = `${ENVS.CLIENT_BASE_URL}/badge?username=${profiles?.username}&type=${type}${selectedAssets.length ? `&assets=${selectedAssets.join(',')}` : ''}`;

  return (
    <Layout title="뱃지 생성기">
      <div className="flex justify-between gap-10 max-TBL:flex-col max-TBL:justify-normal">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col">
            <span className="text-TEXT-MAIN text-TITLE-5">레이아웃 형태</span>
            <Dropdown
              options={[
                ['기본 보기', 'default'],
                ['간단 보기', 'simple'],
              ]}
              onChange={(value) => setType(value as string)}
              defaultValue={'기본 보기'}
            />
          </div>
          <div className="flex gap-2 flex-col">
            <span className="text-TEXT-MAIN text-TITLE-5">표시할 통계</span>
            <div className="flex items-center gap-5">
              <Check
                onChange={handleChangeAssets}
                id="views"
                checked={assets.views}
                label="총 조회수"
              />
              <Check
                onChange={handleChangeAssets}
                id="likes"
                checked={assets.likes}
                label="총 좋아요 수"
              />
              <Check
                onChange={handleChangeAssets}
                id="posts"
                checked={assets.posts}
                label="총 게시물 수"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            <span className="text-TEXT-MAIN text-TITLE-5">HTML 코드 </span>
            <CopyButton
              url={`<a href="https://velog.io/@${profiles?.username}">\n  <img src="${url}"/>\n</a>`}
              type="code"
              className="max-w-[650px]"
            />
          </div>
          <div className="flex gap-2 flex-col">
            <span className="text-TEXT-MAIN text-TITLE-5">URL</span>
            <CopyButton url={url} className="max-w-[650px]" />
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <span className="text-TEXT-MAIN text-TITLE-5">
            미리보기{' '}
            <span className="text-TEXT-ALT text-SUBTITLE-5">
              * 내용이 바로 반영되지 않을 수 있습니다
            </span>
          </span>
          <div
            className={twMerge(
              'shrink-0 relative max-MBI:w-full',
              // TODO: 뱃지 디자인이 달라지는 경우에도 쉽게 맞출 수 있도록 개선 필요함
              type === 'default'
                ? 'w-[550px] MBI:h-[350px] max-MBI:max-w-[550px]'
                : 'w-[350px] MBI:h-[140px] max-MBI:max-w-[350px]',
            )}
          >
            {isFetching || isError ? (
              <div className="w-full h-[350px] bg-BG-SUB" />
            ) : (
              <Image fill key={type} src={url} alt="Preview" />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
