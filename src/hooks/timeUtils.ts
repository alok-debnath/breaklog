export interface TimeData {
  hours: number;
  minutes: number;
  seconds: number;
}

export const calculateTimeData = (totalSeconds: number): TimeData => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};
