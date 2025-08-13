'use client';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useStore } from '@/stores/store';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const HistoryPage = () => {
  const { loading, monthLogs, summary, userData } = useStore();
  const [collapseBoxState, setCollapseBoxState] = useState(false);
  const router = useRouter();

  // Initialize selectedMonth and selectedYear with the current month and year.
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Months are zero-based, so add 1.
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = Array.from(
    { length: new Date().getFullYear() - 2022 },
    (_, index) => 2023 + index,
  );

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleSearch = async () => {
    if (
      userData.daily_work_required === 0 ||
      userData.daily_work_required === undefined ||
      userData.daily_work_required === null
    ) {
      handleError({
        error: {
          message: 'Please set required work hour from profile section',
        },
        router: router,
      });
      return;
    }

    const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;

    const monthStart =
      selectedYear +
      '-' +
      String(selectedMonth).padStart(2, '0') +
      '-01T00:00:00.000Z';
    const monthEnd =
      nextYear + '-' + String(nextMonth).padStart(2, '0') + '-01T00:00:00.000Z';

    try {
      // setCollapseBoxState(false);
      useStore.setState(() => ({ loading: true }));

      const values = {
        monthStart: monthStart,
        monthEnd: monthEnd,
      };

      const res = await axios.post(
        '/api/users/fetchlog/fetchdynamiclog',
        values,
      );

      if (res.data.status === 200) {
        setCollapseBoxState(true);

        useStore.setState(() => ({
          monthLogs: res.data.data,
          loading: false,
          summary: res.data.summary,
        }));
      } else {
        setCollapseBoxState(false);
        useStore.setState(() => ({ loading: false }));
        handleError({
          error: { message: res.data.status },
          router: router,
        });
      }
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  useEffect(() => {
    setCollapseBoxState(false);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (Number(summary.numberOfDays) > 0) {
      setCollapseBoxState(true);
    }
  }, [summary.numberOfDays]);

  return (
    <div className='bg-muted flex min-h-dvh flex-col items-center p-4'>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Fetch required data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row items-center gap-2'>
            <Select onValueChange={(value) => setSelectedMonth(Number(value))} defaultValue={selectedMonth.toString()}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setSelectedYear(Number(value))} defaultValue={selectedYear.toString()}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year, index) => (
                  <SelectItem key={index} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                handleSearch();
              }}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {collapseBoxState && (
        <Card className="mt-4 w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <p>Work Required</p>
              <p className="font-semibold">{summary.expectedWorkHours} hr</p>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <p>Work Done</p>
              <p className={`font-semibold ${summary.totalWorkDone >= summary.expectedWorkHours * 3600000 ? 'text-green-500' : 'text-red-500'}`}>
                {summary.formattedTotalWorkDone} hr
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <p>Days Logged</p>
              <p className="font-semibold text-green-500">{summary.numberOfDays} day</p>
            </div>
            {summary.halfDayCount > 0 && (
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <p>Half-Days</p>
                <p className="font-semibold">{summary.halfDayCount} Day</p>
              </div>
            )}
            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <p>Break Taken</p>
              <p className="font-semibold text-green-500">{summary.formattedTotalBreakTime} hr</p>
            </div>
          </CardContent>
        </Card>
      )}

      {collapseBoxState && monthLogs.length > 0 && (
        <Card className="mt-4 w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className='flex items-center'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className='cursor-pointer'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='text-warning me-1 h-6 w-6'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                />
                              </svg>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click on any of the dates</p>
                          </TooltipContent>
                        </Tooltip>
                        Date
                      </span>
                    </TableHead>
                    <TableHead className="text-center">Break</TableHead>
                    <TableHead className="text-center">Work</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthLogs.reverse().map((log, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Link
                              href={`/dashboard/history/${log.date}`}
                            >
                              <Button
                                variant={
                                  log.isHalfDay
                                    ? 'outline'
                                    : log.workDone >=
                                      userData.daily_work_required *
                                      3600000
                                      ? 'default'
                                      : 'destructive'
                                }
                                size="sm"
                                className="w-full text-xs font-bold"
                              >
                                {log.date}
                              </Button>
                            </Link>
                          </TableCell>
                          <TableCell className="text-center font-mono">{log.formattedBreakTime}</TableCell>
                          <TableCell className="text-center font-mono">{log.formattedWorkDone}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TooltipProvider>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoryPage;
