'use client';

import { create } from 'zustand';

interface ModalType {
  Modal?: React.ReactNode;
  open: (Modal: React.ReactNode) => void;
  close: () => void;
}

export const useModal = create<ModalType>((set) => ({
  Modal: undefined,
  open: (Modal: React.ReactNode) => set(() => ({ Modal })),
  close: () => set(() => ({ Modal: undefined })),
}));
