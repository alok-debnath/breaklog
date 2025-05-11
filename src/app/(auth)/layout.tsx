'use client';
import { useStore } from '@/stores/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { themeMode } = useStore();
  const pathname = usePathname();

  return (
    <div data-theme={themeMode || 'caramellatte'}>
      <div className='hero bg-base-200 min-h-screen'>
        <Toaster position='top-left' reverseOrder={false} />
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <div className='text-center lg:text-left'>
            <div className='mb-3 flex flex-row items-center gap-4'>
              <h1 className='text-5xl font-bold underline'>Breaklog</h1>
              <p className='text-2xl font-bold'>
                {pathname === '/login' ? 'Login' : 'Sign up'}
              </p>
            </div>
            <p className='py-2'>
              {pathname === '/login' ? (
                <>
                  Don&apos;t have an account yet?{' '}
                  <Link
                    href='/signup'
                    className='link-hover link font-semibold'
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link href='/login' className='link-hover link font-semibold'>
                    Login
                  </Link>
                </>
              )}
            </p>
          </div>
          <div className='card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl'>
            <div className='card-body p-0'>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
