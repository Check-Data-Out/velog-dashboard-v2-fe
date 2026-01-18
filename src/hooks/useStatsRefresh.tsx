'use client';

import { create } from 'zustand';

interface StatsRefreshType {
  status: boolean;
  setStatus: (value: boolean) => void;
  init: () => boolean;
}

export const useStatsRefresh = create<StatsRefreshType>((set) => ({
  status: false,
  setStatus: (value: boolean) => {
    localStorage.setItem('statsRefresh', `${value}`);
    set(() => ({ status: value }));
  },
  init: () => {
    const value = localStorage.getItem('statsRefresh');
    if (value === null) {
      localStorage.setItem('statsRefresh', 'false');
      return false;
    } else {
      set(() => ({ status: JSON.parse(value as string) }));
      return JSON.parse(value as string);
    }
  },
}));
