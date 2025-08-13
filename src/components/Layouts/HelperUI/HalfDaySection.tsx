import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useStore } from '@/stores/store';
import { saveFetchedLogsToStore } from '@/utils/saveFetchedLogsToStore';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

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
        className={cn(
          "animate-zoom-in rounded-t-xl px-5 py-3 text-primary-foreground",
          (isHalfDayState ? isHalfDayState : isHalfDay) !== true ? 'bg-primary/30' : 'bg-yellow-500/30'
        )}
      >
        <div className='flex items-center justify-between gap-3'>
          <div className='text-start text-wrap'>
            {(isHalfDayState ? isHalfDayState : isHalfDay) !== true ? (
              <p>Should this log be marked as a half day?</p>
            ) : (
              <p>This log has been marked as half day</p>
            )}
          </div>
          {(isHalfDayState ? isHalfDayState : isHalfDay) !== true ? (
            <Button
              size="sm"
              variant="success"
              onClick={() => simpleLogEntry('mark-as-half-day')}
              disabled={loading}
            >
              Yes
            </Button>
          ) : (
            <Button
              size="sm"
              variant="success"
              onClick={() => simpleLogEntry('undo-half-day')}
              disabled={loading}
            >
              Undo
            </Button>
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
