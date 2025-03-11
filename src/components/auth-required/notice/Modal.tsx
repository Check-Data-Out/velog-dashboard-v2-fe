'use client';

import { useQuery } from '@tanstack/react-query';
import { notiList } from '@/apis';
import { PATHS } from '@/constants';
import { useModal } from '@/hooks/useModal';
import { Icon } from '@/components/common';

export const Modal = () => {
  const { close } = useModal();
  const { data } = useQuery({ queryKey: [PATHS.NOTIS], queryFn: notiList });

  return (
    <div className="w-[800px] h-[500px] max-MBI:w-[450px] max-MBI:h-[200px] overflow-auto flex flex-col gap-3 p-10 max-MBI:p-7 rounded-md bg-BG-SUB">
      <div className="flex items-center justify-between">
        <h2 className="text-TEXT-MAIN items-cenetr gap-3 text-T3 max-MBI:text-T4">
          공지사항
        </h2>
        <Icon name="Close" onClick={close} className="cursor-pointer" />
      </div>

      {data?.posts?.map(({ content, created_at, id, title }) => (
        <div key={id} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-TEXT-MAIN text-T4 max-MBI:text-T5">{title}</h3>
            <h4 className="text-TEXT-ALT text-T5 max-MBI:text-ST5">
              {created_at.split('T')[0]}
            </h4>
          </div>
          <div
            className="text-TEXT-MAIN text-I4"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      ))}
    </div>
  );
};
