'use client';

import { create } from 'zustand';
import type { SidebarIdType } from '@/lib/constants/sidebar.constant';

/**
 * 열릴 수 있는 모달의 타입 정의.
 * ReactNode를 직접 state에 저장하는 대신 직렬화 가능한 식별자 + props를 저장.
 * - React DevTools에서 디버깅 가능
 * - Hot Reload 시 state 오염 없음
 * - 타입 안전한 props 전달
 */
export type ModalState =
  | { type: 'notice' }
  | { type: 'qrcode' }
  | { type: 'badge' }
  | { type: 'stats'; name: SidebarIdType };

interface ModalStore {
  modal: ModalState | null;
  open: (modal: ModalState) => void;
  close: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  modal: null,
  open: (modal) => set({ modal }),
  close: () => set({ modal: null }),
}));
