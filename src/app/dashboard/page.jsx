"use client"
import { useEffect, useState } from 'react';
import Navbar from '@/components/Layouts/Navbar'
// import MyModal from '@/components/Layouts/MyModal';
import SettingsModal from '@/components/Layouts/SettingsModal';
import NavbarBottom from '@/components/Layouts/NavbarBottom';
import Button from '@/components/UI/Button';
import axios from 'axios';

const Index = () => {
    const [userData, setUserData] = useState();
    const [breaklogMode, setBreaklogMode] = useState();

    //  For theme //
    const [themeMode, setThemeMode] = useState("night");

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
    useEffect(() => {
        const savedTheme = localStorage.getItem('thememode');

        if (savedTheme) {
            setThemeMode(savedTheme);
        }
        
        // fetch user details
        fetchUserData();
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
                <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <div className="overflow-x-auto">
                                <div className='bg-base-100 rounded-2xl rounded-b-none py-2.5 px-7 mt-20'>
                                    <div className='text-left font-semibold mb-3'>
                                        <p>20 / August,</p>
                                        <p>Sunday</p>
                                        <p className='font-medium my-2'>Break taken: 00:00:00 (hh:mm:ss)</p>
                                    </div>
                                    <table className="table text-center">
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Log</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {logs.map(log => (
                                                <tr key={log.id}>
                                                    <td>{log.timestamp.toLocaleTimeString()}</td>
                                                    <td>{log.log_status}</td>
                                                </tr>
                                            ))} */}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='mb-20'>
                                    <Button
                                        text="End Day"
                                        className="btn btn-primary w-full rounded-2xl rounded-t-none"
                                    />
                                </div>
                            </div>
                        </div>
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
                    // fetchLogs={fetchLogs}
                    />
                </div>
            </div>
        </>
    )
}

export default Index