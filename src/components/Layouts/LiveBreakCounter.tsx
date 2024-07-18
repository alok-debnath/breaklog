import { useStore } from '@/stores/store';
import { useEffect } from 'react';

const LiveBreakCounter = () => {
  const { workData, currBreak, breaks } = useStore();

  // const formatTime = (timeData: {
  //   hours: number;
  //   minutes: number;
  //   seconds: number;
  // }) => {
  //   const { hours, minutes, seconds } = timeData;
  //   return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
  // };

  const calculateTimeData = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  };

  useEffect(() => {
    const calculateBreakTime = () => {
      if (currBreak !== null) {
        const breakTime = new Date(currBreak);
        const currentTime = new Date();
        const diffInSeconds = Math.floor(
          (currentTime.getTime() - breakTime.getTime()) / 1000,
        );

        const [workHours, workMinutes] = workData.breakTime
          .split(':')
          .map(Number);
        const totalBreakSeconds =
          diffInSeconds + workHours * 3600 + workMinutes * 60;

        useStore.setState({
          breaks: {
            liveBreak: calculateTimeData(diffInSeconds),
            totalBreak: calculateTimeData(totalBreakSeconds),
          },
        });
      }
    };

    calculateBreakTime(); // Call it immediately

    const intervalId = setInterval(() => {
      calculateBreakTime();
    }, 1000);

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
            <span className='countdown font-mono'>
              {breaks.liveBreak.hours > 0 && (
                <>
                  <span style={{ '--value': breaks.liveBreak.hours }}></span>h
                </>
              )}
              {breaks.liveBreak.minutes > 0 && (
                <>
                  <span style={{ '--value': breaks.liveBreak.minutes }}></span>m
                </>
              )}
              <span style={{ '--value': breaks.liveBreak.seconds }}></span>s
            </span>
          </div>
          {JSON.stringify(breaks.liveBreak) !==
            JSON.stringify(breaks.totalBreak) && (
            <div className='alert flex justify-center rounded-full bg-primary/20 py-2 shadow-xl backdrop-blur-md'>
              <span className=''>
                <>
                  <span className='font-normal'>{`Total break: `}</span>
                  <span className='countdown font-mono'>
                    {breaks.totalBreak.hours > 0 && (
                      <>
                        <span style={{ '--value': breaks.totalBreak.hours }} />h
                      </>
                    )}
                    {breaks.totalBreak.minutes > 0 && (
                      <>
                        <span
                          style={{ '--value': breaks.totalBreak.minutes }}
                        />
                        m
                      </>
                    )}
                    <span style={{ '--value': breaks.totalBreak.seconds }} />s
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
