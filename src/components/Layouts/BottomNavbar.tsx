"use client";
import {
  BriefcaseBusiness,
  Coffee,
  Loader2,
  LogIn,
  MoreHorizontal,
  Plus,
  Undo2,
} from "lucide-react";
import LiveBreakCounter from "@/components/Layouts/LiveBreakCounter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";

interface BottomNavbarProps {
  logEntry: (value: string) => void;
  isIntersecting: boolean;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  logEntry,
  isIntersecting,
}) => {
  const { breaklogMode, workData, loading } = useStore();

  const btnDisabled = ["day end"].includes(workData.lastLogStatus) || loading;

  const getButtonContent = () => {
    if (loading && !isIntersecting) {
      return {
        text: null,
        icon: <Loader2 className="h-5 w-5 animate-spin" />,
        isLoading: true,
      };
    }

    const status = workData.lastLogStatus;
    if (status === null && !breaklogMode)
      return {
        text: "Start Day",
        icon: <BriefcaseBusiness className="h-5 w-5" />,
        isLoading: false,
      };
    if (status === null && breaklogMode)
      return {
        text: "Take Break",
        icon: <Coffee className="h-5 w-5" />,
        isLoading: false,
      };
    if (status === "day start")
      return {
        text: "Take Break",
        icon: <Coffee className="h-5 w-5" />,
        isLoading: false,
      };
    if (status === "exit")
      return {
        text: "End Break",
        icon: <LogIn className="h-5 w-5" />,
        isLoading: false,
      };
    if (status === "enter")
      return {
        text: "Take Break",
        icon: <Coffee className="h-5 w-5" />,
        isLoading: false,
      };
    return {
      text: "Add Log",
      icon: <Plus className="h-5 w-5" />,
      isLoading: false,
    };
  };

  const { text, icon, isLoading: isButtonContentLoading } = getButtonContent();

  return (
    <>
      <LiveBreakCounter />
      <div className="from-background via-background/80 pointer-events-none fixed right-0 bottom-0 left-0 z-40 h-32 bg-linear-to-t to-transparent" />

      <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
        <div className="from-card/95 to-card/80 border-border/50 relative overflow-hidden rounded-3xl border bg-linear-to-r shadow-2xl backdrop-blur-xl">
          {/* Background decoration */}
          <div className="from-primary/5 to-primary/5 absolute inset-0 bg-linear-to-r via-transparent" />
          <div className="bg-primary/10 absolute -top-2 -right-2 h-8 w-8 rounded-full" />
          <div className="bg-primary/5 absolute -bottom-2 -left-2 h-6 w-6 rounded-full" />

          <div className="relative flex h-16 items-center justify-between gap-2 p-2">
            {/* Menu Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/50 h-12 w-12 rounded-2xl transition-all duration-200 hover:scale-105"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="border-border/50 bg-card/95 mb-2 rounded-2xl backdrop-blur-xl"
              >
                <DropdownMenuItem
                  onClick={() => logEntry("undo log")}
                  className="hover:bg-accent/50 cursor-pointer rounded-xl transition-colors duration-200"
                >
                  <Undo2 className="mr-2 h-4 w-4" />
                  <span>Undo Recent Log</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main Action Button(s) */}
            {!isIntersecting &&
            !["exit", null, "day end"].includes(workData.lastLogStatus) ? (
              <Button
                onClick={() => logEntry("day end")}
                variant="destructive"
                className={cn(
                  "h-12 flex-1 rounded-2xl text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                  "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                )}
                disabled={
                  ["exit", null, "day end"].includes(workData.lastLogStatus) ||
                  loading ||
                  breaklogMode
                }
              >
                End Day
              </Button>
            ) : (
              <></>
            )}
            <Button
              onClick={() =>
                breaklogMode ? logEntry("break log") : logEntry("day log")
              }
              disabled={btnDisabled}
              className={cn(
                "h-12 flex-1 rounded-2xl text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                "from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-linear-to-r"
              )}
            >
              <span
                className={`${
                  !isIntersecting &&
                  !["exit", null, "day end"].includes(workData.lastLogStatus)
                    ? "hidden"
                    : ""
                }`}
              >
                {icon}
              </span>
              {text}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
