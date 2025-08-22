"use client";
import type { LogsData, WorkData } from "@/stores/store";
import { useStore } from "@/stores/store";

export interface FetchedLogsDataType {
  message: string;
  status: number;
  data: LogsData[];
  workdata: WorkData & { currentBreak: null | Date };
}

export const saveFetchedLogsToStore = (data: FetchedLogsDataType) => {
  useStore.setState(() => ({
    loading: false,
    logs: data.data,
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
