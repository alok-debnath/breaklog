'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Layouts/Navbar';
import SettingsModal from '@/components/Layouts/SettingsModal';
import NavbarBottom from '@/components/Layouts/NavbarBottom';
import Button from '@/components/UI/Button';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Index = () => {
  const isClient = typeof window !== 'undefined';

  const [userData, setUserData] = useState();
  // store fetched logs from backend
  const [logs, setLogs] = useState([]);
  // store fetched calculated workDone,breakTime,lastLogStatus from backend
  const [workData, setWorkData] = useState([]);
  // for breaklogMode
  const [breaklogMode, setBreaklogMode] = useState(() => {
    if (isClient) {
      const storedBreaklogMode = localStorage.getItem('breaklogMode');
      return storedBreaklogMode ? JSON.parse(storedBreaklogMode) : true;
    }
    return true; // Default value if localStorage is unavailable
  });
  // for setting loader
  const [loading, setLoading] = useState(false);
  // for break time calculation
  const [currBreak, setCurrBreak] = useState();
  const [liveBreaks, setLiveBreaks] = useState(0);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('breaklogMode', JSON.stringify(breaklogMode));
    }
  }, [breaklogMode]);

  const calculateBreakTime = () => {
    const breakTime = new Date(currBreak);
    const currentTime = new Date();
    const diffInMilliseconds = currentTime.getTime() - breakTime.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    setLiveBreaks(diffInMinutes);
  };
  useEffect(() => {
    calculateBreakTime();
    const intervalId = setInterval(() => {
      calculateBreakTime();
    }, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, [currBreak]);

  //  For theme //
  const [themeMode, setThemeMode] = useState('night');

  const logEntry = async (value) => {
    try {
      setLoading(true);

      if (value === 'undo log') {
        const userConfirmed = window.confirm('Are you sure you want to undo the recent log entry?');
        if (!userConfirmed) {
          setLoading(false);
          return;
        }
      }

      const values = {
        logtype: value,
      };

      const res = await axios.post('/api/users/submitlog', values);
      await fetchLogFunction();
      setLoading(false);
    } catch (error) {
      toast.error('Error while log entry: ', error, {
        style: {
          padding: '15px',
          color: 'white',
          backgroundColor: 'rgb(214, 60, 60)',
        },
      });
    }
  };

  const fetchProfileFunction = async () => {
    try {
      const res = await axios.get('/api/users/fetchprofile');
      setUserData(res.data.data);
    } catch (error) {
      toast.error(error.message, {
        style: {
          padding: '15px',
          color: 'white',
          backgroundColor: 'rgb(214, 60, 60)',
        },
      });
    }
  };
  const fetchLogFunction = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        '/api/users/fetchlog'
        // values
      );
      setLoading(false);
      setLogs(res.data.data);
      setWorkData(res.data.workdata);

      if (res.data.workdata.currentBreak !== null) {
        setCurrBreak(res.data.workdata.currentBreak);
      } else {
        setCurrBreak();
        setLiveBreaks();
      }
      if (res.data.workdata.firstLogStatus === 'day start') {
        setBreaklogMode(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message, {
        style: {
          padding: '15px',
          color: 'white',
          backgroundColor: 'rgb(214, 60, 60)',
        },
      });
    }
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem('thememode');

    if (savedTheme) {
      setThemeMode(savedTheme);
    }

    // fetch user details
    fetchProfileFunction();
    fetchLogFunction();
  }, []);

  const themeToggle = (themeName) => {
    setThemeMode(themeName);
    localStorage.setItem('thememode', themeName);
  };

  return (
    <>
      <div data-theme={themeMode}>
        <div>
          <Navbar
            userData={userData}
            breaklogMode={breaklogMode}
          />
        </div>
        <div className='hero min-h-screen bg-base-200'>
          <Toaster
            position='top-left'
            reverseOrder={false}
          />
          <div className='hero-content text-center mb-14'>
            <div className='max-w-md'>
              <div className='overflow-x-auto'>
                <div className='bg-base-100 rounded-2xl rounded-b-none py-2.5 px-7 mt-20'>
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
                        <th>Time</th>
                        <th>Log</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs &&
                        [...logs].reverse().map((log) => {
                          const createdAt = new Date(log.createdAt);
                          const utcFormattedDate = createdAt.toLocaleString('en-US', {
                            timeZone: 'Asia/Kolkata',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            month: 'short',
                            day: 'numeric',
                          });
                          return (
                            <tr key={log.id}>
                              <td>{utcFormattedDate}</td>
                              <td>{log.log_status}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className='mb-20'>
                  <Button
                    text='End Day'
                    className={`btn btn-primary w-full rounded-2xl rounded-t-none ${
                      ['exit', null, 'day end'].includes(workData.lastLogStatus) ||
                      loading ||
                      breaklogMode
                        ? 'btn-disabled'
                        : ''
                    }`}
                    onclick={() => logEntry('day end')}
                  />
                </div>
              </div>
            </div>
          </div>
          {!isNaN(liveBreaks) && liveBreaks !== null && (
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
        <SettingsModal
          logs={logs}
          themeToggle={themeToggle}
          themeMode={themeMode}
          breaklogMode={breaklogMode}
          setBreaklogMode={setBreaklogMode}
        />
        <div>
          <NavbarBottom
            // setShowToast={setShowToast}
            breaklogMode={breaklogMode}
            workData={workData}
            loading={loading}
            logEntry={logEntry}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
