import { parseNumber } from '@/utils/numberUtil';

interface IProp {
  title: string;
  content: number;
  increasement?: number;
  prefix?: string;
}

const afterContent =
  'after:text-PRIMARY-SUB after:content-[attr(data-increasement)_"↑"] after:ml-2 after:text-[25px] max-TBL:after:text-[20px] transition-all';

export const SidebarContent = ({
  title,
  content,
  increasement,
  prefix = '개',
}: IProp) => {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] bg-BG-SUB w-[375px] p-4 rounded-[4px] h-full max-TBL:w-[280px]">
      <span className="text-TEXT-ALT font-medium text-[20px] max-TBL:text-[18px] transition-all">
        {title}
      </span>
      <span
        className={`flex items-center text-TEXT-MAIN font-bold text-[35px] transition-all ${increasement ? afterContent : ''} max-TBL:text-[30px] max-MBI:text-[25px]`}
        data-increasement={parseNumber(increasement ? increasement : 0)}
      >
        {parseNumber(content) + prefix}
      </span>
    </div>
  );
};
