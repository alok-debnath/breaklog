import { useStore } from '@/stores/store';
import { useEffect } from 'react';

const LiveBreakCounter = () => {
  const { workData, currBreak, breaks } = useStore();

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
        const totalBreak =
          (diffInMinutes === -1 ? 0 : diffInMinutes) + workMinutes + workHours;
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

  return (
    <>
      <div className={`${currBreak === null ? 'hidden' : 'block'}`}>
        <div
          className={`toast toast-start mb-20 ${breaks.liveBreak !== breaks.totalBreak && 'grid grid-rows-1 gap-2'}`}
        >
          <div className='alert flex w-min justify-center rounded-full bg-primary/20 py-2 shadow-xl backdrop-blur-md'>
            <span className='font-semibold'>{`${breaks.liveBreak} min `}</span>
          </div>
          {breaks.liveBreak !== breaks.totalBreak && (
            <div className='alert flex justify-center rounded-full bg-primary/20 py-2 shadow-xl backdrop-blur-md'>
              <span className=''>
                <>
                  <span className='font-normal'>{`Total break: `}</span>
                  <span className='font-semibold'>
                    {breaks.totalBreakFormated}
                  </span>
                </>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveBreakCounter;
