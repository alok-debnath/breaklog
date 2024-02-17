import Button from '../UI/Button';
import { useStore } from '@/stores/store';
import LiveBreakCounter from '@/components/Layouts/LiveBreakCounter';

interface NavbarBottomProps {
  logEntry: (value: string) => void; // logEntry is a function that accepts a string
}
const NavbarBottom: React.FC<NavbarBottomProps> = ({ logEntry }) => {
  const { breaklogMode, workData, loading } = useStore();

  return (
    <>
      <LiveBreakCounter />
      <div className='btm-nav btm-nav-md shadow-md w-full md:w-fit mx-auto md:px-5 md:py-5 md:mb-3 rounded-t-box md:rounded-box'>
        <div className='cursor-default'>
          <div className='flex justify-center gap-10'>
            {/* <div>
              <div
                className={`dropdown dropdown-top dropdown-hover ${
                  ['day end'].includes(workData.lastLogStatus) ||
                  workData.lastLogStatus !== null ||
                  loading ||
                  breaklogMode
                    ? 'btn-disabled'
                    : ''
                }`}>
                <label
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
                    <label>Mark as Leave</label>
                  </li>
                  <li>
                    <label>Work From Home</label>
                  </li>
                </ul>
              </div>
            </div> */}
            <div>
              <Button
                className={`btn ${
                  ['day end'].includes(workData.lastLogStatus) || loading ? 'btn-disabled' : ''
                }`}
                text={
                  <>
                    <p>Enter Log</p>
                    {/* {loading && <span className='loading loading-ring loading-md'></span>} */}
                  </>
                }
                onclick={() => (breaklogMode ? logEntry('break log') : logEntry('day log'))}
              />
            </div>
            <div className='ml-auto'>
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
                    <span>
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
                    </span>
                  </li>
                  <li>
                    <span onClick={() => logEntry('undo log')}>
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
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarBottom;
