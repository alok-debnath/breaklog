'use client';
import { useStore } from '@/stores/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { themeMode } = useStore();
  const pathname = usePathname();

  return (
    <div>
      <div className='bg-muted min-h-screen flex items-center justify-center'>
        <div className='flex-col lg:flex-row-reverse'>
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
          <Card>
            <CardContent className="p-0">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
