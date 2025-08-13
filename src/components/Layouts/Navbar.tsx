'use client';
import { usePathname } from 'next/navigation';
import { useStore } from '@/stores/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { ModeToggle } from '../mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, ArrowLeft, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { userData } = useStore();
  const pathname = usePathname();
  const [backPath, setBackPath] = useState('');

  useEffect(() => {
    if (pathname !== '/dashboard') {
      const parts = pathname.split('/');
      setBackPath(parts.slice(0, -1).join('/'));
    } else {
      setBackPath('');
    }
  }, [pathname]);

  const logout = () => signOut({ callbackUrl: '/login' });

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <header className="rounded-full border bg-background/80 px-4 py-2 shadow-lg backdrop-blur">
        <div className="flex h-12 items-center justify-between gap-x-4">
          {/* Mobile Menu & Back Button */}
          <div className="flex items-center md:hidden">
            {backPath ? (
              <Link href={backPath} passHref>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/history">History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => useStore.setState({ isSettingsModalOpen: true })}>
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-x-6 md:flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-lg font-bold">Breaklog</span>
            </Link>
            <nav className="flex items-center gap-x-6 text-sm font-medium">
              <Link
                href="/dashboard/history"
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname.startsWith('/dashboard/history') ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                History
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-normal">
                  <p className="text-sm">Signed in as <span className="font-semibold">{userData.username || "User"}</span></p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => useStore.setState({ isSettingsModalOpen: true })}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
