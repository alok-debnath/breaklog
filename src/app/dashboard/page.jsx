'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Layouts/Navbar';
// import MyModal from '@/components/Layouts/MyModal';
import SettingsModal from '@/components/Layouts/SettingsModal';
import NavbarBottom from '@/components/Layouts/NavbarBottom';
import Button from '@/components/UI/Button';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Index = () => {
    const [userData, setUserData] = useState();
    const [logs, setLogs] = useState([]);
    const [workData, setWorkData] = useState([]);
    const [breaklogMode, setBreaklogMode] = useState();
    const [loading, setLoading] = useState(false);

    const [currBreak, setCurrBreak] = useState();
    const [liveBreaks, setLiveBreaks] = useState(0);
    const calculateBreakTime = () => {
        const breakTime = new Date(currBreak);
        const currentTime = new Date();
        const diffInMilliseconds = currentTime.getTime() - breakTime.getTime();
        const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
        setLiveBreaks(diffInMinutes);
        // console.log(currBreak);
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
            // setLoadingDashboard(true);
            const values = {
                logtype: value,
            };

            const res = await axios.post('/api/users/userlogenter', values);
            await fetchUserLog();
            setLoading(false);
            // setLoadingDashboard(false);
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

    const fetchUserData = async () => {
        try {
            const res = await axios.get('/api/users/me');
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
    const fetchUserLog = async () => {
        try {
            setLoading(true);

            const res = await axios.post(
                '/api/users/userlog'
                // values
            );
            setLoading(false);
            setLogs(res.data.data);
            setWorkData(res.data.workdata);
            if (res.data.workdata.currentbreak !== null) {
                setCurrBreak(res.data.workdata.currentbreak);
                console.log(liveBreaks);
            } else {
                setCurrBreak();
                setLiveBreaks();
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
        fetchUserData();
        fetchUserLog();
    }, []);

    const themeToggle = (themeName) => {
        setThemeMode(themeName);
        localStorage.setItem('thememode', themeName);
    };
    // END //

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
                                            {workData.workdone ? (
                                                <>Work done: {workData.workdone} (hh:mm:ss)</>
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
                                    {loading && (
                                        <progress className='progress progress-success'></progress>
                                    )}
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
                                                    const utcFormattedDate =
                                                        createdAt.toLocaleString('en-US', {
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
                                            ['exit', null, 'day end'].includes(
                                                workData.lastlogstatus
                                            ) || loading
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
                                <span className='text-black'>~ {liveBreaks}</span>
                            </div>
                        </div>
                    )}
                    <div className='fixed bottom-5 right-5 items-center justify-end mb-14'>
                        <button
                            class='btn bg-primary/40 shadow-xl backdrop-blur-md'
                            onClick={() => fetchUserLog()}>
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
                        </button>
                        {/* <div className={`dropdown dropdown-top`}>
                            <details>
                                <summary className=''>
                                    more
                                </summary>
                                <ul className="dropdown-content menu rounded-box">
                                    <li>
                                        <a>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </div> */}
                    </div>
                </div>
                <SettingsModal
                    themeToggle={themeToggle}
                    themeMode={themeMode}
                    setBreaklogMode={setBreaklogMode}
                />
                <div>
                    <NavbarBottom
                        // setShowToast={setShowToast}
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
