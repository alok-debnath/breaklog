"use client";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { useCallback, useEffect, useState } from "react";
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
import { api } from "@/convex/_generated/api";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { handleError, handleSuccessToast } from "../../common/CommonCodeBlocks";

// Reusable styled components
const InfoCard = ({
  title,
  value,
  status,
}: {
  title: string;
  value: string;
  status: "success" | "warning" | "error";
}) => {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  return (
    <div className="rounded-xl border border-border/50 bg-linear-to-br from-card/50 to-card/30 p-4 backdrop-blur-sm">
      <p className="mb-1 text-sm font-medium text-foreground/80">{title}:</p>
      <span className={cn("font-mono text-sm", statusColors[status])}>
        {value || "undefined"}
      </span>
    </div>
  );
};

const WarningNote = () => (
  <div className="rounded-xl border border-orange-200/20 bg-linear-to-br from-orange-500/10 to-yellow-500/10 p-4 backdrop-blur-sm dark:border-orange-800/20">
    <div className="flex items-start gap-2">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-orange-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
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
          If your work shift spans across midnight, select a timezone where your
          entire shift falls within a single calendar day for accurate
          calculations.
        </p>
      </div>
    </div>
  </div>
);

const TimeZoneForm = ({ isDesktop }: { isDesktop: boolean }) => {
  const { userData, loading } = useStore();
  const router = useRouter();
  const updateProfile = useMutation(api.user.profile.update);

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle: "abbrev",
    timezones: allTimezones,
  });

  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [deviceTimeZone, setDeviceTimeZone] = useState("");

  const formatTimezoneDisplay = useCallback(
    (timezone: string) => {
      if (!timezone) return "";
      const parsed = parseTimezone(timezone);
      const offset = `${parsed.label.split(") ")[0]})`;
      return `${timezone} ${offset}`;
    },
    [parseTimezone],
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedTimeZone) return;

    useStore.setState({ loading: true });
    try {
      await updateProfile({ defaultTimeZone: selectedTimeZone });

      useStore.setState({
        isTimeZoneModalOpen: false,
      });

      handleSuccessToast({ message: "Timezone updated successfully" });
    } catch (error: unknown) {
      handleError({ error, router });
    } finally {
      useStore.setState({ loading: false });
    }
  }, [selectedTimeZone, updateProfile, router]);

  useEffect(() => {
    const userDeviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const normalizedDeviceTimezone = userDeviceTimezone.toLowerCase();

    const matchingOption = options.find(
      (option) => option.value.toLowerCase() === normalizedDeviceTimezone,
    );

    if (matchingOption) {
      setDeviceTimeZone(userDeviceTimezone);
      setSelectedTimeZone(userDeviceTimezone);
    }
  }, [options]);

  const getTimezoneStatus = (device: string, selected: string) => {
    if (!device) return "error";
    return selected === device ? "success" : "warning";
  };

  const Footer = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <div
      className={cn(
        "space-y-4",
        !isDesktop && "max-h-[70vh] overflow-y-auto px-4",
      )}
    >
      <div className="space-y-3">
        <InfoCard
          title="Device Timezone"
          value={deviceTimeZone ? formatTimezoneDisplay(deviceTimeZone) : ""}
          status={getTimezoneStatus(deviceTimeZone, selectedTimeZone)}
        />

        <InfoCard
          title="Selected Timezone"
          value={
            selectedTimeZone ? formatTimezoneDisplay(selectedTimeZone) : ""
          }
          status={selectedTimeZone ? "success" : "error"}
        />
      </div>

      <WarningNote />

      <div className="space-y-2">
        <Label htmlFor="timezone" className="font-medium text-foreground/90">
          Default Time Zone
        </Label>
        <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
          <SelectTrigger
            id="timezone"
            className="h-12 w-full rounded-xl border-border/50 bg-background/50 backdrop-blur-sm transition-colors hover:bg-background/70"
          >
            <SelectValue placeholder="Select timezone..." />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] border-border/50 bg-popover/90 backdrop-blur-xl">
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-accent/50"
                >
                  <span className="truncate">{option.label}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Footer className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedTimeZone || loading}
          className="rounded-xl bg-linear-to-r from-primary to-primary/80 px-8 py-2 font-medium text-primary-foreground transition-all duration-300 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Saving...
            </div>
          ) : (
            "Confirm"
          )}
        </Button>
        {!isDesktop && (
          <DrawerClose asChild>
            <Button variant="outline" className="rounded-xl">
              Cancel
            </Button>
          </DrawerClose>
        )}
      </Footer>
    </div>
  );
};

const ModalHeader = ({ isDesktop }: { isDesktop: boolean }) => {
  const Header = isDesktop ? DialogHeader : DrawerHeader;
  const Title = isDesktop ? DialogTitle : DrawerTitleComponent;

  return (
    <Header className={cn("space-y-3", !isDesktop && "text-left")}>
      <div className={cn("flex items-center gap-3", !isDesktop && "p-4")}>
        <div className="rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm">
          <svg
            className="h-5 w-5 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <Title className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-semibold">
          Select Time Zone
        </Title>
      </div>
    </Header>
  );
};

const TimeZoneModal: React.FC = () => {
  const { isTimeZoneModalOpen } = useStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpenChange = (isOpen: boolean) => {
    useStore.setState({ isTimeZoneModalOpen: isOpen });
  };

  if (isDesktop) {
    return (
      <Dialog open={isTimeZoneModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="border-border/50 bg-background/80 shadow-2xl backdrop-blur-xl sm:max-w-[550px]">
          <ModalHeader isDesktop={true} />
          <TimeZoneForm isDesktop={true} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isTimeZoneModalOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <ModalHeader isDesktop={false} />
        <TimeZoneForm isDesktop={false} />
      </DrawerContent>
    </Drawer>
  );
};

export default TimeZoneModal;
