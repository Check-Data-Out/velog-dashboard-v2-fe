'use client';

import { useQuery } from '@tanstack/react-query';
import { notiList } from '@/apis';
import { PATHS } from '@/constants';
import { Modal as Layout } from '@/components';
import { convertDateToKST } from '@/utils/dateUtil';

export const Modal = () => {
  const { data } = useQuery({ queryKey: [PATHS.NOTIS], queryFn: notiList });

  return (
    <Layout title="공지사항" className="w-[800px] h-[500px] max-MBI:w-[450px] max-MBI:h-[200px]">
      {data?.posts?.map(({ content, created_at, id, title }) => (
        <div key={id} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-TEXT-MAIN text-T4 max-MBI:text-T5">{title}</h3>
            <h4 className="text-TEXT-ALT text-T5 max-MBI:text-ST5">
              {convertDateToKST(created_at)?.short}
            </h4>
          </div>
          <div
            className="text-TEXT-MAIN text-I4 prose"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ))}
    </Layout>
  );
};
