'use client';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription as DrawerDescriptionComponent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle as DrawerTitleComponent,
} from '@/components/ui/drawer';
import { useStore } from '@/stores/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { handleError } from '../../common/CommonCodeBlocks';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { saveFetchedLogsToStore } from '@/utils/saveFetchedLogsToStore';
import { Clock, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

type TimeEditFormProps = {
  closeModal: () => void;
  limit: {
    max: { hour: number; minute: number; period: string };
    min: { hour: number; minute: number; period: string };
  };
  localTime: { hour: number; minute: number; period: string };
  localTimeZone: string;
  isDesktop: boolean;
};

const TimeEditForm = ({
  closeModal,
  limit,
  localTime,
  localTimeZone,
  isDesktop,
}: TimeEditFormProps) => {
  const { loading, logEditStore } = useStore();

  const logEdit = async (data: {
    hour: number;
    minute: number;
    period: string;
  }) => {
    const originalDateTime = new Date(logEditStore.log_dateTime);

    const formattedOriginalDateTime = originalDateTime.toLocaleString('en-US', {
      timeZone: localTimeZone,
    });

    const localDateTime = new Date(formattedOriginalDateTime);
    localDateTime.setMinutes(data.minute);

    if (data.period === 'PM' && data.hour < 12) {
      localDateTime.setHours(data.hour + 12);
    } else if (data.period === 'AM' && data.hour === 12) {
      localDateTime.setHours(0);
    } else {
      localDateTime.setHours(data.hour);
    }

    if (localDateTime < originalDateTime) {
      localDateTime.setDate(originalDateTime.getDate());
    }

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

  const Footer = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={cn('space-y-6', !isDesktop && 'px-4')}
    >
      <div className='space-y-4'>
        {/* Hour Input */}
        <div className='space-y-2'>
          <Label
            htmlFor='hour'
            className='text-foreground flex items-center gap-2 text-sm font-semibold'
          >
            <div className='bg-primary h-2 w-2 rounded-full' />
            Hour
          </Label>
          <Input
            id='hour'
            name='hour'
            type='number'
            value={formik.values.hour || 0}
            onChange={formik.handleChange}
            className={cn(
              'border-border/50 from-background/50 to-muted/20 h-12 rounded-xl bg-gradient-to-r font-mono text-lg transition-all duration-200',
              'focus:ring-primary/20 focus:border-primary/50 focus:ring-2',
              formik.errors.hour &&
                'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
            )}
          />
          {formik.errors.hour && (
            <p className='px-2 text-xs font-medium text-red-500'>
              {formik.errors.hour}
            </p>
          )}
        </div>

        {/* Minute Input */}
        <div className='space-y-2'>
          <Label
            htmlFor='minute'
            className='text-foreground flex items-center gap-2 text-sm font-semibold'
          >
            <div className='bg-primary h-2 w-2 rounded-full' />
            Minute
          </Label>
          <Input
            id='minute'
            name='minute'
            type='number'
            value={formik.values.minute || 0}
            onChange={formik.handleChange}
            className={cn(
              'border-border/50 from-background/50 to-muted/20 h-12 rounded-xl bg-gradient-to-r font-mono text-lg transition-all duration-200',
              'focus:ring-primary/20 focus:border-primary/50 focus:ring-2',
              formik.errors.minute &&
                'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
            )}
          />
          {formik.errors.minute && (
            <p className='px-2 text-xs font-medium text-red-500'>
              {formik.errors.minute}
            </p>
          )}
        </div>

        {/* Period Selection */}
        <div className='space-y-2'>
          <Label className='text-foreground flex items-center gap-2 text-sm font-semibold'>
            <div className='bg-primary h-2 w-2 rounded-full' />
            Period
          </Label>
          <div className='flex gap-2'>
            {(limit.min.period === 'AM' && limit.max.period === 'PM') ||
            (limit.min.period === 'PM' && limit.max.period === 'AM') ? (
              <>
                <Button
                  type='button'
                  variant={
                    formik.values.period === 'AM' ? 'default' : 'outline'
                  }
                  onClick={() => formik.setFieldValue('period', 'AM')}
                  className={cn(
                    'h-12 flex-1 rounded-xl font-semibold transition-all duration-200',
                    formik.values.period === 'AM'
                      ? 'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-gradient-to-r shadow-lg'
                      : 'border-border/50 hover:bg-muted/50',
                  )}
                >
                  AM
                </Button>
                <Button
                  type='button'
                  variant={
                    formik.values.period === 'PM' ? 'default' : 'outline'
                  }
                  onClick={() => formik.setFieldValue('period', 'PM')}
                  className={cn(
                    'h-12 flex-1 rounded-xl font-semibold transition-all duration-200',
                    formik.values.period === 'PM'
                      ? 'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-gradient-to-r shadow-lg'
                      : 'border-border/50 hover:bg-muted/50',
                  )}
                >
                  PM
                </Button>
              </>
            ) : (
              <Button
                type='button'
                variant={
                  formik.values.period === limit.min.period
                    ? 'default'
                    : 'outline'
                }
                onClick={() => formik.setFieldValue('period', limit.min.period)}
                className={cn(
                  'h-12 flex-1 rounded-xl font-semibold transition-all duration-200',
                  formik.values.period === limit.min.period
                    ? 'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-gradient-to-r shadow-lg'
                    : 'border-border/50 hover:bg-muted/50',
                )}
              >
                {limit.min.period}
              </Button>
            )}
          </div>
          {formik.errors.period && (
            <p className='px-2 text-xs font-medium text-red-500'>
              {formik.errors.period}
            </p>
          )}
        </div>
      </div>

      <Footer className='gap-3 pt-2'>
        <Button
          type='button'
          onClick={closeModal}
          variant='outline'
          className='border-border/50 hover:bg-muted/50 h-12 flex-1 rounded-xl font-semibold transition-all duration-200'
        >
          <X className='mr-2 h-4 w-4' />
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={!formik.isValid || loading}
          className='from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-12 flex-1 rounded-xl bg-gradient-to-r font-semibold shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50'
        >
          <Save className='mr-2 h-4 w-4' />
          Save Changes
        </Button>
      </Footer>
    </form>
  );
};

const TimeEditModal: React.FC = () => {
  const { logEditStore, isTimeEditModalOpen } = useStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
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
  }, [logEditStore, localTimeZone]);

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

  const Header = isDesktop ? DialogHeader : DrawerHeader;
  const Title = isDesktop ? DialogTitle : DrawerTitleComponent;
  const Description = isDesktop
    ? DialogDescription
    : DrawerDescriptionComponent;

  const headerContent = (
    <Header className='space-y-3 pb-2 text-center'>
      <div className='from-primary/10 to-primary/5 border-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-br'>
        <Clock className='text-primary h-6 w-6' />
      </div>
      <Title className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent'>
        Edit Time
      </Title>
      <Description className='from-muted/50 to-muted/30 border-muted-foreground/10 rounded-xl border bg-gradient-to-r px-4 py-2 text-sm font-medium'>
        {`${limit.min.hour < 10 ? '0' : ''}${limit.min.hour}:${
          limit.min.minute < 10 ? '0' : ''
        }${limit.min.minute} ${limit.min.period} - ${
          limit.max.hour < 10 ? '0' : ''
        }${limit.max.hour}:${limit.max.minute < 10 ? '0' : ''}${
          limit.max.minute
        } ${limit.max.period}`}
      </Description>
    </Header>
  );

  if (isDesktop) {
    return (
      <Dialog open={isTimeEditModalOpen} onOpenChange={closeModal}>
        <DialogContent className='from-background/95 to-background/80 rounded-3xl border-0 bg-gradient-to-br shadow-2xl backdrop-blur-xl sm:max-w-md'>
          {headerContent}
          <TimeEditForm
            closeModal={closeModal}
            limit={limit}
            localTime={localTime}
            localTimeZone={localTimeZone}
            isDesktop={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isTimeEditModalOpen} onOpenChange={closeModal}>
      <DrawerContent>
        {headerContent}
        <TimeEditForm
          closeModal={closeModal}
          limit={limit}
          localTime={localTime}
          localTimeZone={localTimeZone}
          isDesktop={false}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default TimeEditModal;
