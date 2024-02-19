import { useStore } from '@/stores/store';
import LiveBreakCounter from '@/components/Layouts/LiveBreakCounter';

interface BottomNavbarProps {
  logEntry: (value: string) => void; // logEntry is a function that accepts a string
  fetchLogFunction: Function;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ logEntry, fetchLogFunction }) => {
  const { breaklogMode, workData, loading } = useStore();
  return (
    <>
      <LiveBreakCounter />
      <div className='fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-base-100'>
        <div className='grid h-full max-w-lg grid-cols-3 mx-auto justify-center items-center p-2 gap-x-2'>
          <button className='btn inline-flex flex-col items-center justify-center px-5 rounded-full group'>
            <svg
              className='w-5 h-5 mb-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z' />
            </svg>
          </button>
          <div className='flex items-center justify-center'>
            <button
              className={`btn ${
                ['day end'].includes(workData.lastLogStatus) || loading ? 'btn-disabled' : ''
              } inline-flex items-center justify-center w-full font-medium rounded-xl group`}
              onClick={() => (breaklogMode ? logEntry('break log') : logEntry('day log'))}>
              <p className='font-semibold'>Add Log</p>
              {!loading && (
                <svg
                  className='w-3 h-3'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 18 18'>
                  <path
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M9 1v16M1 9h16'
                  />
                </svg>
              )}
              {loading && <span className='loading loading-ring loading-sm'></span>}
            </button>
          </div>
          <div className='dropdown dropdown-top dropdown-end items-center justify-center p-0 m-0 w-full inline-flex'>
            <label
              tabIndex={0}
              className='btn inline-flex flex-col items-center justify-center px-5 rounded-full group flex-1'>
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
                <span
                  className='items-center justify-center'
                  onClick={() => fetchLogFunction()}>
                  <p>Refresh</p>
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
                <span
                  className='items-center justify-center'
                  onClick={() => logEntry('undo log')}>
                  <p>Undo</p>
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
    </>
  );
};

export default BottomNavbar;
