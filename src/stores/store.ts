import { create } from 'zustand';

interface WorkData {
  lastLogStatus: string;
  breakTime: string;
  workDone: string;
  unformattedWorkDone: number;
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
  dailyWorkRequired: number;
}
interface MonthLogData {
  date: string;
  breakTime: number;
  workDone: number;
  formattedBreakTime: string;
  formattedWorkDone: string;
}
interface StoreState {
  themeMode: string;
  logs: any[];
  monthLogs: MonthLogData[];
  userData: userData;
  summary: summary;
  breaklogMode: boolean;
  workData: WorkData; // Replace 'any' with the actual type of workData
  loading: boolean;
  currBreak: null | Date; // Change 'null' to 'null | Date' for date type
  liveBreaks: number;
}

export const useStore = create<StoreState>((set) => ({
  themeMode: 'light',
  logs: [],
  monthLogs: [
    {
      date: '',
      breakTime: 0,
      workDone: 0,
      formattedBreakTime: '',
      formattedWorkDone: '',
    },
  ],
  userData: {
    username: '',
    dailyWorkRequired: 0,
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
    unformattedWorkDone: 0,
  },
  loading: false,
  currBreak: null,
  liveBreaks: 0,
}));
