'use client';
import { useStore } from '@/stores/store';
import LiveBreakCounter from '@/components/Layouts/LiveBreakCounter';
import { Button } from '@/components/ui/button';
import {
  BriefcaseBusiness,
  Coffee,
  LogIn,
  LogOut,
  Plus,
  Undo2,
  Menu,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface BottomNavbarProps {
  logEntry: (value: string) => void;
  isIntersecting: boolean;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  logEntry,
  isIntersecting,
}) => {
  const { breaklogMode, workData, loading } = useStore();

  const btnDisabled = ['day end'].includes(workData.lastLogStatus) || loading;

  const getButtonContent = () => {
    if (loading && !isIntersecting) {
      return {
        text: null,
        icon: <Loader2 className='h-6 w-6 animate-spin' />,
        isLoading: true,
      };
    }

    const status = workData.lastLogStatus;
    if (status === null && !breaklogMode)
      return {
        text: 'Start Day',
        icon: <BriefcaseBusiness className='h-4 w-4' />,
        isLoading: false,
      };
    if (status === null && breaklogMode)
      return {
        text: 'Take Break',
        icon: <Coffee className='h-4 w-4' />,
        isLoading: false,
      };
    if (status === 'day start')
      return {
        text: 'Take Break',
        icon: <Coffee className='h-4 w-4' />,
        isLoading: false,
      };
    if (status === 'exit')
      return {
        text: 'End Break',
        icon: <LogIn className='h-4 w-4' />,
        isLoading: false,
      };
    if (status === 'enter')
      return {
        text: 'Take Break',
        icon: <Coffee className='h-4 w-4' />,
        isLoading: false,
      };
    return {
      text: 'Add Log',
      icon: <Plus className='h-4 w-4' />,
      isLoading: false,
    };
  };

  const { text, icon, isLoading: isButtonContentLoading } = getButtonContent();

  return (
    <>
      <LiveBreakCounter />
      <div className='from-background fixed right-0 bottom-0 left-0 z-40 h-24 bg-gradient-to-t to-transparent' />
      <div className='fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4'>
        <div className='bg-card text-card-foreground flex h-16 items-center justify-around rounded-full border p-2 shadow-lg'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-12 w-12 rounded-full'
              >
                <Menu className='h-6 w-6' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='top' align='start' className='mb-2'>
              <DropdownMenuItem onClick={() => logEntry('undo log')}>
                <Undo2 className='mr-2 h-4 w-4' />
                <span>Undo Last Log</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isIntersecting ? (
            <Button
              onClick={() =>
                breaklogMode ? logEntry('break log') : logEntry('day log')
              }
              disabled={btnDisabled}
              className='h-full flex-1 rounded-full text-lg font-semibold'
            >
              {isButtonContentLoading ? (
                icon
              ) : (
                <div className='flex items-center gap-2'>
                  {icon}
                  <span>{text}</span>
                </div>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={() =>
                  breaklogMode ? logEntry('break log') : logEntry('day log')
                }
                disabled={btnDisabled}
                className='h-full flex-1 rounded-full text-lg font-semibold'
              >
                {isButtonContentLoading ? (
                  icon
                ) : (
                  <div className='flex items-center gap-2'>
                    {icon}
                    <span>{text}</span>
                  </div>
                )}
              </Button>
              <Button
                onClick={() => logEntry('day end')}
                variant='destructive'
                className='h-full flex-1 rounded-full text-lg font-semibold'
                disabled={
                  ['exit', null, 'day end'].includes(workData.lastLogStatus) ||
                  loading ||
                  breaklogMode
                }
              >
                End Day
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
