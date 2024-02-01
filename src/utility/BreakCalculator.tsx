import { useStore } from '@/stores/store';
import { useEffect } from 'react';

const BreakCalculator = () => {
  const { workData, currBreak } = useStore();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${remainingMinutes}m`;
    }
  };

  useEffect(() => {
    const calculateBreakTime = () => {
      if (currBreak !== null) {
        const breakTime = new Date(currBreak);
        const currentTime = new Date();
        const diffInMilliseconds = currentTime.getTime() - breakTime.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / 60000);

        const workDurationArray = workData.breakTime.split(':');
        const workHours = parseInt(workDurationArray[0]) * 60;
        const workMinutes = parseInt(workDurationArray[1]);
        const totalBreak = (diffInMinutes === -1 ? 0 : diffInMinutes) + workMinutes + workHours;
        useStore.setState(() => ({
          breaks: {
            liveBreak: diffInMinutes === -1 ? 0 : diffInMinutes,
            totalBreak: totalBreak,
            totalBreakFormated: formatTime(totalBreak),
          },
        }));
      }
    };

    calculateBreakTime(); // Call it immediately

    const intervalId = setInterval(() => {
      // useStore.setState((prev) => ({ liveBreaks: prev.liveBreaks + 1 }));
      calculateBreakTime();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currBreak]);

  return(
    <>
    </>
)
};

export default BreakCalculator;
