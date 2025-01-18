import { useState, useEffect, useCallback } from 'react';
import { WorkData } from '../stores/store';

interface UpdatedWorkData {
  workDone: string;
  unformattedWorkDone: number;
  formattedWorkLeft: string;
  formattedWorkEndTime: string;
}

const calculateTimeData = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
};

const calculateUpdatedWorkData = (workData: WorkData): UpdatedWorkData => {
  const now = Date.now(); // Current time in milliseconds
  const timeDifferenceInSeconds =
    Math.floor((now - workData.calculatedOn) / 1000) + 1; // +1 sec for potential margin of error

  let updatedUnformattedWorkDone = workData.unformattedWorkDone;
  let updatedWorkDone = workData.workDone;
  let updatedFormattedWorkLeft = workData.formattedWorkLeft;
  let updatedFormattedWorkEndTime = workData.formattedWorkEndTime;

  if (
    workData.lastLogStatus === 'day start' ||
    workData.lastLogStatus === 'enter'
  ) {
    const totalWorkDoneSeconds =
      Math.floor(updatedUnformattedWorkDone / 1000) + timeDifferenceInSeconds;
    updatedUnformattedWorkDone += timeDifferenceInSeconds * 1000;
    updatedWorkDone = calculateTimeData(totalWorkDoneSeconds);

    const [leftHours, leftMinutes, leftSeconds] = workData.formattedWorkLeft
      .split(':')
      .map(Number);
    const totalLeftSeconds =
      leftHours * 3600 +
      leftMinutes * 60 +
      leftSeconds -
      timeDifferenceInSeconds;
    updatedFormattedWorkLeft = calculateTimeData(Math.max(totalLeftSeconds, 0));
  } else if (
    workData.lastLogStatus === 'exit' &&
    workData.formattedWorkEndTime
  ) {
    const endTimeDate = new Date(workData.formattedWorkEndTime);
    endTimeDate.setSeconds(endTimeDate.getSeconds() + timeDifferenceInSeconds);
    updatedFormattedWorkEndTime = endTimeDate.toISOString();
  }

  return {
    workDone: updatedWorkDone,
    unformattedWorkDone: updatedUnformattedWorkDone,
    formattedWorkLeft: updatedFormattedWorkLeft,
    formattedWorkEndTime: updatedFormattedWorkEndTime,
  };
};

const useWorkDataUpdater = (workData: WorkData): UpdatedWorkData => {
  const [updatedWorkData, setUpdatedWorkData] = useState<UpdatedWorkData>(() =>
    calculateUpdatedWorkData(workData),
  );

  const updateWorkData = useCallback(() => {
    const newWorkData = calculateUpdatedWorkData(workData);

    // 🚀 Don't call setUpdatedWorkData unless data actually changes
    setUpdatedWorkData((prevData) => {
      if (
        prevData.workDone === newWorkData.workDone &&
        prevData.unformattedWorkDone === newWorkData.unformattedWorkDone &&
        prevData.formattedWorkLeft === newWorkData.formattedWorkLeft &&
        prevData.formattedWorkEndTime === newWorkData.formattedWorkEndTime
      ) {
        return prevData; // No change
      }
      return newWorkData; // Update only if data changed
    });
  }, [workData]);

  useEffect(() => {
    updateWorkData(); // Call it immediately

    const intervalId = setInterval(() => {
      updateWorkData();
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [updateWorkData]);

  return updatedWorkData;
};

export default useWorkDataUpdater;
