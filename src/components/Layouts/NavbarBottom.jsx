import Button from '../UI/Button'
// import { addLog } from '../../Utility/indexedDBUtils';

const NavbarBottom = ({ setShowToast, fetchLogs }) => {
    const logEntry = async () => {
        const newLog = {
            log_status: 'enter',
            timestamp: new Date(),
        };

        // try {
        //     await addLog(newLog);
        //     setShowToast('Log entry added successfully[success]'); // Show toast message
        //     fetchLogs();
        // } catch (error) {
        //     console.error('Error adding log entry:', error);
        //     setShowToast('Error adding log entry'); // Show toast message
        // }
    };
    return (
        <>
            <div className="btm-nav btm-nav-md">
                <div className='cursor-default'>
                    <div className="flex gap-3">
                        <div>
                            <div className="dropdown dropdown-top">
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
                                className="btn"
                                text="Enter log"
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