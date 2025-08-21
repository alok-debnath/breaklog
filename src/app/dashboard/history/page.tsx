'use client';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useStore } from '@/stores/store';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className='from-background via-background/95 to-background/90 flex flex-col items-center justify-center bg-gradient-to-br p-4'>
      <div className='border-border/50 from-card/80 to-card/40 relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-gradient-to-br shadow-2xl backdrop-blur-xl'>
        <div className='from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent' />
        <div className='relative p-8'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 backdrop-blur-sm'>
              <svg
                className='h-6 w-6 text-blue-600 dark:text-blue-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h1 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-2xl font-bold'>
              Fetch required data
            </h1>
          </div>

          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <Select
              onValueChange={(value) => setSelectedMonth(Number(value))}
              defaultValue={selectedMonth.toString()}
            >
              <SelectTrigger className='bg-background/50 border-border/50 hover:bg-background/70 h-12 w-full rounded-xl backdrop-blur-sm transition-colors'>
                <SelectValue placeholder='Month' />
              </SelectTrigger>
              <SelectContent className='bg-popover/90 border-border/50 backdrop-blur-xl'>
                {months.map((month, index) => (
                  <SelectItem
                    key={index}
                    value={(index + 1).toString()}
                    className='hover:bg-accent/50'
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
              <SelectTrigger className='bg-background/50 border-border/50 hover:bg-background/70 h-12 w-full rounded-xl backdrop-blur-sm transition-colors'>
                <SelectValue placeholder='Year' />
              </SelectTrigger>
              <SelectContent className='bg-popover/90 border-border/50 backdrop-blur-xl'>
                {years.map((year, index) => (
                  <SelectItem
                    key={index}
                    value={year.toString()}
                    className='hover:bg-accent/50'
                  >
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
              className='from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover:shadow-primary/25 h-12 min-w-[120px] rounded-xl bg-gradient-to-r px-8 py-3 font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50'
            >
              {loading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>
      </div>

      {collapseBoxState && (
        <div className='border-border/50 from-card/80 to-card/40 relative mt-6 w-full max-w-2xl overflow-hidden rounded-3xl border bg-gradient-to-br shadow-2xl backdrop-blur-xl'>
          <div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent' />
          <div className='relative p-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-2 backdrop-blur-sm'>
                <svg
                  className='h-5 w-5 text-green-600 dark:text-green-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h2 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-semibold'>
                Summary
              </h2>
            </div>

            <div className='grid gap-4 text-sm'>
              <div className='from-background/60 to-background/40 border-border/30 flex items-center justify-between rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'>
                <p className='text-foreground/80 font-medium'>Work Required</p>
                <p className='text-primary text-lg font-bold'>
                  {summary.expectedWorkHours} hr
                </p>
              </div>
              <div className='from-background/60 to-background/40 border-border/30 flex items-center justify-between rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'>
                <p className='text-foreground/80 font-medium'>Work Done</p>
                <p
                  className={`text-lg font-bold ${summary.totalWorkDone >= summary.expectedWorkHours * 3600000 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {summary.formattedTotalWorkDone} hr
                </p>
              </div>
              <Separator className='bg-border/50' />
              <div className='from-background/60 to-background/40 border-border/30 flex items-center justify-between rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'>
                <p className='text-foreground/80 font-medium'>Days Logged</p>
                <p className='text-lg font-bold text-green-500'>
                  {summary.numberOfDays} day
                </p>
              </div>
              {summary.halfDayCount > 0 && (
                <div className='from-background/60 to-background/40 border-border/30 flex items-center justify-between rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'>
                  <p className='text-foreground/80 font-medium'>Half-Days</p>
                  <p className='text-lg font-bold text-orange-500'>
                    {summary.halfDayCount} Day
                  </p>
                </div>
              )}
              <div className='from-background/60 to-background/40 border-border/30 flex items-center justify-between rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'>
                <p className='text-foreground/80 font-medium'>Break Taken</p>
                <p className='text-lg font-bold text-blue-500'>
                  {summary.formattedTotalBreakTime} hr
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {collapseBoxState && monthLogs.length > 0 && (
        <div className='border-border/50 from-card/80 to-card/40 relative mt-6 w-full max-w-2xl overflow-hidden rounded-3xl border bg-gradient-to-br shadow-2xl backdrop-blur-xl'>
          <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent' />
          <div className='relative p-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 backdrop-blur-sm'>
                <svg
                  className='h-5 w-5 text-purple-600 dark:text-purple-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
              </div>
              <h2 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-semibold'>
                Logs
              </h2>
            </div>

            <TooltipProvider>
              <div className='border-border/30 bg-background/20 overflow-hidden rounded-xl border backdrop-blur-sm'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-border/30 hover:bg-muted/30'>
                      <TableHead className='font-semibold'>
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
                                  className='text-primary me-2 h-5 w-5'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                  />
                                </svg>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className='bg-popover/90 border-border/50 backdrop-blur-xl'>
                              <p>Click on any of the dates</p>
                            </TooltipContent>
                          </Tooltip>
                          Date
                        </span>
                      </TableHead>
                      <TableHead className='text-center font-semibold'>
                        Break
                      </TableHead>
                      <TableHead className='text-center font-semibold'>
                        Work
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...monthLogs].reverse().map((log, index) => {
                      return (
                        <TableRow
                          key={index}
                          className='border-border/30 hover:bg-muted/20 transition-colors'
                        >
                          <TableCell>
                            <Link href={`/dashboard/history/${log.date}`}>
                              <Button
                                variant={
                                  log.isHalfDay
                                    ? 'outline'
                                    : log.workDone >=
                                        userData.daily_work_required * 3600000
                                      ? 'default'
                                      : 'destructive'
                                }
                                size='sm'
                                className='w-full rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105'
                              >
                                {log.date}
                              </Button>
                            </Link>
                          </TableCell>
                          <TableCell className='text-center font-mono text-sm font-medium'>
                            {log.formattedBreakTime}
                          </TableCell>
                          <TableCell className='text-center font-mono text-sm font-medium'>
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
