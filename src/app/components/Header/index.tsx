'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startHolyLoader } from 'holy-loader';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useResponsive } from '@/hooks/useResponsive';
import { logout, me } from '@/lib/apis/user.request';
import { queryKeys } from '@/lib/constants/queryKeys.constant';
import { SCREENS } from '@/lib/constants/styles.constant';
import { revalidate } from '@/lib/utils/cache.util';
import { Icon, NameType } from '@/shared/Icon';
import { defaultStyle, Section, textStyle } from './Section';

const PARAMS = {
  MAIN: '?asc=false&sort=',
  LEADERBOARDS: '?based=user&sort=viewCount&limit=10&dateRange=30',
};

const layouts: Array<{ icon: NameType; title: string; path: string }> = [
  { icon: 'Analytics', title: '내 통계', path: `/main${PARAMS.MAIN}` },
  {
    icon: 'LeaderBoards',
    title: '리더보드',
    path: `/leaderboards${PARAMS.LEADERBOARDS}`,
  },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { open: openModal } = useModal();
  const menu = useRef<HTMLDivElement | null>(null);
  const path = usePathname();
  const { replace: replaceWithoutLoading } = useRouter();
  const width = useResponsive();
  const barWidth = width < SCREENS.MBI ? 65 : 180;
  const client = useQueryClient();

  const { mutate: out } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      client.clear();
      startHolyLoader();
      await revalidate();
    },
  });

  const { data: profiles } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: me,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) =>
      open && menu.current && !menu.current.contains(e.target as HTMLElement) && setOpen(false);

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menu, open]);

  return (
    <nav className="w-full max-MBI:flex max-MBI:justify-center">
      <div className="flex w-fit">
        <Section clickType="function" action={() => replaceWithoutLoading(`/main${PARAMS.MAIN}`)}>
          <Image width={35} height={35} src={'/favicon.png'} className="transition-all" alt="" />
          <span className="text-TEXT-MAIN text-TITLE-4 max-TBL:hidden">Velog Dashboard</span>
        </Section>
        <div className="flex w-fit relative">
          <div
            style={{
              transform: `translateX(${layouts.findIndex((i) => i.path.split('?')[0] === path) * barWidth}px)`,
            }}
            className={`${defaultStyle} h-[2px_!important] bg-TEXT-MAIN absolute bottom-0 left-0`}
          />
          {layouts.map((i) => (
            <Section key={i.title} clickType="link" icon={i.icon} action={i.path}>
              {i.title}
            </Section>
          ))}
        </div>
        <Section clickType="function" action={() => openModal({ type: 'notice' })}>
          <Icon name="Loudspeaker" size={25} />
          <span className={`${textStyle} text-TEXT-ALT`}>공지사항</span>
        </Section>
        <div className="w-fit h-fit flex flex-col relative z-50" ref={menu}>
          <Section clickType="function" action={() => setOpen((prev) => !prev)}>
            <Image
              width={35}
              height={35}
              className="rounded-full"
              src={profiles?.profile?.thumbnail || '/profile.jpg'}
              alt={profiles?.username ? `${profiles.username}의 프로필 이미지` : '프로필 이미지'}
            />
            <span className={`${textStyle} text-TEXT-ALT`} id="profile">
              {profiles?.username || 'NULL'}
            </span>
          </Section>
          {open && (
            <div className="flex flex-col items-center max-MBI:items-end absolute self-center top-[50px] max-MBI:right-[6px]">
              <div className="w-0 h-0 border-[15px] ml-3 mr-3 border-TRANSPARENT border-b-BG-SUB" />
              <div className="cursor-pointer h-fit flex-col rounded-[4px] bg-BG-SUB shadow-BORDER-MAIN shadow-md">
                <button
                  className="text-DESTRUCTIVE-SUB text-INPUT-3 p-5 max-MBI:p-4 flex whitespace-nowrap w-full justify-center hover:bg-BG-ALT"
                  onClick={() => {
                    startHolyLoader();
                    out();
                  }}
                >
                  로그아웃
                </button>
                <button
                  className="text-TEXT-MAIN text-INPUT-3 p-5 max-MBI:p-4 flex items-center justify-center whitespace-nowrap w-full hover:bg-BG-ALT"
                  onClick={() => {
                    setOpen(false);
                    openModal({ type: 'qrcode' });
                  }}
                >
                  QR 로그인
                </button>
                <button
                  className="text-TEXT-MAIN text-INPUT-3 p-5 max-MBI:p-4 flex items-center justify-center whitespace-nowrap w-full hover:bg-BG-ALT"
                  onClick={() => {
                    setOpen(false);
                    openModal({ type: 'badge' });
                  }}
                >
                  뱃지 생성기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
