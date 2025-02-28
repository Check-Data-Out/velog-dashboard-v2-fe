'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PATHS, SCREENS } from '@/constants';
import { NameType } from '@/components';
import { useResponsive } from '@/hooks';
import { logout, me } from '@/apis';
import { trackUserEvent, MessageEnum } from '@/utils/trackUtil';
import { revalidate } from '@/utils/revalidateUtil';
import { defaultStyle, Section, textStyle } from './Section';

const PARAMS = {
  MAIN: '?asc=false&sort=',
  LEADERBOARDS: '?type=views',
};

const layouts: Array<{ icon: NameType; title: string; path: string }> = [
  { icon: 'Analytics', title: '내 통계', path: `/main${PARAMS.MAIN}` },
  {
    icon: 'LeaderBoards',
    title: '리더보드',
    path: `/leaderboards${PARAMS.LEADERBOARDS}`,
  },
  { icon: 'Compare', title: '통계 비교', path: '/compare' },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement | null>(null);
  const path = usePathname();
  const router = useRouter();
  const width = useResponsive();
  const barWidth = width < SCREENS.MBI ? 65 : 180;

  const { mutate: out } = useMutation({
    mutationFn: logout,
    onSuccess: revalidate,
  });

  const { data: profiles } = useQuery({ queryKey: [PATHS.ME], queryFn: me });

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
      <div className="flex w-fit">
        <Section
          clickType="function"
          action={() => router.replace(`/main${PARAMS.MAIN}`)}
        >
          <Image
            width={35}
            height={35}
            src={'/favicon.png'}
            className="transition-all"
            alt=""
          />
          <span className="text-TEXT-MAIN text-T4 max-TBL:hidden">
            Velog Dashboard
          </span>
        </Section>
        <div className="flex w-fit relative">
          <div
            style={{
              transform: `translateX(${layouts.findIndex((i) => i.path.split('?')[0] === path) * barWidth}px)`,
            }}
            className={`${defaultStyle} h-[2px_!important] bg-TEXT-MAIN absolute bottom-0 left-0`}
          />
          {layouts.map((i) => (
            <Section
              key={i.title}
              clickType="link"
              icon={i.icon}
              action={i.path}
            >
              {i.title}
            </Section>
          ))}
        </div>

        <div className="w-fit h-fit flex flex-col relative z-50" ref={menu}>
          <Section clickType="function" action={() => setOpen((prev) => !prev)}>
            <Image
              width={35}
              height={35}
              className="rounded-full"
              src={profiles?.profile.thumbnail || '/profile.jpg'}
              alt=""
            />
            <span className={textStyle + 'text-TEXT-ALT'} id="profile">
              {profiles?.username || 'NULL'}
            </span>
          </Section>
          {open && (
            <div className="flex flex-col items-center max-MBI:items-end absolute self-center top-[50px] max-MBI:right-[6px]">
              <div className="w-0 h-0 border-[15px] ml-3 mr-3 border-TRANSPARENT border-b-BG-SUB" />
              <div className="cursor-pointer h-fit flex-col rounded-[4px] bg-BG-SUB hover:bg-BG-ALT shadow-BORDER-MAIN shadow-md">
                <button
                  className="text-DESTRUCTIVE-SUB text-I3 p-5 max-MBI:p-4 flex whitespace-nowrap w-auto"
                  onClick={() => {
                    out();
                    trackUserEvent(MessageEnum.LOGOUT);
                  }}
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
