'use client';
import { useStore } from '@/stores/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { themeMode } = useStore();
  const pathname = usePathname();

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <Toaster position="top-left" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Breaklog</h1>
          <p className="text-muted-foreground">
            {pathname === '/login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
        <div className="text-center mt-4 text-sm">
          {pathname === '/login' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
