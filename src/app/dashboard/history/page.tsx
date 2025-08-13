'use client';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useStore } from '@/stores/store';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '@/components/UI/Button';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    <>
      <div className='bg-muted flex min-h-dvh min-w-fit place-items-center justify-center'>
        <div className='text-center'>
          <div className='max-w-md'>
            <Card className="my-20 shadow-xl">
              <CardHeader>
                <CardTitle>Fetch required data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='mt-5 mb-2'>
                  <div className='flex gap-2'>
                    <Select onValueChange={(value) => setSelectedMonth(Number(value))} defaultValue={selectedMonth.toString()}>
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                  </div>
                  <div className='mt-3'>
                    <Button
                      onClick={() => {
                        handleSearch();
                      }}
                      disabled={loading}
                    >
                      Search{' '}
                      {loading && (
                        <span className='loading loading-ring loading-md'></span>
                      )}
                    </Button>
                  </div>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Summary</AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent className="py-5 text-sm">
                          <p>
                            Work Required:{' '}
                            <span className='font-semibold'>
                              {summary.expectedWorkHours}
                            </span>{' '}
                            hr
                          </p>
                          <p>
                            Work Done:{' '}
                            <span
                              className={`font-semibold ${
                                summary.totalWorkDone >=
                                summary.expectedWorkHours * 3600000
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {summary.formattedTotalWorkDone}
                            </span>{' '}
                            hr
                          </p>
                          <div className='divider my-1'></div>
                          <p>
                            Days Logged:{' '}
                            <span className='text-green-500 font-semibold'>
                              {summary.numberOfDays}
                            </span>{' '}
                            day
                          </p>
                          {summary.halfDayCount > 0 && (
                            <div>
                              <p className='inline-block border border-dashed border-gray-400 rounded-lg px-2 py-1'>
                              Half-Days:{' '}
                              <span className='font-semibold'>
                                {summary.halfDayCount}
                              </span>{' '}
                              Day
                              </p>
                            </div>
                          )}
                          <p>
                            Break Taken:{' '}
                            <span className='text-green-500 font-semibold'>
                              {summary.formattedTotalBreakTime}
                            </span>{' '}
                            hr
                          </p>
                        </CardContent>
                      </Card>
                      <table className='table-xs md:table-md mt-3 table w-full table-fixed text-center'>
                        <thead>
                          <tr>
                            <th>
                              <span className='flex items-center'>
                                <span
                                  className='tooltip tooltip-right cursor-pointer'
                                  data-tip='Click on any of the dates'
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='text-warning me-1 h-6 w-6'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                    />
                                  </svg>
                                </span>
                                Date
                              </span>
                            </th>
                            <th>
                              Break
                              <br />
                              hh:mm:ss
                            </th>
                            <th>
                              Work
                              <br />
                              hh:mm:ss
                            </th>
                          </tr>
                        </thead>
                        <tbody className='text-center'>
                          {monthLogs &&
                            [...monthLogs].reverse().map((log, index) => {
                              return (
                                <tr key={index}>
                                  <td>
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
                                        className="min-w-full text-xs font-bold"
                                      >
                                        {log.date}
                                      </Button>
                                    </Link>
                                  </td>
                                  <td>{log.formattedBreakTime}</td>
                                  <td>{log.formattedWorkDone}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
