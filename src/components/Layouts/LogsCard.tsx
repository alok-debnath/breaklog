'use client';
import { useStore } from '@/stores/store';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils';

import { LogsData } from '@/stores/store';
import { WorkData } from '@/stores/store';
import useWorkDataUpdater from '@/hooks/useWorkDataUpdater';
import HalfDaySection from './HelperUI/HalfDaySection';
import { Info } from 'lucide-react';

interface LogsCardProps {
  page?: string;
  isWorkDoneSuccess?: boolean;
  isIntersecting?: boolean;
  logsServer?: LogsData[];
  workDataServer?: WorkData;
}

const LogsCard: React.FC<LogsCardProps> = ({
  page,
  isWorkDoneSuccess,
  isIntersecting,
  logsServer,
  workDataServer,
}) => {
  const { breaklogMode, logs, workData, userData } = useStore();
  const isClient = typeof window !== 'undefined';

  const openTimeEditModal = (value: any) => {
    useStore.setState(() => ({
      logEditStore: value,
      isTimeEditModalOpen: true
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

  const dateToDisplay = (currentLogs.length > 0 && currentLogs[0].log_time)
    ? new Date(currentLogs[0].log_time)
    : new Date();

  return (
    <Card className={cn(
      "w-full max-w-lg mt-10",
      page === 'history' && (isWorkDoneSuccess ? 'border-green-500' : 'border-destructive')
    )}>
      {isHalfDay && <HalfDaySection isHalfDay={currentWorkData.isHalfDay} />}

      <CardHeader>
        <CardTitle>
          {dateToDisplay.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}, {' '}
          {dateToDisplay.toLocaleDateString('en-US', { weekday: 'long' })}
        </CardTitle>
        {page === 'history' && <CardDescription>Data from past</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Work Done</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn(
                "text-2xl font-bold",
                isWorkDoneSuccess && "text-green-500"
              )}>
                {workDone || '00:00:00'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Break Taken</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {currentWorkData.breakTime || '00:00:00'}
              </p>
            </CardContent>
          </Card>
        </div>

        {!breaklogMode && page !== 'history' && formattedWorkEndTime && (
          <Card className="p-4 mb-4">
            <div className='grid grid-cols-2 items-center text-center text-sm'>
              <div>
                <p className='font-medium text-muted-foreground'>Work until</p>
                <p className='font-mono font-semibold'>
                  {new Date(formattedWorkEndTime).toLocaleTimeString('en-US', { hour12: true })}
                </p>
              </div>
              <div>
                <p className='font-medium text-muted-foreground'>Work left</p>
                <p className='font-mono font-semibold'>
                  {formattedWorkLeft}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <p className='text-sm font-medium'>
                {currentLogs.length > 0
                  ? <>Recent log: <span className='font-bold text-primary'>{currentWorkData.lastLogStatus}</span></>
                  : <span className='text-muted-foreground'>No logs available</span>
                }
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLogs &&
                    [...currentLogs].reverse().map((log, index, array) => {
                      const log_time = new Date(log.log_time);
                      const utcFormattedDate = log_time.toLocaleString('en-US', {
                        timeZone: userData.default_time_zone || 'UTC',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      });

                      const logAbove = index > 0 ? array[index - 1] : null;
                      const logBelow = index < array.length - 1 ? array[index + 1] : null;

                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (page !== 'history') {
                                  openTimeEditModal({
                                    log_id: log.id,
                                    log_dateTime: log.log_time,
                                    log_dateTime_ahead: logAbove ? logAbove.log_time : '',
                                    log_dateTime_behind: logBelow ? logBelow.log_time : '',
                                  });
                                }
                              }}
                              className="font-mono"
                              disabled={page === 'history'}
                            >
                              {utcFormattedDate}
                              {page !== 'history' && <Info className="w-3 h-3 ml-2" />}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">{log.log_status}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LogsCard;
