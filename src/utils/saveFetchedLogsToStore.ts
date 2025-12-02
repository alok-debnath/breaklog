"use client";
import type { LogsData, WorkData } from "@/stores/store";
import { useStore } from "@/stores/store";

export interface FetchedLogsDataType {
  message: string;
  status: number;
  data: { id: string; log_time: number; log_status: string }[];
  workdata: WorkData & { currentBreak: null | number };
}

export const saveFetchedLogsToStore = (data: FetchedLogsDataType) => {
  const convertedLogs: LogsData[] = data.data.map((log) => ({
    ...log,
    log_time: new Date(log.log_time),
  }));
  useStore.setState(() => ({
    loading: false,
    logs: convertedLogs,
    workData: data.workdata,
  }));

  if (data.workdata.currentBreak !== null) {
    useStore.setState(() => ({
      currBreak: data.workdata.currentBreak,
    }));
  } else {
    useStore.setState(() => ({
      currBreak: null,
      liveBreaks: 0,
    }));
  }
  if (data.workdata.firstLogStatus === "day start") {
    useStore.setState(() => ({ breaklogMode: false }));
  }
};
