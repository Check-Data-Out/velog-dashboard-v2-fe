import { useModal } from '@/hooks/useModal';
import { SidebarIdType } from '@/lib/constants/sidebar.constant';
import { parseNumber } from '@/lib/utils/number.util';
import { Inform } from '@/shared/Inform';

interface IProp {
  title: string;
  content: number;
  increasement?: number;
  typeIsCount?: boolean;
  id: SidebarIdType;
}

export const SidebarContent = ({ title, content, increasement, typeIsCount, id }: IProp) => {
  const { open } = useModal();

  return (
    <div
      onClick={() => open({ type: 'stats', name: id })}
      className="flex flex-col items-center justify-center gap-3 bg-BG-SUB w-[375px] hover:bg-BG-ALT cursor-pointer transition-all duration-300 p-4 rounded-[4px] h-full max-TBL:w-[280px]"
    >
      <Inform>
        <Inform.Title>{title}</Inform.Title>
        <Inform.Horizontal>
          <Inform.Content suffix={typeIsCount ? '회' : '개'}>{parseNumber(content)}</Inform.Content>
          {increasement ? (
            <Inform.Highlighted suffix="↑">{parseNumber(increasement)}</Inform.Highlighted>
          ) : (
            <></>
          )}
        </Inform.Horizontal>
      </Inform>
      <span className="text-TEXT-ALT text-SUBTITLE-5">클릭해서 통계 그래프 보기</span>
    </div>
  );
};
