import { create } from "zustand";

export interface WorkData {
  firstLogStatus: string | null;
  lastLogStatus: string;
  breakTime: string;
  workDone: string;
  unformattedWorkDone: number;
  formattedWorkEndTime: string;
  formattedWorkLeft: string;
  calculatedOn: number;
  isHalfDay: boolean;
}
interface summary {
  totalWorkDone: number;
  formattedTotalBreakTime: string;
  formattedTotalWorkDone: string;
  numberOfDays: string;
  expectedWorkHours: number;
  halfDayCount: number;
  // actualWorkHours: string;
}
export interface UserData {
  username: string;
  daily_work_required: number;
  log_type: string;
  default_time_zone: string;
}
interface MonthLogData {
  date: string;
  breakTime: number;
  workDone: number;
  formattedBreakTime: string;
  formattedWorkDone: string;
  isHalfDay: boolean;
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
interface TimeData {
  hours: number;
  minutes: number;
  seconds: number;
}

interface BreakData {
  liveBreak: TimeData;
  totalBreak: TimeData;
}

export interface LogsData {
  id: string;
  log_time: string;
  log_status: string;
}

interface StoreState {
  themeMode: string;
  logs: LogsData[];
  monthLogs: MonthLogData[];
  userData: UserData;
  summary: summary;
  breaklogMode: boolean;
  workData: WorkData;
  loading: boolean;
  currBreak: null | Date; // Change 'null' to 'null | Date' for date type
  breaks: BreakData;
  logEditStore: LogEditData;
  dialogModal: DialogModalData;
  initialPageLoadDone: boolean;
  isConfirmationDialogOpen: boolean;
  isSettingsModalOpen: boolean;
  isTimeEditModalOpen: boolean;
  isTimeZoneModalOpen: boolean;
}

export const useStore = create<StoreState>((set) => ({
  themeMode: "",
  logs: [],
  monthLogs: [
    {
      date: "",
      breakTime: 0,
      workDone: 0,
      formattedBreakTime: "",
      formattedWorkDone: "",
      isHalfDay: false,
    },
  ],
  userData: {
    username: "",
    daily_work_required: 0,
    log_type: "",
    default_time_zone: "",
  },
  summary: {
    totalWorkDone: 0,
    formattedTotalBreakTime: "",
    formattedTotalWorkDone: "",
    numberOfDays: "",
    expectedWorkHours: 0,
    halfDayCount: 0,
    // actualWorkHours: "",
  },
  breaklogMode: true,
  workData: {
    firstLogStatus: "",
    lastLogStatus: "",
    breakTime: "",
    workDone: "",
    unformattedWorkDone: 0,
    formattedWorkEndTime: "",
    formattedWorkLeft: "",
    calculatedOn: 0,
    isHalfDay: false,
  },
  loading: false,
  currBreak: null,
  breaks: {
    liveBreak: { hours: 0, minutes: 0, seconds: 0 },
    totalBreak: { hours: 0, minutes: 0, seconds: 0 },
  },
  logEditStore: {
    log_id: "",
    log_dateTime: "",
    log_dateTime_ahead: "",
    log_dateTime_behind: "",
  },
  dialogModal: {
    modal_body: "",
    modal_head: "",
    modal_confirm_btn: "",
    modal_cancel_btn: "",
  },
  initialPageLoadDone: false,
  isConfirmationDialogOpen: false,
  isSettingsModalOpen: false,
  isTimeEditModalOpen: false,
  isTimeZoneModalOpen: false,
}));
