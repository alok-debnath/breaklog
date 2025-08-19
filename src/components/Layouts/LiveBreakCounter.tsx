'use client';
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

  const formatTime = (time: TimeData, showSeconds: boolean = true) => {
    const parts = [];
    if (time.hours > 0) {
      parts.push(`${time.hours}h`);
    }
    if (time.minutes > 0) {
      parts.push(`${time.minutes}m`);
    }
    if (showSeconds) {
      parts.push(`${time.seconds}s`);
    }
    return parts.join(' ');
  };

  return (
    <div
      className={`fixed bottom-24 left-4 z-50 ${currBreak === null ? 'hidden' : 'grid'} gap-2`}
    >
      <div className='bg-primary/20 text-primary-foreground flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-md'>
        <span className='font-mono'>{formatTime(liveBreak.value)}</span>
      </div>
      {JSON.stringify(liveBreak.value) !== JSON.stringify(totalBreak.value) && (
        <div className='bg-primary/20 text-primary-foreground flex items-center justify-center rounded-full px-4 py-2 text-sm shadow-lg backdrop-blur-md'>
          <span>
            <span className='font-normal'>{`Total break: `}</span>
            <span className='font-mono font-semibold'>
              {formatTime(totalBreak.value, false)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default LiveBreakCounter;
