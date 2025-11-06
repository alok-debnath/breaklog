"use client";
import {
  AlertCircle,
  Calendar,
  Clock,
  Coffee,
  Edit3,
  Info,
  Target,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useWorkDataUpdater from "@/hooks/useWorkDataUpdater";
import { cn } from "@/lib/utils";
import type { LogEditData, LogsData, WorkData } from "@/stores/store";
import { useStore } from "@/stores/store";
import HalfDaySection from "./HelperUI/HalfDaySection";

interface LogsCardProps {
  page?: string;
  isWorkDoneSuccess?: boolean;
  isIntersecting?: boolean;
  logsServer?: LogsData[];
  workDataServer?: WorkData;
  showAccordion?: boolean;
  logEntry?: (value: string) => void;
}

const LogsCard: React.FC<LogsCardProps> = ({
  page,
  isWorkDoneSuccess,
  isIntersecting,
  logsServer,
  workDataServer,
  showAccordion,
  logEntry,
}) => {
  const { breaklogMode, logs, workData, userData, loading } = useStore();
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined,
  );

  const openTimeEditModal = (value: LogEditData) => {
    useStore.setState(() => ({
      logEditStore: value,
      isTimeEditModalOpen: true,
    }));
  };

  const currentLogs = logsServer ?? logs;
  const currentWorkData = workDataServer ?? workData;

  const {
    workDone,
    unformattedWorkDone,
    formattedWorkLeft,
    formattedWorkEndTime,
  } = useWorkDataUpdater(currentWorkData);

  const isHalfDay =
    userData.daily_work_required &&
    currentWorkData.lastLogStatus === "day end" &&
    unformattedWorkDone >= (userData.daily_work_required * 3600000) / 2 &&
    unformattedWorkDone <= (userData.daily_work_required * 3600000 * 3) / 4;

  const dateToDisplay =
    currentLogs.length > 0 && currentLogs[0].log_time
      ? new Date(currentLogs[0].log_time)
      : new Date();

  return (
    <Card
      className={cn(
        "mx-auto mt-4 w-full max-w-lg min-w-full overflow-hidden transition-all duration-300 sm:min-w-[400px]",
        "from-card/95 to-card/80 border-0 bg-linear-to-br shadow-xl backdrop-blur-sm",
        page === "history" &&
          (isWorkDoneSuccess
            ? "ring-2 shadow-emerald-500/10 ring-emerald-500/20"
            : "ring-2 shadow-red-500/10 ring-red-500/20"),
      )}
    >
      {isHalfDay ? (
        <HalfDaySection
          isHalfDay={currentWorkData.isHalfDay}
          defaultTimeZone={userData.default_time_zone || "Etc/GMT"}
        />
      ) : (
        <></>
      )}

      <CardHeader className="">
        <div className="flex items-center gap-3">
          <div className="from-primary/10 to-primary/5 border-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl border bg-linear-to-br">
            <Calendar className="text-primary h-6 w-6" />
          </div>
          <div>
            <CardTitle className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-bold text-transparent">
              {dateToDisplay.toLocaleDateString("en-US", { weekday: "long" })}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {dateToDisplay.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Work Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group border-border/50 from-background/50 to-muted/30 relative overflow-hidden rounded-2xl border bg-linear-to-br p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Work Done
                </p>
              </div>
              <p
                className={cn(
                  "font-mono text-lg font-bold transition-colors duration-300",
                  isWorkDoneSuccess
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground",
                )}
              >
                {workDone || "00:00:00"}
              </p>
            </div>
          </div>

          <div className="group border-border/50 from-background/50 to-muted/30 relative overflow-hidden rounded-2xl border bg-linear-to-br p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <Coffee className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Break Taken
                </p>
              </div>
              <p className="text-foreground font-mono text-lg font-bold">
                {currentWorkData.breakTime || "00:00:00"}
              </p>
            </div>
          </div>
        </div>

        {/* Work Progress Info */}
        {!breaklogMode && page !== "history" && formattedWorkEndTime && (
          <div className="from-primary/5 to-primary/10 border-primary/10 relative overflow-hidden rounded-2xl border bg-linear-to-r p-4">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
            <div className="relative grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Target className="text-primary h-4 w-4" />
                  <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                    Work Until
                  </p>
                </div>
                <p className="text-foreground font-mono text-sm font-bold">
                  {new Date(formattedWorkEndTime).toLocaleTimeString("en-US", {
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="text-primary h-4 w-4" />
                  <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                    Work Left
                  </p>
                </div>
                <p className="text-foreground font-mono text-sm font-bold">
                  {formattedWorkLeft}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logs Section */}
        {showAccordion ? (
          <Accordion
            type="single"
            collapsible
            className="from-primary/5 to-primary/10 border-primary/10 w-full rounded-xl border bg-linear-to-r"
            value={accordionValue}
            onValueChange={setAccordionValue}
          >
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="group from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 rounded-2xl bg-linear-to-r px-4 py-3 text-sm font-semibold transition-all duration-300 hover:no-underline">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                    <Info className="text-primary h-3 w-3" />
                  </div>
                  {accordionValue !== "item-1" && currentLogs.length > 0 ? (
                    <p className="text-muted-foreground text-sm">
                      <span className="text-foreground font-semibold">
                        Recent log:
                      </span>{" "}
                      {currentLogs[currentLogs.length - 1].log_status}
                    </p>
                  ) : (
                    <>Activity Logs</>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-0">
                {currentLogs.length > 0 ? (
                  <div className="border-border/50 from-background/50 to-muted/20 overflow-hidden rounded-2xl border bg-linear-to-br">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 hover:bg-muted/30">
                          <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Time
                          </TableHead>
                          <TableHead className="text-muted-foreground text-right text-xs font-semibold tracking-wide uppercase">
                            Activity
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...currentLogs].reverse().map((log, index, array) => {
                          const log_time = new Date(log.log_time);
                          const utcFormattedDate = log_time.toLocaleString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                              month: "short",
                              day: "numeric",
                            },
                          );

                          const logAbove = index > 0 ? array[index - 1] : null;
                          const logBelow =
                            index < array.length - 1 ? array[index + 1] : null;

                          return (
                            <TableRow
                              key={log.id}
                              onClick={() => {
                                if (page !== "history") {
                                  openTimeEditModal({
                                    log_id: log.id,
                                    log_dateTime: log.log_time,
                                    log_dateTime_ahead: logAbove
                                      ? logAbove.log_time
                                      : null,
                                    log_dateTime_behind: logBelow
                                      ? logBelow.log_time
                                      : null,
                                  });
                                }
                              }}
                              className={cn(
                                "border-border/30 transition-all duration-200",
                                page !== "history" &&
                                  "hover:bg-muted/50 group cursor-pointer",
                              )}
                            >
                              <TableCell className="font-mono text-sm font-medium">
                                {utcFormattedDate}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-sm font-medium">
                                    {log.log_status}
                                  </span>
                                  {page !== "history" && (
                                    <Edit3 className="text-muted-foreground h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-muted-foreground from-muted/20 to-muted/10 border-muted-foreground/20 flex items-center justify-center rounded-2xl border border-dashed bg-linear-to-br p-8 text-sm">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    No logs to display.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                <Info className="text-primary h-3 w-3" />
              </div>
              <h3 className="text-foreground text-sm font-semibold">
                Activity Logs
              </h3>
            </div>
            {currentLogs.length > 0 ? (
              <div className="border-border/50 from-background/50 to-muted/20 overflow-hidden rounded-2xl border bg-linear-to-br">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-muted/30">
                      <TableHead className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        Time
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right text-xs font-semibold tracking-wide uppercase">
                        Activity
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...currentLogs].reverse().map((log, index, array) => {
                      const log_time = new Date(log.log_time);
                      const utcFormattedDate = log_time.toLocaleString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                          month: "short",
                          day: "numeric",
                        },
                      );

                      const logAbove = index > 0 ? array[index - 1] : null;
                      const logBelow =
                        index < array.length - 1 ? array[index + 1] : null;

                      return (
                        <TableRow
                          key={log.id}
                          onClick={() => {
                            if (page !== "history") {
                              openTimeEditModal({
                                log_id: log.id,
                                log_dateTime: log.log_time,
                                log_dateTime_ahead: logAbove
                                  ? logAbove.log_time
                                  : null,
                                log_dateTime_behind: logBelow
                                  ? logBelow.log_time
                                  : null,
                              });
                            }
                          }}
                          className={cn(
                            "border-border/30 transition-all duration-200",
                            page !== "history" &&
                              "hover:bg-muted/50 group cursor-pointer",
                          )}
                        >
                          <TableCell className="font-mono text-sm font-medium">
                            {utcFormattedDate}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-sm font-medium">
                                {log.log_status}
                              </span>
                              {page !== "history" && (
                                <Edit3 className="text-muted-foreground h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-muted-foreground from-muted/20 to-muted/10 border-muted-foreground/20 flex items-center justify-center rounded-2xl border border-dashed bg-linear-to-br p-8 text-sm">
                <AlertCircle className="mr-2 h-4 w-4" />
                No logs to display.
              </div>
            )}
          </div>
        )}
      </CardContent>

      {page !== "history" && (
        <CardFooter className="pt-2">
          <Button
            onClick={() => logEntry?.("day end")}
            variant="destructive"
            className="h-12 w-full rounded-2xl bg-linear-to-r from-red-500 to-red-600 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-red-600 hover:to-red-700 hover:shadow-xl"
            disabled={
              ["exit", null, "day end"].includes(workData.lastLogStatus) ||
              loading ||
              breaklogMode ||
              !isIntersecting
            }
          >
            End Day
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LogsCard;
