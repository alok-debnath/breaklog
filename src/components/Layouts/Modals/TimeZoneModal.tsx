"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { useEffect, useState } from "react";
import { allTimezones, useTimezoneSelect } from "react-timezone-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle as DrawerTitleComponent,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { handleError, handleSuccessToast } from "../../common/CommonCodeBlocks";

const TimeZoneForm = ({
  className,
  isDesktop,
}: {
  className?: string;
  isDesktop: boolean;
}) => {
  const { userData, loading } = useStore();
  const router = useRouter();

  const labelStyle = "abbrev";
  const timezones = {
    ...allTimezones,
  };
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [deviceTimeZone, setDeviceTimeZone] = useState("");

  async function handleSubmit() {
    useStore.setState(() => ({ loading: true }));
    try {
      const res = await axios.post("/api/users/profile/updateprofile", {
        ...userData,
        default_time_zone: selectedTimeZone,
      });

      if (res.data.success) {
        useStore.setState({ isTimeZoneModalOpen: false });
        useStore.setState({
          userData: {
            ...userData,
          },
        });
        handleSuccessToast({
          message: "Data saved successfully",
        });
      }
    } catch (error: any) {
      handleError({ error: error, router: router });
    } finally {
      useStore.setState(() => ({ loading: false }));
    }
  }

  useEffect(() => {
    const userDeviceTimezone = Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.toLowerCase();
    const isTimeZoneMatch = options.some(
      (option) => option.value.toLowerCase() === userDeviceTimezone
    );
    if (isTimeZoneMatch) {
      setDeviceTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Footer = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-3">
        <div className="from-card/50 to-card/30 border-border/50 rounded-xl border bg-gradient-to-br p-4 backdrop-blur-sm">
          <p className="text-foreground/80 mb-1 text-sm font-medium">
            Device Timezone:
          </p>
          <span
            className={`font-mono text-sm ${
              deviceTimeZone
                ? selectedTimeZone === deviceTimeZone
                  ? "text-green-500"
                  : "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {(deviceTimeZone && (
              <>
                {deviceTimeZone + " "}
                <span className="whitespace-nowrap">
                  {parseTimezone(deviceTimeZone).label.split(") ")[0] + ")"}
                </span>
              </>
            )) ||
              "undefined"}
          </span>
        </div>

        <div className="from-card/50 to-card/30 border-border/50 rounded-xl border bg-gradient-to-br p-4 backdrop-blur-sm">
          <p className="text-foreground/80 mb-1 text-sm font-medium">
            Selected Timezone:
          </p>
          <span
            className={`font-mono text-sm ${
              selectedTimeZone ? "text-green-500" : "text-red-500"
            }`}
          >
            {(selectedTimeZone && (
              <>
                {selectedTimeZone + " "}
                <span className="whitespace-nowrap">
                  {parseTimezone(selectedTimeZone).label.split(") ")[0] + ")"}
                </span>
              </>
            )) ||
              "undefined"}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-orange-200/20 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 p-4 backdrop-blur-sm dark:border-orange-800/20">
        <div className="flex items-start gap-2">
          <svg
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="mb-1 text-sm font-semibold text-orange-700 dark:text-orange-300">
              Note:
            </p>
            <p className="text-xs leading-relaxed text-orange-600 dark:text-orange-400">
              If your work shift spans across midnight, select a timezone where
              your entire shift falls within a single calendar day for accurate
              calculations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="timezone" className="text-foreground/90 font-medium">
          Default Time Zone
        </Label>
        <Select
          value={selectedTimeZone}
          onValueChange={(value) => setSelectedTimeZone(value)}
        >
          <SelectTrigger
            id="timezone"
            className="bg-background/50 border-border/50 hover:bg-background/70 h-12 w-full justify-between truncate rounded-xl backdrop-blur-sm transition-colors"
          >
            <SelectValue placeholder="Select timezone..." />
          </SelectTrigger>
          <SelectContent className="bg-popover/90 border-border/50 backdrop-blur-xl">
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-accent/50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Footer className="pt-6">
        <Button
          onClick={handleSubmit}
          disabled={!selectedTimeZone || loading}
          className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 rounded-xl bg-gradient-to-r px-8 py-2 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
              Saving...
            </div>
          ) : (
            "Confirm"
          )}
        </Button>
        {!isDesktop && (
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        )}
      </Footer>
    </div>
  );
};

const TimeZoneModal: React.FC = () => {
  const { isTimeZoneModalOpen } = useStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onOpenChange = (isOpen: boolean) => {
    useStore.setState({ isTimeZoneModalOpen: isOpen });
  };

  const Header = isDesktop ? DialogHeader : DrawerHeader;
  const Title = isDesktop ? DialogTitle : DrawerTitleComponent;

  if (isDesktop) {
    return (
      <Dialog open={isTimeZoneModalOpen} onOpenChange={onOpenChange}>
        <DialogContent
          id="timezone-dialog-content"
          className="bg-background/80 border-border/50 shadow-2xl backdrop-blur-xl sm:max-w-[550px]"
        >
          <Header className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm">
                <svg
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <Title className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-semibold">
                Select Time Zone
              </Title>
            </div>
          </Header>
          <TimeZoneForm isDesktop={true} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isTimeZoneModalOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <Header className="space-y-3 text-left">
          <div className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <Title className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-semibold">
              Select Time Zone
            </Title>
          </div>
        </Header>
        <TimeZoneForm className="px-4" isDesktop={false} />
      </DrawerContent>
    </Drawer>
  );
};

export default TimeZoneModal;
