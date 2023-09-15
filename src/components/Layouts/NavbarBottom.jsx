import axios from 'axios';
import Button from '../UI/Button'
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NavbarBottom = ({ setLoadingDashboard, fetchUserLog }) => {
    const [loading, setLoading] = useState(false);
    const logEntry = async () => {
        try {
            setLoading(true);
            setLoadingDashboard(true);
            const currentDate = new Date();
            const utcOffset = 5.5 * 60; // 5 hours and 30 minutes in minutes
            const localTime = new Date(currentDate.getTime() + utcOffset * 60 * 1000);
            const values = {
                datetime: localTime.toISOString(),
            };

            const res = await axios.post('/api/users/userlogenter', values);
            await fetchUserLog();
            setLoading(false);
            setLoadingDashboard(false);
        } catch (error) {
            toast.error("Error while log entry: ", error, {
                style: {
                    padding: '15px',
                    color: 'white',
                    backgroundColor: 'rgb(214, 60, 60)',
                },
            });
        }
    };
    return (
        <>
            <div className="btm-nav btm-nav-md">
                <div className='cursor-default'>
                    <div className="flex gap-3">
                        <div>
                            <div className={`dropdown dropdown-top ${loading ? 'btn-disabled' : ''}`}>
                                <details>
                                    <summary className='btn btn-fill'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                        </svg>
                                    </summary>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><a>Mark as Leave</a></li>
                                        <li><a>Work From Home</a></li>
                                    </ul>
                                </details>
                            </div>
                        </div>
                        <div>
                            <Button
                                className={`btn ${loading ? 'btn-disabled' : ''}`}
                                text={
                                    <>
                                        <p>Enter log</p>
                                        {loading &&
                                            <span className="loading loading-ring loading-md"></span>
                                        }

                                    </>}
                                onclick={logEntry}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavbarBottom