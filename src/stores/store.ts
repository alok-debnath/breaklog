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
  daily_work_required: number;
  log_type: string;
}
interface MonthLogData {
  date: string;
  breakTime: number;
  workDone: number;
  formattedBreakTime: string;
  formattedWorkDone: string;
}
interface LogEditData {
  log_id: string;
  log_dateTime: string;
  log_dateTime_ahead: string;
  log_dateTime_behind: string;
}
interface DialogModalData {
  modal_body: string;
  modal_head: string;
  modal_confirm_btn: string;
  modal_cancel_btn: string;
}
interface BreakData {
  liveBreak: number;
  totalBreak: number;
  totalBreakFormated: string;
}

interface StoreState {
  themeMode: string;
  logs: any[];
  monthLogs: MonthLogData[];
  userData: userData;
  summary: summary;
  breaklogMode: boolean;
  workData: WorkData;
  loading: boolean;
  currBreak: null | Date; // Change 'null' to 'null | Date' for date type
  breaks: BreakData;
  logEditStore: LogEditData;
  dialogModal: DialogModalData;
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
    daily_work_required: 0,
    log_type: '',
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
  breaks: {
    liveBreak: 0,
    totalBreak: 0,
    totalBreakFormated: '',
  },
  logEditStore: {
    log_id: '',
    log_dateTime: '',
    log_dateTime_ahead: '',
    log_dateTime_behind: '',
  },
  dialogModal: {
    modal_body: '',
    modal_head: '',
    modal_confirm_btn: '',
    modal_cancel_btn: '',
  },
}));
