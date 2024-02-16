import { useStore } from '@/stores/store';
import React from 'react';

interface LogsCardProps {
  page?: string;
  isWorkDoneSuccess?: boolean;
}
const LogsCard: React.FC<LogsCardProps> = ({ page, isWorkDoneSuccess }) => {
  const { breaklogMode, logs, workData, userData } = useStore();
  const isClient = typeof window !== 'undefined';

  const openTimeEditModal = (value: any) => {
    useStore.setState(() => ({ logEditStore: value }));
    window.time_edit_modal.showModal();
  };

  return (
    <>
      <div
        className={`card bg-base-100 mt-20 ${page === 'history' ? 'shadow-xl' : 'rounded-b-none'} ${
          isWorkDoneSuccess
            ? 'border-2 border-success'
            : `${page !== 'history' ? '' : 'border-2 border-error'}`
        }`}>
        <div className='card-body p-5 md:p-9'>
          {page === 'history' && (
            <div className='text-left font-semibold mb-2 block'>
              <p
                className={`btn btn-sm btn-outline no-animation cursor-default ${
                  isWorkDoneSuccess ? 'btn-success' : 'btn-error'
                }`}>
                Data from past
              </p>
            </div>
          )}
          <div className='mb-3'>
            <div className='text-left font-semibold card bg-base-100 pb-5'>
              {isClient && userData.username ? (
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                  })}
                  ,{' '}
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                  })}
                </span>
              ) : (
                <span className='animate-pulse'>
                  <span className='flex space-x-4'>
                    <span className='flex-1 space-y-9 py-1'>
                      <span className='space-y-3'>
                        <span className='grid grid-cols-6 gap-3'>
                          <span className='h-2 bg-slate-700 rounded col-span-2'></span>
                          <span className='h-2 bg-slate-700 rounded col-span-1'></span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              )}
            </div>
            <div
              className={`grid ${!breaklogMode || page === 'history' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mt-3 text-center`}>
              {!breaklogMode || page === 'history' ? (
                <div className='card bg-base-200 p-3 shadow-md'>
                  {workData.workDone ? (
                    <>
                      <p className='font-medium'>Work done</p>
                      <p className='font-semibold'>{workData.workDone}</p>
                    </>
                  ) : (
                    <span className='animate-pulse'>
                      <span className='flex space-x-4'>
                        <span className='flex-1 space-y-9 py-1'>
                          <span className='space-y-3'>
                            <span className='grid grid-rows-2 gap-3'>
                              <span className='h-2 bg-slate-700 rounded col-span-3'></span>
                              <span className='h-2 bg-slate-700 rounded col-span-2'></span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  )}
                </div>
              ) : null}
              <div className='card bg-base-200 p-3 shadow-md'>
                {workData.breakTime ? (
                  <>
                    <p className='font-medium'>Break taken</p>
                    <p className='font-semibold'>{workData.breakTime}</p>
                  </>
                ) : (
                  <span className='animate-pulse'>
                    <span className='flex space-x-4'>
                      <span className='flex-1 space-y-9 py-1'>
                        <span className='space-y-3'>
                          <span className='grid grid-rows-2 gap-3'>
                            <span className='h-2 bg-slate-700 rounded col-span-3'></span>
                            <span className='h-2 bg-slate-700 rounded col-span-2'></span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className='collapse collapse-arrow border border-base-300'>
            <input
              type='checkbox'
              className='peer'
            />
            <div className='mr-40 collapse-title font-medium text-left ps-5 peer-checked:hidden'>
              show logs
            </div>
            <div className='mr-40 collapse-title bg-base-300 font-medium text-left ps-5 hidden peer-checked:block'>
              hide logs
            </div>
            {page !== 'history' && (
              <p className='bg-base-300 font-medium text-sm text-center py-0.5 peer-checked:hidden'>
                {logs.length > 0 ? (
                  <>
                    Recent log:{' '}
                    <span className='text-success font-bold'>{workData.lastLogStatus}</span>
                  </>
                ) : (
                  <>
                    <span className='text-error'>No logs available</span>
                  </>
                )}
              </p>
            )}
            <div className='collapse-content px-2'>
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th className='text-center'>
                      <span className={`${page !== 'history' && 'flex items-center'}`}>
                        {page !== 'history' && (
                          <span
                            className='tooltip tooltip-right cursor-pointer'
                            data-tip='Click on any of the time to edit'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='w-6 h-6 me-1 text-warning'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                              />
                            </svg>
                          </span>
                        )}
                        Time
                      </span>
                    </th>
                    <th>Log</th>
                  </tr>
                </thead>
                <tbody className='text-left'>
                  {logs &&
                    [...logs].reverse().map((log, index, array) => {
                      const updatedAt = new Date(log.updatedAt);
                      const utcFormattedDate = updatedAt.toLocaleString('en-US', {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        month: 'short',
                        day: 'numeric',
                      });

                      const logAbove = index > 0 ? array[index - 1] : null;
                      const logBelow = index < array.length - 1 ? array[index + 1] : null;

                      return (
                        <tr key={log.id}>
                          <td className='ps-0'>
                            <button
                              className='btn btn-sm btn-ghost'
                              onClick={() => {
                                if (page !== 'history') {
                                  openTimeEditModal({
                                    log_id: log.id,
                                    log_dateTime: log.updatedAt,
                                    log_dateTime_ahead: logAbove ? logAbove.updatedAt : '',
                                    log_dateTime_behind: logBelow ? logBelow.updatedAt : '',
                                  });
                                }
                              }}>
                              {utcFormattedDate}
                            </button>
                          </td>
                          <td className='text-center'>{log.log_status}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogsCard;
