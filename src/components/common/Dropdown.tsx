interface IProp {
  options: string[];
}

export const Dropdown = ({ options }: IProp) => {
  return (
    <div className="w-[100px] rounded-[4px] overflow-hidden border-BORDER-SUB bg-BG-SUB border-[1px] shrink-0 relative">
      <select className="w-full h-[32px] px-2 bg-[#00000000] text-[16px] max-TBL:text-[14px] text-TEXT-MAIN font-normal cursor-pointer relative z-40">
        {options.map((i, j) => (
          <option key={j}>{i}</option>
        ))}
      </select>
      <div className="w-0 h-0 border-[4px] border-[#00000000] border-t-TEXT-MAIN absolute top-[15px] right-2" />
    </div>
  );
};
