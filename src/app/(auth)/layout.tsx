'use client';
import { useStore } from '@/stores/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <Toaster position='top-center' />
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Clock className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">BreakLog</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {pathname === '/login' ? 'Welcome back!' : 'Get started today'}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {pathname === '/login' 
                ? 'Track your work activities and boost your productivity'
                : 'Join thousands of professionals optimizing their work time'
              }
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {pathname === '/login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Link href='/signup' className='text-primary hover:underline font-medium'>
                  Sign up here
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link href='/login' className='text-primary hover:underline font-medium'>
                  Sign in here
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Right side - Form */}
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
