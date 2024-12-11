'use client';
import { useStore } from '@/stores/store';
import React from 'react';

import { LogsData } from '@/stores/store';
import { WorkData } from '@/stores/store';
import useWorkDataUpdater from '@/hooks/useWorkDataUpdater';

interface LogsCardProps {
  page?: string;
  isWorkDoneSuccess?: boolean;
  isIntersecting?: boolean;
  logsServer?: LogsData[];
  workDataServer?: WorkData;
}
const LogsCard: React.FC<LogsCardProps> = ({
  page,
  isWorkDoneSuccess,
  isIntersecting,
  logsServer,
  workDataServer,
}) => {
  let { breaklogMode, logs, workData, userData } = useStore();
  const isClient = typeof window !== 'undefined';

  const openTimeEditModal = (value: any) => {
    useStore.setState(() => ({ logEditStore: value }));
    window.time_edit_modal.showModal();
  };

  const currentLogs = logsServer ?? logs;
  const currentWorkData = workDataServer ?? workData;

  const {
    workDone,
    unformattedWorkDone,
    formattedWorkLeft,
    formattedWorkEndTime,
  } = useWorkDataUpdater(currentWorkData);

  return (
    <>
      <div
        className={`card mt-20 bg-base-100 ${page === 'history' ? 'shadow-xl' : (isIntersecting || ['exit', null, 'day end'].includes(currentWorkData.lastLogStatus)) && 'rounded-b-none'} ${
          page == 'history' &&
          (isWorkDoneSuccess
            ? 'border-2 border-success'
            : 'border-2 border-error')
        }`}
      >
        <div className='card-body p-5 md:p-9'>
          {page === 'history' && (
            <div className='mb-2 block text-left font-semibold'>
              <p
                className={`btn btn-outline no-animation btn-sm cursor-default ${
                  isWorkDoneSuccess ? 'btn-success' : 'btn-error'
                }`}
              >
                Data from past
              </p>
            </div>
          )}
          <div className='mb-3'>
            <div className='card bg-base-100 pb-5 text-left font-semibold'>
              {page === 'history' || (isClient && userData.username) ? (
                <span>
                  {page === 'history' &&
                  currentLogs.length > 0 &&
                  currentLogs[0].log_time ? (
                    <>
                      {new Date(currentLogs[0].log_time).toLocaleDateString(
                        'en-US',
                        {
                          day: 'numeric',
                          month: 'long',
                        },
                      )}
                      ,{' '}
                      {new Date(currentLogs[0].log_time).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'long',
                        },
                      )}
                    </>
                  ) : (
                    <>
                      {new Date().toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                      })}
                      ,{' '}
                      {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                      })}
                    </>
                  )}
                </span>
              ) : (
                <span className='animate-pulse'>
                  <span className='flex space-x-4'>
                    <span className='flex-1 space-y-9 py-1'>
                      <span className='space-y-3'>
                        <span className='grid grid-cols-6 gap-3'>
                          <span className='col-span-2 h-2 rounded bg-slate-700'></span>
                          <span className='col-span-1 h-2 rounded bg-slate-700'></span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              )}
            </div>
            <div
              className={`grid ${!breaklogMode || page === 'history' ? 'grid-cols-2' : 'grid-cols-1'} mt-3 gap-4 text-center`}
            >
              {!breaklogMode || page === 'history' ? (
                <div
                  className={`card bg-base-200 p-3 shadow-md ${
                    page === 'history' && isWorkDoneSuccess
                      ? 'bg-success/10 text-success'
                      : page === 'history' && !isWorkDoneSuccess
                        ? 'bg-error/10 text-error'
                        : isWorkDoneSuccess && userData.username
                          ? 'bg-success/10 text-success'
                          : ''
                  }`}
                >
                  {workDone ? (
                    <>
                      <p className='font-medium'>Work done</p>
                      <p className='font-mono font-semibold'>{workDone}</p>
                    </>
                  ) : (
                    <span className='animate-pulse'>
                      <span className='flex space-x-4'>
                        <span className='flex-1 space-y-9 py-1'>
                          <span className='space-y-3'>
                            <span className='grid grid-rows-2 gap-3'>
                              <span className='col-span-3 h-2 rounded bg-slate-700'></span>
                              <span className='col-span-2 h-2 rounded bg-slate-700'></span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  )}
                </div>
              ) : null}
              <div className='card bg-base-200 p-3 shadow-md'>
                {currentWorkData.breakTime ? (
                  <>
                    <p className='font-medium'>Break taken</p>
                    <p className='font-mono font-semibold'>
                      {currentWorkData.breakTime}
                    </p>
                  </>
                ) : (
                  <span className='animate-pulse'>
                    <span className='flex space-x-4'>
                      <span className='flex-1 space-y-9 py-1'>
                        <span className='space-y-3'>
                          <span className='grid grid-rows-2 gap-3'>
                            <span className='col-span-3 h-2 rounded bg-slate-700'></span>
                            <span className='col-span-2 h-2 rounded bg-slate-700'></span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                )}
              </div>
            </div>
            {!breaklogMode && page !== 'history' && formattedWorkEndTime ? (
              <div className='card mt-3 grid grid-cols-2 items-center bg-base-200 py-2 shadow-md'>
                <p className='text-sm font-medium'>Work until:</p>
                <p className='font-mono text-sm font-semibold'>
                  {new Date(formattedWorkEndTime).toLocaleTimeString('en-US', {
                    hour12: true,
                  })}
                </p>
                <p className='text-sm font-medium'>Work left:</p>
                <p className='font-mono text-sm font-semibold'>
                  {formattedWorkLeft}
                </p>
              </div>
            ) : null}
          </div>
          <div className='collapse collapse-arrow border border-base-300'>
            <input type='checkbox' className='peer' />
            <div className='collapse-title ps-5 text-left font-medium peer-checked:hidden'>
              show logs
            </div>
            <div className='collapse-title hidden bg-base-300 ps-5 text-left font-medium peer-checked:block'>
              hide logs
            </div>
            {page !== 'history' && (
              <p className='bg-base-300 py-0.5 text-center text-sm font-medium peer-checked:hidden'>
                {currentLogs.length > 0 ? (
                  <>
                    Recent log:{' '}
                    <span className='font-bold text-success'>
                      {currentWorkData.lastLogStatus}
                    </span>
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
                      <span
                        className={`${page !== 'history' && 'flex items-center'}`}
                      >
                        {page !== 'history' && (
                          <span
                            className='tooltip tooltip-right cursor-pointer'
                            data-tip='Click on any of the time to edit'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='me-1 h-6 w-6 text-warning'
                            >
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
                    <th>Activity</th>
                  </tr>
                </thead>
                <tbody className='text-left'>
                  {currentLogs &&
                    [...currentLogs].reverse().map((log, index, array) => {
                      const log_time = new Date(log.log_time);
                      const utcFormattedDate = log_time.toLocaleString(
                        'en-US',
                        {
                          timeZone: 'Asia/Kolkata', //setting this to static for now (temporarily)
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          month: 'short',
                          day: 'numeric',
                        },
                      );

                      const logAbove = index > 0 ? array[index - 1] : null;
                      const logBelow =
                        index < array.length - 1 ? array[index + 1] : null;

                      return (
                        <tr key={log.id}>
                          <td className='ps-0'>
                            <button
                              className='btn btn-ghost btn-sm'
                              onClick={() => {
                                if (page !== 'history') {
                                  openTimeEditModal({
                                    log_id: log.id,
                                    log_dateTime: log.log_time,
                                    log_dateTime_ahead: logAbove
                                      ? logAbove.log_time
                                      : '',
                                    log_dateTime_behind: logBelow
                                      ? logBelow.log_time
                                      : '',
                                  });
                                }
                              }}
                            >
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
