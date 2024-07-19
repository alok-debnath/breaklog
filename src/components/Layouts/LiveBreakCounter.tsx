import { useStore } from '@/stores/store';
import { useEffect } from 'react';
import useTimeDifference from '@/hooks/useTimeDifference';
import { calculateTimeData, TimeData } from '@/hooks/timeUtils';

const LiveBreakCounter = () => {
  const { workData, currBreak, breaks } = useStore();

  const diffInSeconds = useTimeDifference(currBreak);
  useEffect(() => {
    const calculateBreakTime = () => {
      if (currBreak !== null) {
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
  }, [currBreak, diffInSeconds]);

  return (
    <>
      <div className={`${currBreak === null ? 'hidden' : 'block'}`}>
        <div
          className={`toast toast-start mb-20 ${breaks.liveBreak !== breaks.totalBreak && 'grid grid-rows-1 gap-2'}`}
        >
          <div className='alert flex w-min justify-center rounded-full bg-primary/20 py-2 shadow-xl backdrop-blur-md'>
            <span className='countdown font-mono font-semibold'>
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
                  <span className='countdown font-mono font-semibold'>
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
                    {/* <span style={{ '--value': breaks.totalBreak.seconds }} />s */}
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
