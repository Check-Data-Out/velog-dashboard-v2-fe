'use client';

import { create } from 'zustand';

interface StatsRefreshType {
  status: boolean;
  setStatus: (value: boolean) => void;
  init: () => void;
}

export const useStatsRefresh = create<StatsRefreshType>((set) => ({
  status: false,
  setStatus: (value: boolean) => {
    localStorage.setItem('statsRefresh', `${value}`);
    set(() => ({ status: value }));
  },
  init: () => {
    const value = localStorage.getItem('statsRefresh');
    if (value === undefined) localStorage.setItem('statsRefresh', 'false');
    else {
      set(() => ({ status: JSON.parse(localStorage.getItem('statsRefresh') as string) }));
    }
  },
}));
