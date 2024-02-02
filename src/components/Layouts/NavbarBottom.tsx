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
      <div className='btm-nav btm-nav-md shadow-md'>
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
                    <label>Mark as Leave</label>
                  </li>
                  <li>
                    <label>Work From Home</label>
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
                    <p>Enter Log</p>
                    {/* {loading && <span className='loading loading-ring loading-md'></span>} */}
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
