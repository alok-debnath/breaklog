import axios from 'axios';
import Button from '../UI/Button';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NavbarBottom = ({ loading, logEntry, workData, breaklogMode }) => {
  // const [loading, setLoading] = useState(false);

  return (
    <>
      <div className='btm-nav btm-nav-md'>
        <div className='cursor-default'>
          <div className='flex gap-3'>
            <div>
              <div
                className={`dropdown dropdown-top dropdown-hover ${
                  ['day end'].includes(workData.lastLogStatus) ||
                  workData.lastLogStatus !== null ||
                  loading ||
                  breaklogMode
                    ? 'btn-disabled'
                    : ''
                }`}>
                {/* <label
                  tabIndex={0}
                  className={`btn btn-fill ${
                    ['day end'].includes(workData.lastLogStatus) ||
                    workData.lastLogStatus !== null ||
                    loading ||
                    breaklogMode
                      ? 'btn-disabled'
                      : ''
                  }`}>
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
                      d='M4.5 15.75l7.5-7.5 7.5 7.5'
                    />
                  </svg>
                </label>
                <ul
                  tabIndex={0}
                  className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                  <li>
                    <a>Mark as Leave</a>
                  </li>
                  <li>
                    <a>Work From Home</a>
                  </li>
                </ul> */}
              </div>
            </div>
            <div>
              <Button
                className={`btn ${
                  ['day end'].includes(workData.lastLogStatus) || loading ? 'btn-disabled' : ''
                }`}
                text={
                  <>
                    <p>Enter log</p>
                    {loading && <span className='loading loading-ring loading-md'></span>}
                  </>
                }
                onclick={() => (breaklogMode ? logEntry('break log') : logEntry('day log'))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarBottom;
