'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { COLORS, SCREENS } from '@/constants';
import { useResponsive } from '@/hooks';
import { Icon, NameType } from '@/components';

const layouts: Array<{ icon: NameType; title: string; path: string }> = [
  { icon: 'Analytics', title: '내 통계', path: '/main' },
  { icon: 'LeaderBoards', title: '리더보드', path: '/leaderboards' },
  { icon: 'Compare', title: '통계 비교', path: '/compare' },
];

const defaultStyle =
  'w-[180px] h-[65px] transition-all duration-300 shrink-0 max-MBI:w-[65px] ';
const navigateStyle = 'gap-5 flex items-center justify-center cursor-pointer ';

export const Header = () => {
  const width = useResponsive();
  const path = usePathname();
  const textStyle = (currentPath: string) =>
    `${currentPath === path ? 'text-TEXT-MAIN' : 'text-TEXT-ALT'} text-[20px] shrink-0 transition-all duration-300 max-TBL:text-[18px] max-MBI:hidden `;

  return (
    <nav className="w-full max-MBI:flex max-MBI:justify-center">
      <div className="flex w-fit relative">
        <div
          style={{
            transform: `translateX(${layouts.findIndex((i) => i.path === path) * (width < SCREENS.MBI ? 65 : 180)}px)`,
          }}
          className={`${defaultStyle} h-[2px_!important] bg-TEXT-MAIN absolute bottom-0 left-0`}
        />
        {layouts.map((i) => (
          <Link
            href={i.path}
            key={i.title}
            className={`${defaultStyle} ${navigateStyle} ${i.path === path && 'font-semibold'}`}
          >
            <Icon
              size={25}
              color={COLORS.TEXT[i.path === path ? 'MAIN' : 'ALT']}
              name={i.icon}
            />
            <span className={textStyle(i.path)}>{i.title}</span>
          </Link>
        ))}
        <div className={defaultStyle + navigateStyle}>
          <Image
            width={35}
            height={35}
            className="rounded-full"
            src="/profile.jpg"
            alt=""
          />
          <span className={textStyle('username')}>스탠다드</span>
        </div>
      </div>
    </nav>
  );
};
