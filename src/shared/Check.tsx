import { twJoin } from 'tailwind-merge';

interface IProp extends React.HTMLAttributes<HTMLInputElement> {
  checked: boolean;
  label?: string;
  onChange: React.FormEventHandler<HTMLDivElement> | undefined;
  direction?: 'left' | 'right';
}

export const Check = ({ checked, label, onChange, direction = 'left', ...rest }: IProp) => {
  return (
    <label
      className={twJoin(
        'flex items-center gap-2 cursor-pointer',
        direction === 'left' ? 'flex-row' : 'flex-row-reverse',
      )}
    >
      {label && <span className="text-TEXT-SUB text-INPUT-2 max-TBL:text-INPUT-4">{label}</span>}
      <div
        data-label={label}
        className={twJoin(
          'border-[1px] shrink-0 rounded-md size-6',
          checked ? 'border-PRIMARY-MAIN bg-PRIMARY-SUB' : 'border-BORDER-SUB bg-BG-ALT',
        )}
      />
      <input {...rest} onChange={onChange} type="checkbox" checked={checked} className="hidden" />
    </label>
  );
};
