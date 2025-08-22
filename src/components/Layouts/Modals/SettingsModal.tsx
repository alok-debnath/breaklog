"use client";
import { Palette, Settings, ToggleLeft } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription as DrawerDescriptionComponent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle as DrawerTitleComponent,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { ThemeSelector } from "@/components/theme-selector";

const SettingsForm = ({ className }: { className?: string }) => {
  const { breaklogMode, logs } = useStore();

  const handleToggleChange = (checked: boolean) => {
    useStore.setState({ breaklogMode: checked });
    localStorage.setItem("breaklogMode", JSON.stringify(checked));
  };

  return (
    <div className={cn("grid gap-6 py-6", className)}>
      <div className="group border-border/50 from-card/50 to-card/30 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex flex-1 flex-col space-y-2">
            <div className="flex items-center gap-2">
              <ToggleLeft className="text-primary h-4 w-4" />
              <Label htmlFor="breaklog-mode" className="font-medium">
                BreakLog Mode
              </Label>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              Logs breaks instead of work entries. (Cannot be changed after
              first log of the day)
            </DialogDescription>
          </div>
          <Switch
            id="breaklog-mode"
            checked={breaklogMode}
            onCheckedChange={handleToggleChange}
            disabled={logs.length > 0}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
          />
        </div>
      </div>

      <div className="group border-border/50 from-card/50 to-card/30 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex flex-1 flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="text-primary h-4 w-4" />
              <Label htmlFor="theme-selector" className="font-medium">
                Theme
              </Label>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              Select a theme for the application.
            </DialogDescription>
          </div>
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
};

const SettingsModal = () => {
  const { isSettingsModalOpen } = useStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onOpenChange = (isOpen: boolean) => {
    useStore.setState({ isSettingsModalOpen: isOpen });
  };

  if (isDesktop) {
    return (
      <Dialog open={isSettingsModalOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-background/80 border-border/50 shadow-2xl backdrop-blur-xl sm:max-w-[500px]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <DialogTitle className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-semibold">
                Settings
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Manage your application settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <SettingsForm />
          <DialogFooter>
            <Button
              onClick={() => onOpenChange(false)}
              className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 rounded-xl bg-gradient-to-r px-8 py-2 font-medium transition-all duration-300 hover:shadow-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isSettingsModalOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DrawerTitleComponent className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-semibold">
              Settings
            </DrawerTitleComponent>
          </div>
          <DrawerDescriptionComponent className="text-muted-foreground">
            Manage your application settings and preferences.
          </DrawerDescriptionComponent>
        </DrawerHeader>
        <SettingsForm className="px-4" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsModal;
