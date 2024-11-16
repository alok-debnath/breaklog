'use client';
import { useStore } from '@/stores/store';

type LogEntryType = {
  id: string;
  updatedAt: string;
  log_status: string;
};

export interface FetchedLogsDataType {
  message: string;
  status: number;
  data: LogEntryType[];
  workdata: {
    breakTime: string;
    workDone: string;
    unformattedWorkDone: number;
    currentBreak: null | Date;
    firstLogStatus: string | null;
    lastLogStatus: string;
    formattedWorkEndTime: string;
    formattedWorkLeft: string;
  };
}

export const saveFetchedLogsToStore = (data: FetchedLogsDataType) => {
  useStore.setState(() => ({
    loading: false,
    logs: data.data,
    workData: data.workdata,
  }));

  if (data.workdata?.currentBreak !== null) {
    useStore.setState(() => ({
      currBreak: data.workdata.currentBreak,
    }));
  } else {
    useStore.setState(() => ({
      currBreak: null,
      liveBreaks: 0,
    }));
  }
  if (data.workdata.firstLogStatus === 'day start') {
    useStore.setState(() => ({ breaklogMode: false }));
  }
};
