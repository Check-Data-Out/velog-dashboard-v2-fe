'use client';

import { useQuery } from '@tanstack/react-query';
import { notiList } from '@/apis';
import { PATHS } from '@/constants';
import { Modal as Layout } from '@/shared';
import { convertDateToKST } from '@/utils';

export const Modal = () => {
  const { data } = useQuery({ queryKey: [PATHS.NOTIS], queryFn: notiList });

  return (
    <Layout title="공지사항" className="w-[800px] h-[500px]">
      <div className="flex flex-col w-full h-full overflow-auto gap-5">
        {data?.posts?.map(({ content, created_at, id, title }) => (
          <div key={id} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-TEXT-MAIN text-TITLE-4 max-MBI:text-TITLE-5">{title}</h3>
              <h4 className="text-TEXT-ALT text-TITLE-5 max-MBI:text-SUBTITLE-5">
                {convertDateToKST(created_at)?.short}
              </h4>
            </div>
            <div
              className="text-TEXT-MAIN text-[14px] prose !max-w-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        ))}
      </div>
    </Layout>
  );
};
