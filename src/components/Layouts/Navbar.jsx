import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const Navbar = ({ breaklogMode, userData }) => {
  const router = useRouter();
  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/login');
    } catch (error) {
      // console.log(error.message);
      toast.error(error.message, {
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
      <div className='navbar bg-base-100 fixed z-10'>
        <div className='navbar-start'>
          <div className='dropdown'>
            <label
              tabIndex={0}
              className='btn btn-ghost btn-circle'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h7'
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
              <li>
                <a className='focus'>Homepage</a>
              </li>
              <li>
                <a>History</a>
              </li>
              {/* <li><a>About</a></li> */}
            </ul>
          </div>
          <div className='flex-1'>
            <a className='btn btn-ghost normal-case text-xl gap-1'>
              {breaklogMode ? (
                <>BreakLog.v4</>
              ) : (
                <>
                  <div>
                    <span className='line-through'>Break</span>DayLog.v4
                  </div>
                </>
              )}
            </a>
          </div>
        </div>
        <div className='navbar-end gap-2'>
          <div className='dropdown dropdown-end'>
            <label
              tabIndex={0}
              className='btn rounded-3xl'>
              {userData ? (
                <span className=''>{userData.username}</span>
              ) : (
                <>
                  <div className='animate-pulse flex space-x-4'>
                    <div className='flex-1 space-y-9 py-1'>
                      <div className='space-y-3'>
                        <div className='grid grid-cols-5 gap-3'>
                          <div className='h-2 bg-slate-700 rounded col-span-3'></div>
                          <div className='h-2 bg-slate-700 rounded col-span-5'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </label>
            <ul
              tabIndex={0}
              className='menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
              <li>
                <a className='justify-between'>
                  Profile
                  <span className='badge'>New</span>
                </a>
              </li>
              <li onClick={() => window.setting_modal.showModal()}>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
