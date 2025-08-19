'use client';
import { useStore } from '@/stores/store';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { LogsData } from '@/stores/store';
import { WorkData } from '@/stores/store';
import useWorkDataUpdater from '@/hooks/useWorkDataUpdater';
import HalfDaySection from './HelperUI/HalfDaySection';
import { Info, AlertCircle } from 'lucide-react';

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

  const openTimeEditModal = (value: any) => {
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
    currentWorkData.lastLogStatus === 'day end' &&
    unformattedWorkDone >= (userData.daily_work_required * 3600000) / 2 &&
    unformattedWorkDone <= (userData.daily_work_required * 3600000 * 3) / 4;

  const dateToDisplay =
    currentLogs.length > 0 && currentLogs[0].log_time
      ? new Date(currentLogs[0].log_time)
      : new Date();

  return (
    <Card
      className={cn(
        'mx-auto mt-4 w-full max-w-lg min-w-full sm:min-w-[400px]',
        page === 'history' &&
          (isWorkDoneSuccess ? 'border-green-500' : 'border-destructive'),
      )}
    >
      {isHalfDay && <HalfDaySection isHalfDay={currentWorkData.isHalfDay} />}

      <CardHeader>
        <CardTitle className='text-xl'>
          {dateToDisplay.toLocaleDateString('en-US', { weekday: 'long' })}
        </CardTitle>
        <CardDescription>
          {dateToDisplay.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className='grid gap-4'>
        <div className='grid grid-cols-2 gap-4 text-center'>
          <div className='flex flex-col items-center justify-center space-y-1 rounded-md border p-3'>
            <p className='text-muted-foreground text-sm font-medium'>
              Work Done
            </p>
            <p
              className={cn(
                'font-mono text-lg font-bold',
                isWorkDoneSuccess && 'text-green-500',
              )}
            >
              {workDone || '00:00:00'}
            </p>
          </div>
          <div className='flex flex-col items-center justify-center space-y-1 rounded-md border p-3'>
            <p className='text-muted-foreground text-sm font-medium'>
              Break Taken
            </p>
            <p className='font-mono text-lg font-bold'>
              {currentWorkData.breakTime || '00:00:00'}
            </p>
          </div>
        </div>

        {!breaklogMode && page !== 'history' && formattedWorkEndTime && (
          <div className='bg-muted flex items-center justify-between rounded-md p-3 text-sm'>
            <div className='text-center'>
              <p className='text-muted-foreground font-medium'>Work until</p>
              <p className='font-mono font-semibold'>
                {new Date(formattedWorkEndTime).toLocaleTimeString('en-US', {
                  hour12: true,
                })}
              </p>
            </div>
            <div className='text-center'>
              <p className='text-muted-foreground font-medium'>Work left</p>
              <p className='font-mono font-semibold'>{formattedWorkLeft}</p>
            </div>
          </div>
        )}

        {showAccordion ? (
          <>
            <Accordion
              type='single'
              collapsible
              className='w-full'
              value={accordionValue}
              onValueChange={setAccordionValue}
            >
              <AccordionItem value='item-1'>
                <AccordionTrigger className='bg-muted rounded-md px-4 py-2 text-sm'>
                  Logs
                </AccordionTrigger>
                <AccordionContent>
                  {currentLogs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead className='text-right'>Activity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...currentLogs].reverse().map((log, index, array) => {
                          const log_time = new Date(log.log_time);
                          const utcFormattedDate = log_time.toLocaleString(
                            'en-US',
                            {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                              month: 'short',
                              day: 'numeric',
                            },
                          );

                          const logAbove = index > 0 ? array[index - 1] : null;
                          const logBelow =
                            index < array.length - 1 ? array[index + 1] : null;

                          return (
                            <TableRow
                              key={log.id}
                              onClick={() => {
                                if (page !== 'history') {
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
                                page !== 'history' && 'cursor-pointer',
                              )}
                            >
                              <TableCell className='font-mono'>
                                {utcFormattedDate}
                              </TableCell>
                              <TableCell className='text-right'>
                                {log.log_status}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className='text-muted-foreground flex items-center justify-center p-4 text-sm'>
                      <AlertCircle className='mr-2 h-4 w-4' />
                      No logs to display.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {accordionValue !== 'item-1' && currentLogs.length > 0 && (
              <div className='text-muted-foreground mt-2 text-center text-sm'>
                <strong>Recent log:</strong>{' '}
                {currentLogs[currentLogs.length - 1].log_status}
              </div>
            )}
          </>
        ) : (
          <div>
            <h3 className='mb-2 text-sm font-medium'>Logs</h3>
            {currentLogs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead className='text-right'>Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...currentLogs].reverse().map((log, index, array) => {
                    const log_time = new Date(log.log_time);
                    const utcFormattedDate = log_time.toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                      month: 'short',
                      day: 'numeric',
                    });

                    const logAbove = index > 0 ? array[index - 1] : null;
                    const logBelow =
                      index < array.length - 1 ? array[index + 1] : null;

                    return (
                      <TableRow
                        key={log.id}
                        onClick={() => {
                          if (page !== 'history') {
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
                        className={cn(page !== 'history' && 'cursor-pointer')}
                      >
                        <TableCell className='font-mono'>
                          {utcFormattedDate}
                        </TableCell>
                        <TableCell className='text-right'>
                          {log.log_status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className='text-muted-foreground flex items-center justify-center p-4 text-sm'>
                <AlertCircle className='mr-2 h-4 w-4' />
                No logs to display.
              </div>
            )}
          </div>
        )}
      </CardContent>
      {page !== 'history' && isIntersecting && (
        <CardFooter>
          <Button
            onClick={() => logEntry && logEntry('day end')}
            variant='destructive'
            className='w-full'
            disabled={
              ['exit', null, 'day end'].includes(workData.lastLogStatus) ||
              loading ||
              breaklogMode
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
