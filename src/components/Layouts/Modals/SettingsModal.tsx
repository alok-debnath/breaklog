'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStore } from '@/stores/store';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Settings, Palette, ToggleLeft } from 'lucide-react';

const SettingsModal = () => {
  const { breaklogMode, logs, themeMode, isSettingsModalOpen, userData } =
    useStore();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const handleToggleChange = (checked: boolean) => {
    useStore.setState({ breaklogMode: checked });
    localStorage.setItem('breaklogMode', JSON.stringify(checked));
  };

  return (
    <Dialog
      open={isSettingsModalOpen}
      onOpenChange={(isOpen) =>
        useStore.setState({ isSettingsModalOpen: isOpen })
      }
    >
      <DialogContent className='bg-background/80 border-border/50 shadow-2xl backdrop-blur-xl sm:max-w-[500px]'>
        <DialogHeader className='space-y-3'>
          <div className='flex items-center gap-3'>
            <div className='rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm'>
              <Settings className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <DialogTitle className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-semibold'>
              Settings
            </DialogTitle>
          </div>
          <DialogDescription className='text-muted-foreground'>
            Manage your application settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-6 py-6'>
          <div className='group border-border/50 from-card/50 to-card/30 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg'>
            <div className='flex items-start justify-between space-x-4'>
              <div className='flex flex-1 flex-col space-y-2'>
                <div className='flex items-center gap-2'>
                  <ToggleLeft className='text-primary h-4 w-4' />
                  <Label htmlFor='breaklog-mode' className='font-medium'>
                    BreakLog Mode
                  </Label>
                </div>
                <DialogDescription className='text-sm leading-relaxed'>
                  Logs breaks instead of work entries. (Cannot be changed after
                  first log of the day)
                </DialogDescription>
              </div>
              <Switch
                id='breaklog-mode'
                checked={breaklogMode}
                onCheckedChange={handleToggleChange}
                disabled={logs.length > 0}
                className='data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500'
              />
            </div>
          </div>

          <div className='group border-border/50 from-card/50 to-card/30 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg'>
            <div className='flex items-start justify-between space-x-4'>
              <div className='flex flex-1 flex-col space-y-2'>
                <div className='flex items-center gap-2'>
                  <Palette className='text-primary h-4 w-4' />
                  <Label htmlFor='theme-selector' className='font-medium'>
                    Theme
                  </Label>
                </div>
                <DialogDescription className='text-sm leading-relaxed'>
                  Select a theme for the application.
                </DialogDescription>
              </div>
              <Select onValueChange={handleThemeChange} value={theme}>
                <SelectTrigger className='bg-background/50 border-border/50 hover:bg-background/70 min-w-[100px] backdrop-blur-sm transition-colors'>
                  <SelectValue placeholder='Select a theme' />
                </SelectTrigger>
                <SelectContent className='bg-popover/90 border-border/50 backdrop-blur-xl'>
                  <SelectItem value='light' className='hover:bg-accent/50'>
                    Light
                  </SelectItem>
                  <SelectItem value='dark' className='hover:bg-accent/50'>
                    Dark
                  </SelectItem>
                  <SelectItem value='system' className='hover:bg-accent/50'>
                    System
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => useStore.setState({ isSettingsModalOpen: false })}
            className='from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 rounded-xl bg-gradient-to-r px-8 py-2 font-medium transition-all duration-300 hover:shadow-lg'
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
