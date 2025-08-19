import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useStore } from '@/stores/store';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HalfDaySectionProps {
  isHalfDay: boolean;
  defaultTimeZone: string;
}

const getCurrentDateInTimezone = (timezone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const parts = formatter.formatToParts(new Date());

  // Extract day, month, and year from the formatted parts
  const day = parts.find((part) => part.type === 'day')?.value || '';
  const month = parts.find((part) => part.type === 'month')?.value || '';
  const year = parts.find((part) => part.type === 'year')?.value || '';

  return `${day}-${month}-${year}`;
};

const HalfDaySection: React.FC<HalfDaySectionProps> = ({
  isHalfDay,
  defaultTimeZone,
}) => {
  const isClient = typeof window !== 'undefined';
  const router = useRouter();
  const { initialPageLoadDone, loading } = useStore();
  const pathname = usePathname();

  const [isHalfDayState, setIsHalfDayState] = useState(null);

  const simpleLogEntry = async (value: string) => {
    if (!isClient || !initialPageLoadDone) return;
    try {
      let date = pathname?.split('/').pop();
      if (date === 'dashboard') {
        date = getCurrentDateInTimezone(defaultTimeZone);
      }

      const values = {
        logtype: value,
        date: date,
      };

      useStore.setState(() => ({ loading: true }));
      const res = await axios.post(
        '/api/users/submitlog/submitHalfday',
        values,
      );
      setIsHalfDayState(res.data.fetchedLog.workdata.isHalfDay);
      useStore.setState(() => ({ loading: false }));
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  const isHalfDayActive = isHalfDayState !== null ? isHalfDayState : isHalfDay;

  return (
    <>
      <div
        className={cn(
          'animate-zoom-in -pt-6 -mt-6 rounded-t-xl border px-5 py-4 shadow-sm',
          isHalfDayActive
            ? 'bg-green-100 dark:bg-green-950'
            : 'bg-amber-100 dark:bg-amber-950',
        )}
      >
        <div className='flex items-center justify-between gap-3'>
          <div className='text-start text-wrap'>
            <p className='text-sm font-medium'>
              {!isHalfDayActive
                ? 'Should this log be marked as a half day?'
                : 'This log has been marked as half day'}
            </p>
          </div>
          {!isHalfDayActive ? (
            <Button
              size='sm'
              variant={isHalfDayActive ? 'outline' : 'default'}
              onClick={() => simpleLogEntry('mark-as-half-day')}
              disabled={loading}
              className='font-medium'
            >
              Yes
            </Button>
          ) : (
            <Button
              size='sm'
              variant='outline'
              onClick={() => simpleLogEntry('undo-half-day')}
              disabled={loading}
              className={cn('font-medium')}
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
