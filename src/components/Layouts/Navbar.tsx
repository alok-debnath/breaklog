'use client';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useStore } from '@/stores/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SettingsModal from './Modals/SettingsModal';
import { signOut } from 'next-auth/react';
import { ModeToggle } from '../mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Button from '../UI/Button';

const Navbar = () => {
  const { breaklogMode, userData } = useStore();
  const isClient = typeof window !== 'undefined';

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

  const logout = async (): Promise<void> => {
    signOut({ callbackUrl: '/login' })
  };

  return (
    <>
      <div className='fixed z-10 w-full bg-linear-to-b from-muted to-transparent px-3 pt-3'>
        <div className='flex items-center mx-auto max-w-(--breakpoint-lg) rounded-box bg-card text-card-foreground shadow-lg p-2'>
          <div className='flex-1'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 6h16M4 12h16M4 18h7'
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link
                    href='/dashboard'
                    className={`${pathname === '/dashboard' ? 'bg-accent' : ''}`}
                  >
                    Homepage
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href='/dashboard/history'
                    className={`${pathname === '/dashboard/history' ? 'bg-accent' : ''}`}
                  >
                    History
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className='flex-1'>
              <Link
                href='/dashboard'
                className='btn btn-ghost gap-1 text-xl normal-case'
              >
                {isClient && userData.username ? (
                  breaklogMode ? (
                    <span className='whitespace-nowrap'>BreakLog.v4</span>
                  ) : (
                    <span className='whitespace-nowrap'>DayLog.v4</span>
                  )
                ) : (
                  <span className='animate-pulse'>
                    <span className='flex space-x-4'>
                      <span className='flex-1 space-y-9 py-1'>
                        <span className='space-y-3'>
                          <span className='grid grid-cols-6 gap-5'>
                            <span className='col-span-4 h-2 rounded-sm bg-slate-700'></span>
                            <span className='col-span-2 h-2 rounded-sm bg-slate-700'></span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                )}
              </Link>
            </div>
          </div>
          <div className='flex-1 justify-end gap-1'>
            {backPath !== '' && (
              <Link
                href={backPath}
                className='btn join-item btn-neutral join-horizontal'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </Link>
            )}
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {userData.username ? (
                    <span className=''>{userData.username}</span>
                  ) : (
                    <>
                      <div className='flex animate-pulse space-x-4'>
                        <div className='flex-1 space-y-9 py-1'>
                          <div className='space-y-3'>
                            <div className='grid grid-cols-3 gap-3'>
                              <div className='col-span-3 h-2 rounded-sm bg-slate-700'></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href='/dashboard/profile' className='justify-between'>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => useStore.setState({ isSettingsModalOpen: true })}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Toaster
          containerClassName='mt-18'
          position='top-left'
          reverseOrder={false}
        />
      </div>
    </>
  );
};

export default Navbar;
