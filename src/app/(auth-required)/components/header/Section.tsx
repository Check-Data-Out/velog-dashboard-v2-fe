import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, NameType } from '@/components';
import { COLORS } from '@/constants';

export const defaultStyle =
  'w-[180px] h-[65px] px-9 transition-all duration-300 shrink-0 max-MBI:w-[65px] max-MBI:px-0 ';
export const navigateStyle =
  'gap-5 flex items-center justify-center cursor-pointer ';
export const textStyle =
  'text-ST4 shrink-0 transition-all duration-300 max-MBI:hidden ';

type clickType = 'link' | 'function' | 'none';
type BaseType = { icon: NameType };

type PropType<T extends clickType> = T extends 'link'
  ? BaseType & {
      clickType: 'link';
      action: string;
      children: string;
    }
  : T extends 'function'
    ? Partial<BaseType> & {
        clickType: 'function';
        action: () => void;
        children: React.ReactNode;
      }
    : T extends 'none'
      ? Partial<BaseType> & {
          clickType: 'none';
          action?: undefined;
          children: React.ReactNode;
        }
      : never;

export const Section = <T extends clickType>({
  action,
  clickType,
  children,
  icon,
}: PropType<T>) => {
  const currentPath = usePathname();

  if (clickType === 'link') {
    return (
      <Link
        href={action}
        className={defaultStyle + navigateStyle}
        id="navigation"
      >
        <Icon
          size={25}
          color={
            COLORS.TEXT[
              typeof action === 'string' && action.includes(currentPath)
                ? 'MAIN'
                : 'ALT'
            ]
          }
          name={icon}
        />
        <span
          className={`${action.split('?')[0] === currentPath ? 'text-TEXT-MAIN' : 'text-TEXT-ALT'} ${textStyle}`}
        >
          {children}
        </span>
      </Link>
    );
  }

  return (
    <div
      onClick={action}
      className={`${defaultStyle + navigateStyle} TBL:min-w-[180px] rounded-t-[4px] w-[fit-content_!important] max-MBI:w-[65px_!important]`}
    >
      {children}
    </div>
  );
};
