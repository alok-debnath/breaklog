import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { useStore } from '@/stores/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SettingsModal from './SettingsModal';

const Navbar = () => {
  const { breaklogMode, userData } = useStore();

  const [backPath, setBackPath] = useState('');
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== '/dashboard') {
      const parts = pathname.split('/');
      const modifiedPath = parts.slice(0, -1).join('/');
      setBackPath(modifiedPath);
    } else {
      setBackPath('');
    }
  }, [pathname]);

  const router = useRouter();
  const logout = async (): Promise<void> => {
    try {
      await axios.get('/api/auth/logout');
      router.push('/login');
    } catch (error: any) {
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
      <div className='navbar bg-base-100 fixed z-10 drop-shadow-md'>
        <div className='navbar-start'>
          <div className='dropdown'>
            <label
              tabIndex={0}
              className='btn btn-ghost'>
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
              className='menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-2'>
              <li>
                <Link
                  href='/dashboard'
                  className={`${pathname === '/dashboard' ? 'focus' : ''}`}>
                  Homepage
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard/history'
                  className={`${pathname === '/dashboard/history' ? 'focus' : ''}`}>
                  History
                </Link>
              </li>
              {/* <li><a>About</a></li> */}
            </ul>
          </div>
          <div className='flex-1'>
            <Link
              href='/dashboard'
              className='btn btn-ghost normal-case text-xl gap-1'>
              {breaklogMode ? (
                <>BreakLog.v4</>
              ) : (
                <>
                  <div className='whitespace-nowrap'>DayL☀️g.v4</div>
                </>
              )}
            </Link>
          </div>
        </div>
        <div className='navbar-end gap-1 join'>
          {backPath !== '' && (
            <Link
              href={backPath}
              className='btn btn-neutral join-item join-horizontal'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='w-6 h-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.75 19.5L8.25 12l7.5-7.5'
                />
              </svg>
            </Link>
          )}
          <div className='dropdown dropdown-end'>
            <label
              tabIndex={0}
              className='btn normal-case join-item'>
              {userData.username ? (
                <span className=''>{userData.username}</span>
              ) : (
                <>
                  <div className='animate-pulse flex space-x-4'>
                    <div className='flex-1 space-y-9 py-1'>
                      <div className='space-y-3'>
                        <div className='grid grid-cols-3 gap-3'>
                          <div className='h-2 bg-slate-700 rounded col-span-3'></div>
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
                <Link
                  href='/dashboard/profile'
                  className='justify-between'>
                  Profile
                  <span className='badge'>New</span>
                </Link>
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
      <Toaster
        containerClassName='mt-16'
        position='top-left'
        reverseOrder={false}
      />
      <SettingsModal />
    </>
  );
};

export default Navbar;
