export interface IProp {
  name: string;
  rank: string | number;
  count: number;
  suffix?: string;
}

export const Ranker = ({ name, rank, count, suffix = '회' }: IProp) => {
  return (
    <div
      className={`${rank === 1 ? 'w-full border-BORDER-SUB' : 'w-[70%] border-BORDER-MAIN'} max-MBI:border-[3px] flex justify-center items-center gap-[10px]  h-[250px] p-[25px] bg-BG-SUB rounded-[4px] max-MBI:w-full max-MBI:h-fit max-MBI:flex-row max-MBI:justify-between`}
    >
      <div className="flex gap-3 items-center MBI:flex-col">
        <span className="text-T4 text-TEXT-ALT max-TBL:text-T5">{rank}위</span>
        <span
          className="flex items-center gap-3 text-T1 text-TEXT-MAIN after:text-PRIMARY-SUB after:content-['('_attr(data-count)_')'] after:text-ST3 max-TBL:text-T2 max-MBI:text-ST4 max-TBL:after:text-ST4 max-MBI:after:hidden"
          data-count={count + suffix}
        >
          {name}
        </span>
      </div>
      <span className="text-TEXT-SUB text-ST4 MBI:hidden">{count}회</span>
    </div>
  );
};
