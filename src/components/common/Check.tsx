interface IProp extends React.HTMLAttributes<HTMLInputElement> {
  checked: boolean;
  label?: string;
  onChange: React.FormEventHandler<HTMLDivElement> | undefined;
  direction?: 'left' | 'right';
}

export const Check = ({
  checked,
  label,
  onChange,
  direction = 'left',
  ...rest
}: IProp) => {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer ${direction === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {label && (
        <span className="text-TEXT-SUB text-I2 max-TBL:text-I4">{label}</span>
      )}
      <div
        data-label={label}
        className={`border-[1px] shrink-0 rounded-md w-6 h-6 ${checked ? 'border-PRIMARY-MAIN bg-PRIMARY-SUB' : 'border-BORDER-SUB bg-BG-ALT'}`}
      />
      <input
        {...rest}
        onChange={onChange}
        type="checkbox"
        checked={checked}
        className="hidden"
      />
    </label>
  );
};
