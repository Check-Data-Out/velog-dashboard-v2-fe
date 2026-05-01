import { parseNumber } from '@/lib/utils/number.util';

interface IProp {
  title: string;
  content: number;
  increasement?: number;
  prefix?: string;
}

const afterContent =
  'before:text-PRIMARY-SUB before:content-[attr(data-increasement)_"↑"] before:mr-2 before:text-TITLE-5';

export const BarContent = ({ title, content, increasement, prefix = '개' }: IProp) => {
  return (
    <div className="w-full flex justify-between items-center">
      <span className="text-SUBTITLE-5 text-TEXT-ALT">{title}</span>
      <span
        className={`flex items-center text-TEXT-MAIN text-TITLE-4 ${increasement !== undefined ? afterContent : ''}`}
        data-increasement={parseNumber(increasement ?? 0)}
      >
        {parseNumber(content) + prefix}
      </span>
    </div>
  );
};
