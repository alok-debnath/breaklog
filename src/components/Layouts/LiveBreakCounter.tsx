"use client";
import { useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { calculateTimeData, type TimeData } from "@/hooks/timeUtils";
import useTimeDifference from "@/hooks/useTimeDifference";
import { useStore } from "@/stores/store";

const LiveBreakCounter = () => {
  const { workData, currBreak } = useStore();
  const liveBreak = useSignal<TimeData>({ hours: 0, minutes: 0, seconds: 0 });
  const totalBreak = useSignal<TimeData>({ hours: 0, minutes: 0, seconds: 0 });

  const diffInSeconds = useTimeDifference(currBreak);

  useEffect(() => {
    if (!currBreak) return;

    const updateBreakTime = () => {
      const [workHours, workMinutes] = workData.breakTime
        .split(":")
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

  const formatTime = (time: TimeData, showSeconds = true) => {
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
    return parts.join(" ");
  };

  return (
    <div
      className={`fixed bottom-28 left-4 z-50 ${currBreak === null ? "hidden" : "flex"} flex-col gap-3`}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/90 to-red-500/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/20" />

        <div className="relative flex items-center gap-3">
          <div>
            <p className="font-mono text-sm font-bold text-white">
              {formatTime(liveBreak.value)}
            </p>
          </div>
        </div>
      </div>

      {JSON.stringify(liveBreak.value) !== JSON.stringify(totalBreak.value) && (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/90 to-purple-500/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-white/20" />

          <div className="relative flex items-center gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-white/80 uppercase">
                Total Break
              </p>
              <p className="font-mono text-sm font-bold text-white">
                {formatTime(totalBreak.value, false)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveBreakCounter;
