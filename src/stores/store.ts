import { create } from 'zustand';

interface WorkData {
  lastLogStatus: string;
  breakTime: string;
  workDone: string;
}
interface StoreState {
  themeMode: string;
  logs: any[];
  userData: any[];
  breaklogMode: boolean;
  workData: WorkData; // Replace 'any' with the actual type of workData
  loading: boolean;
  currBreak: null | Date; // Change 'null' to 'null | Date' for date type
  liveBreaks: number;
  currentPage: string,
}

export const useStore = create<StoreState>((set) => ({
  themeMode: 'night',
  logs: [],
  userData: [],
  breaklogMode: true,
  workData: {
    lastLogStatus: '',
    breakTime: '',
    workDone: '',
  },
  loading: false,
  currBreak: null,
  liveBreaks: 0,
  currentPage: '',
}));
