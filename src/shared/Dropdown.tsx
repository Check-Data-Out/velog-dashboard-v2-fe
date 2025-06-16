export type OptionType = string | [string, string, boolean?] | string[];

interface IProp extends Omit<React.HTMLAttributes<HTMLSelectElement>, 'onChange' | 'defaultValue'> {
  /** 드롭다운 선택지 (문자열 or [Key 문자열, Value 문자열, 배열째 반환 여부] ) */
  options: Array<OptionType>;
  // eslint-disable-next-line no-unused-vars
  onChange: (data: OptionType) => void;
  disabled?: boolean;
  defaultValue: OptionType;
}

export const Dropdown = ({ options, onChange, defaultValue, disabled, ...rest }: IProp) => {
  return (
    <label className="min-w-[100px] px-2 w-fit h-[34px] rounded-[4px] overflow-hidden flex items-center gap-3 justify-center border-BORDER-SUB bg-BG-SUB border-[1px] shrink-0 relative">
      <select
        {...rest}
        disabled={disabled}
        onChange={(e) => {
          const value = options.find((i) =>
            typeof i === 'object' ? i[0] === e.target.value : i === e.target.value,
          ) as OptionType;
          onChange(typeof value === 'object' ? (value[2] ? value : value[1]) : value);
        }}
        defaultValue={typeof defaultValue === 'object' ? defaultValue[0] : defaultValue}
        className="w-full bg-TRANSPARENT text-I2 max-TBL:text-I4 text-TEXT-MAIN cursor-pointer z-40"
      >
        {options.map((i, j) => (
          <option key={j} className="bg-BG-SUB">
            {typeof i === 'object' ? i[0] : i}
          </option>
        ))}
      </select>
      <div className="w-0 h-0 pointer-events-none cursor-none border-[4px] border-TRANSPARENT mt-1 border-t-BORDER-SUB right-2" />
    </label>
  );
};
