import type { IProp } from '../../../../components/auth-required/leaderboards/Ranker';

export const Rank = ({ name, rank, count, suffix = '회' }: IProp) => {
  return (
    <div className="min-w-[40%] w-full p-[25px] bg-BG-SUB rounded-[4px] justify-between flex">
      <span
        data-rank={rank}
        className="text-T3 text-TEXT-MAIN flex items-center gap-3 before:content-[attr(data-rank)_'위'] before:text-ST4 before:text-TEXT-ALT max-TBL:text-T4 max-TBL:before:text-T5 max-MBI:text-ST4 max-MBI:before:text-ST5"
      >
        {name}
      </span>
      <span className="text-ST3 text-TEXT-SUB max-TBL:text-T4 max-MBI:text-ST4">
        {count}
        {suffix}
      </span>
    </div>
  );
};
