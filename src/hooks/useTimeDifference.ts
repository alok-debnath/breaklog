import { useEffect, useState } from "react";

const useTimeDifference = (
  startTime: Date | string | number | null,
): number => {
  const [diffInSeconds, setDiffInSeconds] = useState<number>(0);

  useEffect(() => {
    if (startTime === null) return;

    // converts to date if its type is string or number (timestamp)
    const start =
      typeof startTime === "string"
        ? new Date(startTime)
        : typeof startTime === "number"
          ? new Date(startTime)
          : startTime;

    const calculateDiffInSeconds = () => {
      if (!(start instanceof Date) || Number.isNaN(start.getTime())) {
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
