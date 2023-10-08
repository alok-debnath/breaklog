import { create } from 'zustand';

export const useStore = create((set) => ({
  themeMode: 'night',
  logs: [],
  userData: [],
  breaklogMode: true,
  workData: [],
  loading: false,
  currBreak: null,
  liveBreaks: 0,
}));
