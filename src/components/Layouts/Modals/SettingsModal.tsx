'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useStore } from '@/stores/store';
import { Button } from "@/components/ui/button";
import { ThemeName } from '../../../Constants/ThemeConstant';

const SettingsModal = () => {
  const { breaklogMode, logs, themeMode, isSettingsModalOpen, userData } = useStore();

  const handleThemeChange = (value: string) => {
    useStore.setState({ themeMode: value });
    // Assuming you still want to save the theme to local storage
    localStorage.setItem('thememode', value);
    document.cookie = `theme=${value}; path=/; max-age=31536000`;
  };

  const handleToggleChange = (checked: boolean) => {
    useStore.setState({ breaklogMode: checked });
    localStorage.setItem('breaklogMode', JSON.stringify(checked));
  };

  return (
    <Dialog open={isSettingsModalOpen} onOpenChange={(isOpen) => useStore.setState({ isSettingsModalOpen: isOpen })}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="breaklog-mode">BreakLog Mode</Label>
              <DialogDescription>
                Logs breaks instead of work entries. (Cannot be changed after first log of the day)
              </DialogDescription>
            </div>
            <Switch
              id="breaklog-mode"
              checked={breaklogMode}
              onCheckedChange={handleToggleChange}
              disabled={logs.length > 0}
            />
          </div>
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
             <div className="flex flex-col space-y-1">
                <Label htmlFor="theme-selector">Theme</Label>
                <DialogDescription>
                  Select a theme for the application.
                </DialogDescription>
              </div>
            <Select onValueChange={handleThemeChange} defaultValue={themeMode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent>
                {ThemeName.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => useStore.setState({ isSettingsModalOpen: false })}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
