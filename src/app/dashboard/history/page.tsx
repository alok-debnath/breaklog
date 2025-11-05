"use client";
import { useQuery } from "convex/react";
import { BarChart3, FileText, Info, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleError } from "@/components/common/CommonCodeBlocks";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from "@/stores/store";
import { api } from "../../../../convex/_generated/api";

interface ConvexSummary {
  totalWorkDone: number;
  formattedTotalBreakTime: string;
  formattedTotalWorkDone: string;
  numberOfDays: number;
  expectedWorkHours: number;
  halfDayCount: number;
}

// Constants
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 2022 },
  (_, index) => 2023 + index,
);

// Helper functions
const formatDateRange = (year: number, month: number) => {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const monthStart = `${year}-${String(month).padStart(
    2,
    "0",
  )}-01T00:00:00.000Z`;
  const monthEnd = `${nextYear}-${String(nextMonth).padStart(
    2,
    "0",
  )}-01T00:00:00.000Z`;

  return { monthStart, monthEnd };
};

const transformMonthLogs = (
  data: {
    date: string;
    formattedBreakTime: string;
    workDone: number;
    formattedWorkDone: string;
    isHalfDay: boolean;
  }[],
) => {
  return (
    data?.map((log) => ({
      date: log.date,
      breakTime: log.formattedBreakTime
        .split(":")
        .reduce(
          (acc: number, val: string, idx: number) =>
            acc + parseInt(val) * [3600000, 60000, 1000][idx],
          0,
        ),
      workDone: log.workDone,
      formattedBreakTime: log.formattedBreakTime,
      formattedWorkDone: log.formattedWorkDone,
      isHalfDay: log.isHalfDay,
    })) || []
  );
};

const createDefaultSummary = () => ({
  expectedWorkHours: 0,
  totalWorkDone: 0,
  formattedTotalWorkDone: "",
  numberOfDays: "",
  halfDayCount: 0,
  formattedTotalBreakTime: "",
});

const SummaryCard = ({
  label,
  value,
  color = "text-primary",
}: {
  label: string;
  value: string | number;
  color?: string;
}) => (
  <div className="from-background/60 to-background/40 border-border/30 flex items-center justify-between rounded-xl border bg-linear-to-r p-4 backdrop-blur-sm">
    <p className="text-foreground/80 font-medium">{label}</p>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

const HistoryPage = () => {
  const { loading, monthLogs, summary, userData } = useStore();
  const [collapseBoxState, setCollapseBoxState] = useState(false);
  const router = useRouter();

  // Initialize selectedMonth and selectedYear with the current month and year.
  const [selectedMonth, setSelectedMonth] = useState(
    () => new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  );
  const [queryArgs, setQueryArgs] = useState<
    { monthStart: string; monthEnd: string } | "skip"
  >("skip");

  // Memoized date calculations
  const { monthStart, monthEnd } = useMemo(
    () => formatDateRange(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  );

  const fetchMonthlyLogs = useQuery(api.fetchLogs.fetchMonthlyLogs, queryArgs);

  // Memoized data transformation
  const transformedData = useMemo(() => {
    if (!fetchMonthlyLogs)
      return { monthLogs: [], summary: createDefaultSummary() };

    const transformedMonthLogs = transformMonthLogs(
      fetchMonthlyLogs.data || [],
    );

    const summaryData =
      (fetchMonthlyLogs.summary as ConvexSummary)?.expectedWorkHours !==
      undefined
        ? {
            ...(fetchMonthlyLogs.summary as ConvexSummary),
            numberOfDays: (
              fetchMonthlyLogs.summary as ConvexSummary
            ).numberOfDays.toString(),
          }
        : createDefaultSummary();

    return { monthLogs: transformedMonthLogs, summary: summaryData };
  }, [fetchMonthlyLogs]);

  // Update store when query result changes
  useEffect(() => {
    useStore.setState({
      monthLogs: transformedData.monthLogs,
      summary: transformedData.summary,
    });
    useStore.setState({ loading: false });
  }, [transformedData]);

  // Show toast for no logs found
  useEffect(() => {
    if (fetchMonthlyLogs && fetchMonthlyLogs.status === 404) {
      handleError({ error: { message: fetchMonthlyLogs.message } });
    }
  }, [fetchMonthlyLogs]);

  const handleSearch = useCallback(() => {
    useStore.setState({ loading: true });
    if (!userData.daily_work_required) {
      handleError({
        error: {
          message: "Please set required work hour from profile section",
        },
        router,
      });
      useStore.setState({ loading: false });
      return;
    }

    setQueryArgs({ monthStart, monthEnd });
  }, [userData.daily_work_required, router, monthStart, monthEnd]);

  // Reset state when selectors change
  useEffect(() => {
    setCollapseBoxState(false);
    setQueryArgs("skip");
  }, [selectedMonth, selectedYear]);

  // Auto-show results if data exists
  useEffect(() => {
    if (Number(summary.numberOfDays) > 0) {
      setCollapseBoxState(true);
    }
  }, [summary.numberOfDays]);

  return (
    <div className="from-background via-background/95 to-background/90 bg-linear-to-br p-4">
      <div className="border-border/50 from-card/80 to-card/40 relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-linear-to-br shadow-2xl backdrop-blur-xl">
        <div className="from-primary/5 absolute inset-0 bg-linear-to-br to-transparent" />
        <div className="relative p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-2xl font-bold">
              Fetch required data
            </h1>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Select
              onValueChange={(value) => setSelectedMonth(Number(value))}
              defaultValue={selectedMonth.toString()}
            >
              <SelectTrigger className="bg-background/50 border-border/50 hover:bg-background/70 h-12 w-full rounded-xl backdrop-blur-sm transition-colors">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-popover/90 border-border/50 backdrop-blur-xl">
                {MONTHS.map((month, index) => (
                  <SelectItem
                    key={month}
                    value={(index + 1).toString()}
                    className="hover:bg-accent/50"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setSelectedYear(Number(value))}
              defaultValue={selectedYear.toString()}
            >
              <SelectTrigger className="bg-background/50 border-border/50 hover:bg-background/70 h-12 w-full rounded-xl backdrop-blur-sm transition-colors">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-popover/90 border-border/50 backdrop-blur-xl">
                {YEARS.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="hover:bg-accent/50"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              disabled={loading || collapseBoxState}
              className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 h-12 min-w-[120px] rounded-xl bg-linear-to-r px-8 py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2" />
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>
      </div>

      {collapseBoxState && (
        <div className="border-border/50 from-card/80 to-card/40 relative mt-6 w-full max-w-2xl overflow-hidden rounded-3xl border bg-linear-to-br shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent" />
          <div className="relative p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 p-2 backdrop-blur-sm">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-semibold">
                Summary
              </h2>
            </div>

            <div className="grid gap-4 text-sm">
              <SummaryCard
                label="Work Required"
                value={`${summary.expectedWorkHours} hr`}
              />
              <SummaryCard
                label="Work Done"
                value={`${summary.formattedTotalWorkDone} hr`}
                color={
                  summary.totalWorkDone >= summary.expectedWorkHours * 3600000
                    ? "text-green-500"
                    : "text-red-500"
                }
              />
              <Separator className="bg-border/50" />
              <SummaryCard
                label="Days Logged"
                value={`${summary.numberOfDays} day`}
                color="text-green-500"
              />
              {summary.halfDayCount > 0 && (
                <SummaryCard
                  label="Half-Days"
                  value={`${summary.halfDayCount} Day`}
                  color="text-orange-500"
                />
              )}
              <SummaryCard
                label="Break Taken"
                value={`${summary.formattedTotalBreakTime} hr`}
                color="text-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {collapseBoxState && monthLogs.length > 0 && (
        <div className="border-border/50 from-card/80 to-card/40 relative mt-6 w-full max-w-2xl overflow-hidden rounded-3xl border bg-linear-to-br shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent" />
          <div className="relative p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 p-2 backdrop-blur-sm">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-xl font-semibold">
                Logs
              </h2>
            </div>

            <TooltipProvider>
              <div className="border-border/30 bg-background/20 overflow-hidden rounded-xl border backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">
                        <span className="flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-pointer">
                                <Info className="text-primary me-2 h-5 w-5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover/90 border-border/50 backdrop-blur-xl">
                              <p>Click on any of the dates</p>
                            </TooltipContent>
                          </Tooltip>
                          Date
                        </span>
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Break
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Work
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...monthLogs].reverse().map((log) => {
                      return (
                        <TableRow
                          key={log.date}
                          className="border-border/30 hover:bg-muted/20 transition-colors"
                        >
                          <TableCell>
                            <Link href={`/dashboard/history/${log.date}`}>
                              <Button
                                variant={
                                  log.isHalfDay
                                    ? "outline"
                                    : log.workDone >=
                                        (userData.daily_work_required ?? 0) *
                                          3600000
                                      ? "default"
                                      : "destructive"
                                }
                                size="sm"
                                className="w-full rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105"
                              >
                                {log.date}
                              </Button>
                            </Link>
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm font-medium">
                            {log.formattedBreakTime}
                          </TableCell>
                          <TableCell className="text-center font-mono text-sm font-medium">
                            {log.formattedWorkDone}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
