import { parseNumber } from '@/utils/numberUtil';

interface IProp {
  title: string;
  content: number;
  increasement?: number;
  prefix?: string;
}

const afterContent =
  'before:text-primary-sub before:content-[attr(data-increasement)_"↑"] before:mr-2 before:text-[18px]';

export const BarContent = ({
  title,
  content,
  increasement,
  prefix = '개',
}: IProp) => {
  return (
    <div className="w-full flex justify-between items-center">
      <span className="text-[15px] font-medium text-text-alt">{title}</span>
      <span
        className={`flex items-center font-bold text-text-main text-[25px] ${increasement ? afterContent : ''}`}
        data-increasement={parseNumber(increasement ? increasement : 0)}
      >
        {parseNumber(content) + prefix}
      </span>
    </div>
  );
};
