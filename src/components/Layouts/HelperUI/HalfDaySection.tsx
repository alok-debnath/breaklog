import { useMutation } from "convex/react";
import { CheckCircle2, Clock, Undo2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { handleError } from "@/components/common/CommonCodeBlocks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { api } from "../../../../convex/_generated/api";

interface HalfDaySectionProps {
  isHalfDay: boolean;
  defaultTimeZone: string;
}

const getCurrentDateInTimezone = (timezone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  };
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(new Date());

  // Extract day, month, and year from the formatted parts
  const day = parts.find((part) => part.type === "day")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  const year = parts.find((part) => part.type === "year")?.value || "";

  return `${day}-${month}-${year}`;
};

const HalfDaySection: React.FC<HalfDaySectionProps> = ({
  isHalfDay,
  defaultTimeZone,
}) => {
  const isClient = typeof window !== "undefined";
  const router = useRouter();
  const { initialPageLoadDone, loading } = useStore();
  const pathname = usePathname();

  const [isHalfDayState, setIsHalfDayState] = useState<boolean | null>(null);

  const toggleHalfDayMutation = useMutation(api.toggleHalfDay.toggleHalfDay);

  const simpleLogEntry = async (value: string) => {
    if (!isClient || !initialPageLoadDone) return;
    try {
      let date = pathname?.split("/").pop();
      if (date === "dashboard") {
        date = getCurrentDateInTimezone(defaultTimeZone);
      }

      const isMarkingHalfDay = value === "mark-as-half-day";

      useStore.setState(() => ({ loading: true }));
      await toggleHalfDayMutation({
        date: date,
        isHalfDay: isMarkingHalfDay,
      });
      setIsHalfDayState(isMarkingHalfDay);
      useStore.setState(() => ({ loading: false }));
    } catch (error) {
      handleError({ error: error, router: router });
    }
  };

  const isHalfDayActive = isHalfDayState !== null ? isHalfDayState : isHalfDay;

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-t-2xl border border-b-0 p-6 shadow-sm backdrop-blur-sm transition-all duration-500",
          isHalfDayActive
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 dark:border-emerald-800/50 dark:from-emerald-950/50 dark:to-green-900/30"
            : "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 dark:border-amber-800/50 dark:from-amber-950/50 dark:to-orange-900/30",
        )}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div
            className={cn(
              "absolute -top-4 -right-4 h-24 w-24 rounded-full",
              isHalfDayActive ? "bg-emerald-400" : "bg-amber-400",
            )}
          />
          <div
            className={cn(
              "absolute -bottom-6 -left-6 h-32 w-32 rounded-full",
              isHalfDayActive ? "bg-green-400" : "bg-orange-400",
            )}
          />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex flex-1 items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300",
                isHalfDayActive
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
              )}
            >
              {isHalfDayActive ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "mb-1 text-base leading-tight font-semibold",
                  isHalfDayActive
                    ? "text-emerald-800 dark:text-emerald-200"
                    : "text-amber-800 dark:text-amber-200",
                )}
              >
                {!isHalfDayActive ? "Half Day Option" : "Half Day Marked"}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isHalfDayActive
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-amber-700 dark:text-amber-300",
                )}
              >
                {!isHalfDayActive
                  ? "Mark this log as a half day if you worked reduced hours"
                  : "This log has been successfully marked as a half day"}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {!isHalfDayActive ? (
              <Button
                size="sm"
                onClick={() => simpleLogEntry("mark-as-half-day")}
                disabled={loading}
                className={cn(
                  "h-9 rounded-full px-4 py-2 font-medium transition-all duration-200 hover:scale-105",
                  "bg-amber-600 text-white shadow-md hover:bg-amber-700 hover:shadow-lg",
                  "dark:bg-amber-500 dark:hover:bg-amber-600",
                )}
              >
                Mark Half Day
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => simpleLogEntry("undo-half-day")}
                disabled={loading}
                className={cn(
                  "h-9 rounded-full px-4 py-2 font-medium transition-all duration-200 hover:scale-105",
                  "border-emerald-300 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50",
                  "dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20",
                )}
              >
                <Undo2 className="mr-1 h-3 w-3" />
                Undo
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes zoom-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoom-in {
          animation: zoom-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default HalfDaySection;
