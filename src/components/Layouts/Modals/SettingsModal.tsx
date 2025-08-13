'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useStore } from '@/stores/store';
import Button from "@/components/UI/Button";
import ToggleButtonText from '../../UI/ToggleButtonText';
import SelectboxText from '../../UI/SelectboxText';
import { ThemeName } from '../../../Constants/ThemeConstant';

const SettingsModal = () => {
  const { breaklogMode, logs, themeMode, isSettingsModalOpen } = useStore();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    useStore.setState(() => ({ themeMode: event.target.value }));
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    useStore.setState(() => ({ breaklogMode: event.target.checked }));
    localStorage.setItem('breaklogMode', JSON.stringify(event.target.checked));
  };

  return (
    <Dialog open={isSettingsModalOpen} onOpenChange={() => useStore.setState({ isSettingsModalOpen: false })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-1 gap-y-6'>
          <ToggleButtonText
            text='BreakLog mode'
            disabled={logs.length === 0 ? false : true}
            checked={breaklogMode}
            secondaryText='(LOP will be miscalculated once log is saved using this mode)'
            onChange={handleToggleChange}
          />
          <SelectboxText
            text='Theme'
            OptionValue={ThemeName}
            checked={themeMode}
            onChange={handleThemeChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => useStore.setState({ isSettingsModalOpen: false })} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
