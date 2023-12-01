'use client';
import { useEffect, useState } from 'react';
import NavbarBottom from '@/components/Layouts/NavbarBottom';
import Button from '@/components/UI/Button';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { handleError } from '@/components/common/CommonCodeBlocks';
import TimeEditModal from '@/components/Layouts/TimeEditModal';

const Index = () => {
  const { breaklogMode, logs, workData, loading, currBreak, liveBreaks } = useStore();

  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    const calculateBreakTime = () => {
      if (currBreak !== null) {
        const breakTime = new Date(currBreak);
        const currentTime = new Date();
        const diffInMilliseconds = currentTime.getTime() - breakTime.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / 60000);

        useStore.setState(() => ({ liveBreaks: diffInMinutes }));
      }
    };

    calculateBreakTime(); // Call it immediately

    const intervalId = setInterval(() => {
      calculateBreakTime();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currBreak]);

  const logEntry = async (value: string) => {
    try {
      useStore.setState(() => ({ loading: true }));

      if (value === 'undo log') {
        const userConfirmed = window.confirm('Are you sure you want to undo the recent log entry?');
        if (!userConfirmed) {
          useStore.setState(() => ({ loading: false }));
          return;
        }
      }

      const values = {
        logtype: value,
      };

      const res = await axios.post('/api/users/submitlog', values);
      await fetchLogFunction();

      useStore.setState(() => ({ loading: false }));
    } catch (error: any) {
      handleError(error);
    }
  };

  const fetchLogFunction = async () => {
    try {
      useStore.setState(() => ({ loading: true }));
      const values = {};

      const res = await axios.post('/api/users/fetchlog', values);
      useStore.setState(() => ({
        loading: false,
        logs: res.data.data,
        workData: res.data.workdata,
      }));

      if (res.data.workdata.currentBreak !== null) {
        useStore.setState(() => ({ currBreak: res.data.workdata.currentBreak }));
      } else {
        useStore.setState(() => ({
          currBreak: null,
          liveBreaks: 0,
        }));
      }
      if (res.data.workdata.firstLogStatus === 'day start') {
        useStore.setState(() => ({ breaklogMode: false }));
      }
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchLogFunction();
  }, []);

  const [logDateTime, setLogDateTime] = useState<{
    log_id: string;
    log_dateTime: string;
    log_dateTime_ahead: string;
    log_dateTime_behind: string;
  }>({
    log_id: '',
    log_dateTime: '',
    log_dateTime_ahead: '',
    log_dateTime_behind: '',
  });
  const openTimeEditModal = (value: any) => {
    setLogDateTime(value);
    console.log(logDateTime);

    window.time_edit_modal.showModal();
  };
  return (
    <>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <div
              className={`card bg-base-100 rounded-b-none mt-20 ${
                workData.unformattedWorkDone >= 8 * 3600000 ? 'border-2 border-success' : ''
              }`}>
              <div className='card-body'>
                {/* <input
                  className='input input-bordered'
                  type='time'
                /> */}
                <div className='text-left font-semibold mb-3'>
                  <p>
                    {new Date().toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                    })}
                    ,
                  </p>
                  <p>
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                  </p>
                  <p className='font-medium my-2'>
                    {!breaklogMode ? (
                      workData.workDone ? (
                        <>Work done: {workData.workDone} (hh:mm:ss)</>
                      ) : (
                        <span className='animate-pulse'>
                          <span className='flex space-x-4'>
                            <span className='flex-1 space-y-9 py-1'>
                              <span className='space-y-3'>
                                <span className='grid grid-cols-5 gap-3'>
                                  <span className='h-2 bg-slate-700 rounded col-span-3'></span>
                                  <span className='h-2 bg-slate-700 rounded col-span-2'></span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      )
                    ) : null}
                  </p>
                  <p className='font-medium my-2'>
                    {workData.breakTime ? (
                      <>Break taken: {workData.breakTime} (hh:mm:ss)</>
                    ) : (
                      <span className='animate-pulse'>
                        <span className='flex space-x-4'>
                          <span className='flex-1 space-y-9 py-1'>
                            <span className='space-y-3'>
                              <span className='grid grid-cols-5 gap-3'>
                                <span className='h-2 bg-slate-700 rounded col-span-3'></span>
                                <span className='h-2 bg-slate-700 rounded col-span-2'></span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    )}
                  </p>
                </div>
                {loading && <progress className='progress progress-success'></progress>}
                <table className='table text-center'>
                  <thead>
                    <tr>
                      <th>
                        <span className='flex items-center'>
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
                          Time
                        </span>
                      </th>
                      <th>Log</th>
                    </tr>
                  </thead>
                  <tbody className='text-left'>
                    {logs &&
                      [...logs].reverse().map((log, index, array) => {
                        const createdAt = new Date(log.createdAt);
                        const utcFormattedDate = createdAt.toLocaleString('en-US', {
                          timeZone: 'Asia/Kolkata',
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
                            <td>
                              <button
                                className='btn btn-sm btn-ghost'
                                onClick={() =>
                                  openTimeEditModal({
                                    log_id: log.id,
                                    log_dateTime: log.createdAt,
                                    log_dateTime_ahead: logAbove ? logAbove.createdAt : null,
                                    log_dateTime_behind: logBelow ? logBelow.createdAt : null,
                                  })
                                }>
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
            <div className='mb-20'>
              <Button
                text='End Day'
                className={`btn btn-primary w-full rounded-t-none normal-case ${
                  ['exit', null, 'day end'].includes(workData.lastLogStatus) ||
                  loading ||
                  breaklogMode
                    ? 'btn-disabled'
                    : ''
                } ${
                  workData.unformattedWorkDone >= 8 * 3600000
                    ? 'btn-outline btn-success border-2 border-t-0'
                    : ''
                }`}
                onclick={() => logEntry('day end')}
              />
            </div>
          </div>
        </div>
        {currBreak !== null && (
          <div className='toast toast-start mb-14'>
            <div className='flex justify-center alert alert-success shadow-xl backdrop-blur-md bg-secondary/40'>
              <span className='text-black'>{liveBreaks} min</span>
            </div>
          </div>
        )}
        <div className='fixed bottom-5 right-5 items-center justify-end mb-14'>
          <div className='dropdown dropdown-top dropdown-end'>
            <label
              tabIndex={0}
              className='btn bg-primary/40 shadow-xl backdrop-blur-md'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className='dropdown-content menu shadow bg-base-100 rounded-box mb-2'>
              <li>
                <a onClick={() => fetchLogFunction()}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a onClick={() => logEntry('undo log')}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <NavbarBottom logEntry={logEntry} />
      <TimeEditModal logDateTime={logDateTime} fetchLogFunction={fetchLogFunction}/>
    </>
  );
};

export default Index;
