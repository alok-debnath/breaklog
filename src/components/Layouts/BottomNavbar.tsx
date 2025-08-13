'use client';
import { useStore } from '@/stores/store';
import LiveBreakCounter from '@/components/Layouts/LiveBreakCounter';
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Coffee, LogIn, LogOut, Plus, Undo2, Menu, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';

interface BottomNavbarProps {
  logEntry: (value: string) => void;
  isIntersecting: boolean;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ logEntry, isIntersecting }) => {
  const { breaklogMode, workData, loading } = useStore();

  const isDayEnded = ['day end', 'exit'].includes(workData.lastLogStatus);
  const btnDisabled = isDayEnded || loading;

  const getButtonContent = () => {
    if (loading && !isIntersecting) {
      return { text: null, icon: <Loader2 className="h-6 w-6 animate-spin" />, isLoading: true };
    }

    const status = workData.lastLogStatus;
    if (status === null && !breaklogMode) return { text: "Start Day", icon: <BriefcaseBusiness className="w-4 h-4" />, isLoading: false };
    if (status === null && breaklogMode) return { text: "Take Break", icon: <Coffee className="w-4 h-4" />, isLoading: false };
    if (status === 'day start') return { text: "Take Break", icon: <Coffee className="w-4 h-4" />, isLoading: false };
    if (status === 'exit') return { text: "End Break", icon: <LogIn className="w-4 h-4" />, isLoading: false };
    if (status === 'enter') return { text: "Take Break", icon: <Coffee className="w-4 h-4" />, isLoading: false };
    return { text: "Add Log", icon: <Plus className="w-4 h-4" />, isLoading: false };
  };

  const { text, icon, isLoading: isButtonContentLoading } = getButtonContent();

  return (
    <>
      <LiveBreakCounter />
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-40" />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
        <div className="bg-card text-card-foreground rounded-full shadow-lg h-16 flex items-center justify-around p-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-12 h-12">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="mb-2">
              <DropdownMenuItem onClick={() => logEntry('undo log')}>
                <Undo2 className="mr-2 h-4 w-4" />
                <span>Undo Last Log</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isIntersecting ? (
            <Button
              onClick={() => breaklogMode ? logEntry('break log') : logEntry('day log')}
              disabled={btnDisabled}
              className="flex-1 h-full rounded-full text-lg font-semibold"
            >
              {isButtonContentLoading ? icon : (
                <div className="flex items-center gap-2">
                  {icon}
                  <span>{text}</span>
                </div>
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => breaklogMode ? logEntry('break log') : logEntry('day log')}
                disabled={btnDisabled}
                className="flex-1 h-full rounded-full text-lg font-semibold"
              >
                {isButtonContentLoading ? icon : (
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{text}</span>
                  </div>
                )}
              </Button>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
