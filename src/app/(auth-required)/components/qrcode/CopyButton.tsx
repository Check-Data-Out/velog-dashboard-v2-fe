import { useRef, useState } from 'react';

const ROLLBACK_AFTER_CLICK_MS = 1000;

interface IProp {
  url?: string;
  disabled?: boolean;
}

export const CopyButton = ({ url, disabled }: IProp) => {
  const [clicked, setClicked] = useState(false);
  const clickedRef = useRef<NodeJS.Timeout | null>(null);

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

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative block p-4 rounded-lg leading-none overflow-hidden transition-all duration-200
        after:absolute after:inset-0 after:flex after:items-center after:justify-center truncate
        after:rounded-lg after:transition-all after:duration-300 after:font-medium after:pointer-events-none
        ${
          disabled
            ? 'cursor-not-allowed bg-BG-ALT text-TEXT-SUB opacity-50'
            : clicked
              ? 'cursor-pointer bg-BG-MAIN text-TEXT-MAIN hover:shadow-lg after:content-["복사_완료!"] after:bg-PRIMARY-SUB after:text-BG-MAIN after:opacity-100 after:scale-100'
              : 'cursor-pointer bg-BG-MAIN text-TEXT-MAIN hover:shadow-lg after:content-["클릭해서_복사하기"] after:bg-BG-MAIN after:text-TEXT-MAIN after:opacity-0 after:scale-95 hover:after:opacity-100 hover:after:scale-100'
        }
      `}
    >
      {url}
    </button>
  );
};
