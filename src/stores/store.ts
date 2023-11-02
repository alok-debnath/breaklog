import { create } from 'zustand';

interface WorkData {
  lastLogStatus: string;
  breakTime: string;
  workDone: string;
}
interface summary {
  totalWorkDone: number;
  formattedTotalBreakTime: string;
  formattedTotalWorkDone: string;
  numberOfDays: string;
  expectedWorkHours: number;
  // actualWorkHours: string;
}
interface userData {
  username: string;
}
interface StoreState {
  themeMode: string;
  logs: any[];
  monthLogs: any[];
  userData: userData;
  summary: summary;
  breaklogMode: boolean;
  workData: WorkData; // Replace 'any' with the actual type of workData
  loading: boolean;
  currBreak: null | Date; // Change 'null' to 'null | Date' for date type
  liveBreaks: number;
}

export const useStore = create<StoreState>((set) => ({
  themeMode: 'night',
  logs: [],
  monthLogs: [],
  userData: {
    username: '',
  },
  summary: {
    totalWorkDone: 0,
    formattedTotalBreakTime: '',
    formattedTotalWorkDone: '',
    numberOfDays: '',
    expectedWorkHours: 0,
    // actualWorkHours: "",
  },
  breaklogMode: true,
  workData: {
    lastLogStatus: '',
    breakTime: '',
    workDone: '',
  },
  loading: false,
  currBreak: null,
  liveBreaks: 0,
}));
