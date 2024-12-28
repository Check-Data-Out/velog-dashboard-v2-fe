import { parseNumber } from '@/utils/numberUtil';

interface IProp {
  title: string;
  content: number;
  increasement?: number;
  prefix?: string;
}

const afterContent =
  'after:text-PRIMARY-SUB after:content-[attr(data-increasement)_"↑"] after:ml-2 after:text-ST3 max-TBL:after:text-ST4 transition-all';

export const SidebarContent = ({
  title,
  content,
  increasement,
  prefix = '개',
}: IProp) => {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] bg-BG-SUB w-[375px] p-4 rounded-[4px] h-full max-TBL:w-[280px]">
      <span className="text-TEXT-ALT text-T4 transition-all max-TBL:text-T5">
        {title}
      </span>
      <span
        className={`flex items-center text-TEXT-MAIN text-T1 transition-all max-TBL:text-T2 ${increasement && increasement !== 0 ? afterContent : ''}`}
        data-increasement={parseNumber(increasement as number)}
      >
        {parseNumber(content) + prefix}
      </span>
    </div>
  );
};
