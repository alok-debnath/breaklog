'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useStore } from '@/stores/store';
import Button from "@/components/UI/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { handleError } from '../../common/CommonCodeBlocks';
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { saveFetchedLogsToStore } from '@/utils/saveFetchedLogsToStore';

const TimeEditModal: React.FC = () => {
  const { loading, logEditStore, isTimeEditModalOpen } = useStore();
  const [localTime, setLocalTime] = useState({
    hour: 0,
    minute: 0,
    period: 'AM',
  });
  const [limit, setLimit] = useState({
    max: {
      hour: 0,
      minute: 0,
      period: 'AM',
    },
    min: {
      hour: 0,
      minute: 0,
      period: 'AM',
    },
  });

  // Get the user's local timezone
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const parseTimeString = (timeString: string) => {
    const [hour, minute, period] = timeString.split(/:|\s/);

    return {
      hour: Number(hour),
      minute: Number(minute),
      period: period || 'AM',
    };
  };

  useEffect(() => {
    const updateLocalTime = () => {
      if (!logEditStore.log_dateTime) return;
      const updatedLocalTime = new Date(
        logEditStore.log_dateTime,
      ).toLocaleString('en-US', {
        timeZone: localTimeZone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const [hour, minute, period] = updatedLocalTime.split(/:|\s/);

      setLocalTime({
        hour: Number(hour),
        minute: Number(minute),
        period: period || 'AM',
      });

      const minLimit = logEditStore.log_dateTime_behind
        ? parseTimeString(
          new Date(logEditStore.log_dateTime_behind).toLocaleString('en-US', {
            timeZone: localTimeZone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
        )
        : { hour: 5, minute: 31, period: 'AM' };

      const maxLimit = logEditStore.log_dateTime_ahead
        ? parseTimeString(
          new Date(logEditStore.log_dateTime_ahead).toLocaleString('en-US', {
            timeZone: localTimeZone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
        )
        : { hour: 11, minute: 59, period: 'PM' };

      setLimit({ min: minLimit, max: maxLimit });
    };

    updateLocalTime();
  }, [
    logEditStore,
    localTimeZone
  ]);

  const logEdit = async (data: {
    hour: number;
    minute: number;
    period: string;
  }) => {
    const originalDateTime = new Date(logEditStore.log_dateTime);

    // Format the original date in the user's local timezone
    const formattedOriginalDateTime = originalDateTime.toLocaleString('en-US', {
      timeZone: localTimeZone,
    });

    // Parse the formatted date to get a Date object in the local timezone
    const localDateTime = new Date(formattedOriginalDateTime);
    localDateTime.setMinutes(data.minute);

    if (data.period === 'PM' && data.hour < 12) {
      localDateTime.setHours(data.hour + 12);
    } else if (data.period === 'AM' && data.hour === 12) {
      localDateTime.setHours(0);
    } else {
      localDateTime.setHours(data.hour);
    }

    // Ensure the updated time is in the correct day
    if (localDateTime < originalDateTime) {
      localDateTime.setDate(originalDateTime.getDate());
    }

    // Convert the localDateTime to a string in ISO format (UTC)
    const updatedDateTimeUTC = localDateTime.toISOString();

    const values = {
      log_id: logEditStore.log_id,
      log_dateTime: updatedDateTimeUTC,
    };

    try {
      useStore.setState(() => ({ loading: true }));
      const res = await axios.post('/api/users/logedit', values);
      saveFetchedLogsToStore(res.data.fetchedLog);
    } catch (error: any) {
      handleError({ error: error, router: null });
    }
    closeModal();
  };

  const formik = useFormik({
    initialValues: {
      hour: localTime.hour,
      minute: localTime.minute,
      period: localTime.period,
    },
    validationSchema: Yup.object({
      hour: Yup.number()
        .when(['period'], ([period], schema) => {
          if (period === limit.min.period) {
            if (limit.min.period === limit.max.period) {
              return schema.min(limit.min.hour).max(limit.max.hour);
            }
            return schema.min(limit.min.hour).max(11);
          } else if (period === limit.max.period) {
            if (limit.min.period === limit.max.period) {
              return schema.max(limit.max.hour).min(limit.min.hour);
            }
            return schema.max(limit.max.hour).min(1);
          } else {
            return schema.min(limit.min.hour).max(limit.max.hour);
          }
        })
        .required('Hour is required'),
      minute: Yup.number()
        .when(['hour', 'period'], ([hour, period], schema) => {
          if (hour === limit.min.hour && period === limit.min.period) {
            if (limit.min.hour === limit.max.hour) {
              return schema.min(limit.min.minute).max(limit.max.minute);
            }
            return schema.min(limit.min.minute).max(59);
          } else if (hour === limit.max.hour && period === limit.max.period) {
            if (limit.min.hour === limit.max.hour) {
              return schema.max(limit.max.minute).min(limit.min.minute);
            }
            return schema.max(limit.max.minute).min(0);
          } else {
            return schema.min(0).max(59);
          }
        })
        .required('Minute is required'),
      period: Yup.string()
        .oneOf([limit.min.period, limit.max.period])
        .required('Period is required'),
    }),
    onSubmit: logEdit,
    enableReinitialize: true,
  });

  const closeModal = () => {
    useStore.setState(() => ({
      isTimeEditModalOpen: false,
      logEditStore: {
        log_id: '',
        log_dateTime: '',
        log_dateTime_ahead: '',
        log_dateTime_behind: '',
      },
    }));
  };

  return (
    <Dialog open={isTimeEditModalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Time</DialogTitle>
          <DialogDescription>
            {`${limit.min.hour < 10 ? '0' : ''}${limit.min.hour}:${limit.min.minute < 10 ? '0' : ''}${limit.min.minute} ${limit.min.period} - ${limit.max.hour < 10 ? '0' : ''}${limit.max.hour}:${limit.max.minute < 10 ? '0' : ''}${limit.max.minute} ${limit.max.period}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hour" className="text-right">
                Hour
              </Label>
              <Input
                id="hour"
                name="hour"
                type="number"
                value={formik.values.hour || 0}
                onChange={formik.handleChange}
                className="col-span-3"
              />
              {formik.errors.hour && (
                <div className='error text-red-500 col-span-4'>{formik.errors.hour}</div>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minute" className="text-right">
                Minute
              </Label>
              <Input
                id="minute"
                name="minute"
                type="number"
                value={formik.values.minute || 0}
                onChange={formik.handleChange}
                className="col-span-3"
              />
              {formik.errors.minute && (
                <div className='error text-red-500 col-span-4'>{formik.errors.minute}</div>
              )}
            </div>
            <div className='join join-horizontal flex'>
              {(limit.min.period === 'AM' && limit.max.period === 'PM') ||
                (limit.min.period === 'PM' && limit.max.period === 'AM') ? (
                <>
                  <Button
                    variant={formik.values.period === 'AM' ? 'default' : 'outline'}
                    onClick={() => formik.setFieldValue('period', 'AM')}
                    className="flex-1"
                  >
                    AM
                  </Button>
                  <Button
                    variant={formik.values.period === 'PM' ? 'default' : 'outline'}
                    onClick={() => formik.setFieldValue('period', 'PM')}
                    className="flex-1"
                  >
                    PM
                  </Button>
                </>
              ) : (
                <Button
                  variant={formik.values.period === limit.min.period ? 'default' : 'outline'}
                  onClick={() =>
                    formik.setFieldValue('period', limit.min.period)
                  }
                  className="flex-1"
                >
                  {limit.min.period}
                </Button>
              )}
            </div>
            {formik.errors.period && (
              <div className='error text-red-500'>{formik.errors.period}</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={closeModal} variant="outline">Close</Button>
            <Button type="submit" disabled={!formik.isValid}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeEditModal;
