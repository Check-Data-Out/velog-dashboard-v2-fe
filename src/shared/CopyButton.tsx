import { HTMLProps, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const ROLLBACK_AFTER_CLICK_MS = 1000;

interface IProp extends HTMLProps<HTMLButtonElement> {
  type?: 'default' | 'code';
  url?: string;
  disabled?: boolean;
}

export const CopyButton = ({ url, type = 'default', disabled, ...rest }: IProp) => {
  const [clicked, setClicked] = useState(false);
  const clickedRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (clickedRef.current) clearTimeout(clickedRef.current);
    };
  }, []);

  const handleClick = async () => {
    if (clicked || !url) return;

    try {
      await navigator.clipboard.writeText(url);
      setClicked(true);

      if (clickedRef.current) clearTimeout(clickedRef.current);

      clickedRef.current = setTimeout(() => setClicked(false), ROLLBACK_AFTER_CLICK_MS);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const baseStyle = `
    relative block overflow-hidden rounded-lg
    transition-all duration-200
    after:absolute after:inset-0 after:flex after:items-center after:justify-center
    after:rounded-lg after:transition-all after:duration-300 after:font-medium after:pointer-events-none
    after:text-TEXT-MAIN
  `;

  const activeStyle = !disabled && 'cursor-pointer bg-BG-MAIN text-TEXT-MAIN hover:shadow-lg';

  const disabledStyle = disabled && 'cursor-not-allowed bg-BG-ALT text-TEXT-SUB opacity-50';

  const hoverStyle =
    !disabled &&
    `after:content-["클릭해서_복사하기"] after:bg-BG-MAIN after:opacity-0 after:scale-95 hover:after:opacity-100 hover:after:scale-100
  `;

  const clickedStyle =
    clicked &&
    `after:content-["복사_완료!"] after:bg-PRIMARY-SUB after:text-BG-MAIN after:opacity-100 after:scale-100
  `;

  return (
    <button
      {...rest}
      onClick={handleClick}
      disabled={disabled}
      className={twMerge(
        baseStyle,
        activeStyle,
        disabledStyle,
        hoverStyle,
        clickedStyle,
        type === 'code' ? 'w-fit max-w-full p-5' : 'p-4 leading-none truncate',
        rest.className,
      )}
    >
      {type === 'default' ? (
        url
      ) : (
        <code className="block text-left break-words whitespace-pre-wrap w-fit text-TEXT-MAIN">
          {url}
        </code>
      )}
    </button>
  );
};
