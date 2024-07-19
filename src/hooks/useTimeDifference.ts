import { useState, useEffect } from 'react';

const useTimeDifference = (startTime: Date | string | null): number => {
  const [diffInSeconds, setDiffInSeconds] = useState<number>(0);

  useEffect(() => {
    if (startTime === null) return;

    // converts to date if its type is string
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;

    const calculateDiffInSeconds = () => {
      if (!(start instanceof Date) || isNaN(start.getTime())) {
        console.error("startTime is not a valid Date object");
        return;
      }

      const now = new Date();
      const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
      setDiffInSeconds(diff);
    };

    calculateDiffInSeconds();

    const intervalId = setInterval(calculateDiffInSeconds, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  return diffInSeconds;
};

export default useTimeDifference;