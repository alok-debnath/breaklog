import { useStore } from '@/stores/store';
import LiveBreakCounter from '@/components/Layouts/LiveBreakCounter';
import Button from '../UI/Button';
import { BriefcaseBusiness, Coffee, LogIn, LogOut, Plus } from 'lucide-react';

interface BottomNavbarProps {
  logEntry: (value: string) => void; // logEntry is a function that accepts a string
  isIntersecting: boolean;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  logEntry,
  isIntersecting,
}) => {
  const { breaklogMode, workData, loading } = useStore();

  const btnState = ['day end'].includes(workData.lastLogStatus) || loading;
  return (
    <>
      <LiveBreakCounter />
      <div className='fixed bottom-0 left-1/2 z-30 h-20 w-full -translate-x-1/2 bg-gradient-to-b from-transparent to-base-200'></div>
      <div className='fixed bottom-3 left-1/2 z-50 h-16 w-full max-w-lg -translate-x-1/2'>
        <div className='mx-3 rounded-full bg-base-100'>
          <div
            className={`mx-auto grid h-full max-w-lg items-center justify-center space-x-2 p-2 ${isIntersecting || ['exit', null, 'day end'].includes(workData.lastLogStatus) ? 'grid-cols-3' : 'grid-cols-5'}`}
          >
            <div className='dropdown dropdown-top m-0 inline-flex w-full items-center p-0'>
              <label
                tabIndex={0}
                className='group btn inline-flex flex-1 flex-col items-center justify-center rounded-full px-5'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className='menu dropdown-content mb-2 rounded-box bg-base-100 shadow'
              >
                {/* <li>
                  <span
                    className='items-center justify-center'
                    onClick={() => fetchLogFunction()}
                  >
                    <p>Refresh</p>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
                      />
                    </svg>
                  </span>
                </li> */}
                <li>
                  <span
                    className='items-center justify-center'
                    onClick={() => logEntry('undo log')}
                  >
                    <p>Undo</p>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='h-6 w-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
                      />
                    </svg>
                  </span>
                </li>
              </ul>
            </div>
            {!['exit', null, 'day end'].includes(workData.lastLogStatus) && (
              <div
                className={`${!isIntersecting ? '' : 'hidden'} col-span-2 flex items-center justify-center`}
              >
                <Button
                  text='End Day'
                  className={`btn w-full rounded-full bg-error/20 font-semibold text-error ${
                    ['exit', null, 'day end'].includes(
                      workData.lastLogStatus,
                    ) ||
                    loading ||
                    breaklogMode
                      ? 'btn-disabled'
                      : ''
                  }`}
                  onclick={() => logEntry('day end')}
                />
              </div>
            )}
            <div className='col-span-2 flex items-center justify-center'>
              <button
                onClick={() =>
                  breaklogMode ? logEntry('break log') : logEntry('day log')
                }
                className={`btn ${btnState ? 'btn-disabled' : ''} group inline-flex w-full items-center justify-center rounded-full bg-success/20 font-medium text-success`}
              >
                <p className='font-semibold'>
                  {workData.lastLogStatus === null && !breaklogMode
                    ? 'Start Day'
                    : workData.lastLogStatus === null && breaklogMode
                      ? 'Take Break'
                      : workData.lastLogStatus === 'day start'
                        ? 'Take Break'
                        : workData.lastLogStatus === 'exit'
                          ? 'End Break'
                          : workData.lastLogStatus === 'enter'
                            ? 'Take Break'
                            : 'Add Log'}
                </p>
                {!loading &&
                  (workData.lastLogStatus === null && !breaklogMode ? (
                    <BriefcaseBusiness className='h-4 w-4' />
                  ) : workData.lastLogStatus === null && breaklogMode ? (
                    <Coffee className='h-4 w-4' />
                  ) : workData.lastLogStatus === 'day start' ? (
                    <Coffee className='h-4 w-4' />
                  ) : workData.lastLogStatus === 'exit' ? (
                    <LogIn className='h-4 w-4' />
                  ) : workData.lastLogStatus === 'enter' ? (
                    <Coffee className='h-4 w-4' />
                  ) : (
                    <Plus className='h-4 w-4' />
                  ))}
                {loading && (
                  <span className='loading loading-ring loading-sm'></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
