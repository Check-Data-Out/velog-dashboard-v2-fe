'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { COLORS, PATHS, SCREENS } from '@/constants';
import { Icon, NameType } from '@/components';
import { useResponsive } from '@/hooks';
import { logout, me } from '@/apis';

const layouts: Array<{ icon: NameType; title: string; path: string }> = [
  { icon: 'Analytics', title: '내 통계', path: '/main' },
  { icon: 'LeaderBoards', title: '리더보드', path: '/leaderboards' },
  { icon: 'Compare', title: '통계 비교', path: '/compare' },
];

const defaultStyle =
  'w-[180px] h-[65px] px-9 transition-all duration-300 shrink-0 max-MBI:w-[65px] max-MBI:px-0 ';
const navigateStyle = 'gap-5 flex items-center justify-center cursor-pointer ';

export const Header = () => {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const width = useResponsive();
  const path = usePathname();
  const textStyle = (currentPath: string) =>
    `${currentPath === path ? 'text-TEXT-MAIN' : 'text-TEXT-ALT'} text-ST4 shrink-0 transition-all duration-300 max-MBI:hidden `;

  const { mutate: out } = useMutation({
    mutationFn: logout,
    onSuccess: () => router.replace('/'),
  });

  const { data: profiles } = useQuery({
    queryKey: [PATHS.ME],
    queryFn: async () => me({}),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) =>
      open &&
      menu.current &&
      !menu.current.contains(e.target as HTMLElement) &&
      setOpen(false);

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menu, open]);

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
            className={defaultStyle + navigateStyle}
          >
            <Icon
              size={25}
              color={COLORS.TEXT[i.path === path ? 'MAIN' : 'ALT']}
              name={i.icon}
            />
            <span className={textStyle(i.path)}>{i.title}</span>
          </Link>
        ))}
        <div className="w-fit h-fit flex flex-col relative z-50" ref={menu}>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className={`${defaultStyle + navigateStyle} transition-[none_!important] min-w-[180px] rounded-t-[4px] w-[fit-content_!important] max-MBI:min-w-[0] max-MBI:w-[65px_!important]`}
          >
            <Image
              width={35}
              height={35}
              className="rounded-full"
              src={profiles?.profile.thumbnail || '/profile.jpg'}
              alt=""
            />
            <span className={textStyle('username')}>
              {profiles?.username || 'NULL'}
            </span>
          </div>
          {open && (
            <div className="flex flex-col items-center max-MBI:items-end absolute self-center top-[50px] max-MBI:right-[6px]">
              <div className="w-0 h-0 border-[15px] ml-3 mr-3 border-TRANSPARENT border-b-BG-SUB" />
              <div className="cursor-pointer h-fit flex-col rounded-[4px] bg-BG-SUB hover:bg-BG-ALT shadow-BORDER-MAIN shadow-md">
                <button
                  className="text-DESTRUCTIVE-SUB text-I3 p-5 max-MBI:p-4 flex whitespace-nowrap w-auto"
                  onClick={() => out()}
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
