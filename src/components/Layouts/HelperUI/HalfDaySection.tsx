import { useState } from 'react';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useStore } from '@/stores/store';
import { saveFetchedLogsToStore } from '@/utils/saveFetchedLogsToStore';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';

interface HalfDaySectionProps {
  isHalfDay: boolean;
}

const HalfDaySection: React.FC<HalfDaySectionProps> = ({ isHalfDay }) => {
  const isClient = typeof window !== 'undefined';
  const router = useRouter();
  const { initialPageLoadDone, loading } = useStore();
  const pathname = usePathname();

  const [isHalfDayState, setIsHalfDayState] = useState(null);

  const simpleLogEntry = async (value: string) => {
    if (!isClient || !initialPageLoadDone) return;
    try {

      const date = pathname?.split('/').pop();
      const values = {
        logtype: value,
        date: date,
      };

      useStore.setState(() => ({ loading: true }));
      const res = await axios.post('/api/users/submitlog/submitHalfday', values);
      setIsHalfDayState(res.data.fetchedLog.workdata.isHalfDay);
      useStore.setState(() => ({ loading: false }));
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  return (
    <>
      <div
        className={`card-body ${(isHalfDayState ? isHalfDayState : isHalfDay) !== true ? 'bg-success/30' : 'bg-warning/30'} animate-zoom-in rounded-t-xl px-5 py-3 text-amber-50`}
      >
        <div className='flex items-center justify-between gap-3'>
          <div className='label-text text-start text-wrap text-amber-50'>
            {(isHalfDayState ? isHalfDayState : isHalfDay) !== true ? (
              <p>Should this log be marked as a half day?</p>
            ) : (
              <p>This log has been marked as half day</p>
            )}
          </div>
          {(isHalfDayState ? isHalfDayState : isHalfDay) !== true ? (
            <button
              className={`btn btn-sm btn-success px-6 ${
                loading ? 'btn-disabled' : ''
              }`}
              onClick={() => simpleLogEntry('mark-as-half-day')}
            >
              Yes
            </button>
          ) : (
            <button
              className={`btn btn-sm btn-success px-6 ${
                loading ? 'btn-disabled' : ''
              }`}
              onClick={() => simpleLogEntry('undo-half-day')}
            >
              Undo
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes zoom-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoom-in {
          animation: zoom-in 0.3s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default HalfDaySection;
