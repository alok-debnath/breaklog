import { useStore } from '@/stores/store';
import { useEffect } from 'react';
import useTimeDifference from '@/hooks/useTimeDifference';
import { calculateTimeData, TimeData } from '@/hooks/timeUtils';
import { useSignal } from '@preact/signals-react';

const LiveBreakCounter = () => {
  const { workData, currBreak } = useStore();
  const liveBreak = useSignal<TimeData>({ hours: 0, minutes: 0, seconds: 0 });
  const totalBreak = useSignal<TimeData>({ hours: 0, minutes: 0, seconds: 0 });

  const diffInSeconds = useTimeDifference(currBreak);

  useEffect(() => {
    if (!currBreak) return;

    const updateBreakTime = () => {
      const [workHours, workMinutes] = workData.breakTime
        .split(':')
        .map(Number);
      const totalBreakSeconds =
        diffInSeconds + workHours * 3600 + workMinutes * 60;

      liveBreak.value = calculateTimeData(diffInSeconds);
      totalBreak.value = calculateTimeData(totalBreakSeconds);
    };

    updateBreakTime();
    const interval = setInterval(updateBreakTime, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currBreak, diffInSeconds, workData.breakTime]);

  return (
    <>
      <div className={`${currBreak === null ? 'hidden' : 'block'}`}>
        <div
          className={`toast toast-start mb-20 ${liveBreak.value !== totalBreak.value && 'grid grid-rows-1 gap-2'}`}
        >
          <div className='alert bg-primary/20 flex w-min justify-center rounded-full py-2 shadow-xl backdrop-blur-md'>
            <span className='countdown font-mono font-semibold'>
              {liveBreak.value.hours > 0 && (
                <>
                  <span style={{ '--value': liveBreak.value.hours }}></span>h
                </>
              )}
              {liveBreak.value.minutes > 0 && (
                <>
                  <span style={{ '--value': liveBreak.value.minutes }}></span>m
                </>
              )}
              <span style={{ '--value': liveBreak.value.seconds }}></span>s
            </span>
          </div>
          {JSON.stringify(liveBreak.value) !==
            JSON.stringify(totalBreak.value) && (
            <div className='alert bg-primary/20 flex justify-center rounded-full py-2 shadow-xl backdrop-blur-md'>
              <span className=''>
                <>
                  <span className='font-normal'>{`Total break: `}</span>
                  <span className='countdown font-mono font-semibold'>
                    {totalBreak.value.hours > 0 && (
                      <>
                        <span style={{ '--value': totalBreak.value.hours }} />h
                      </>
                    )}
                    {totalBreak.value.minutes > 0 && (
                      <>
                        <span style={{ '--value': totalBreak.value.minutes }} />
                        m
                      </>
                    )}
                    {/* <span style={{ '--value': totalBreak.value.seconds }} />s */}
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
