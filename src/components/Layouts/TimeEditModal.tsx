import { useStore } from '@/stores/store';
import axios from 'axios';
import { handleError } from '../common/CommonCodeBlocks';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

declare global {
  interface Window {
    time_edit_modal: {
      showModal: () => void;
      close: () => void;
    };
  }
}
interface TimeEditModalProps {
  fetchLogFunction: Function;
}

const TimeEditModal: React.FC<TimeEditModalProps> = ({ fetchLogFunction }) => {
  const { loading, logEditStore } = useStore();
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
  }, [logEditStore.log_dateTime]);

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
      fetchLogFunction();
    } catch (error: any) {
      handleError({ error: error, router: null });
    }
    window.time_edit_modal.close();
  };

  const formik = useFormik({
    initialValues: {
      hour: localTime.hour,
      minute: localTime.minute,
      period: localTime.period,
    },
    validationSchema: Yup.object({
      hour: Yup.number()
        // .min(limit.min.hour)
        // .max(limit.max.hour)
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
    window.time_edit_modal.close();
    useStore.setState(() => ({
      logEditStore: {
        log_id: '',
        log_dateTime: '',
        log_dateTime_ahead: '',
        log_dateTime_behind: '',
      },
    }));
  };
  return (
    <>
      <dialog
        id='time_edit_modal'
        className='modal modal-bottom sm:modal-middle'
      >
        <form method='dialog' className='modal-box'>
          {/* <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> */}
          <h3 className='text-center text-lg font-bold'>Edit Time</h3>
          <div className='flex items-center'>
            <div className='divider flex-1'></div>
            <p className='mx-4'>
              {`${limit.min.hour < 10 ? '0' : ''}${limit.min.hour}:${limit.min.minute < 10 ? '0' : ''}${limit.min.minute} ${limit.min.period} - ${limit.max.hour < 10 ? '0' : ''}${limit.max.hour}:${limit.max.minute < 10 ? '0' : ''}${limit.max.minute} ${limit.max.period}`}
            </p>
            <div className='divider flex-1'></div>
          </div>
          <div className='card form-control grid gap-y-5 p-5'>
            <div>
              <p className='label-text'>Hour</p>
              <div className='flex w-full'>
                <input
                  className='input input-bordered flex-1'
                  type='number'
                  id='hour'
                  name='hour'
                  value={formik.values.hour}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.errors.hour && (
                <div className='error text-red-500'>{formik.errors.hour}</div>
              )}
            </div>
            <div>
              <p className='label-text'>Minute</p>
              <div className='join flex w-full'>
                <input
                  className='input join-item input-bordered flex-1'
                  type='number'
                  id='minute'
                  name='minute'
                  value={formik.values.minute}
                  onChange={formik.handleChange}
                />
                {/* <p className='btn input-bordered join-item no-animation flex-1'>Search</p> */}
              </div>
              {formik.errors.minute && (
                <div className='error text-red-500'>{formik.errors.minute}</div>
              )}
            </div>
            <div className='join join-horizontal flex'>
              {(limit.min.period === 'AM' && limit.max.period === 'PM') ||
              (limit.min.period === 'PM' && limit.max.period === 'AM') ? (
                <>
                  <span
                    className={`btn join-item btn-sm flex-1 ${
                      formik.values.period === 'AM' ? 'btn-primary' : ''
                    }`}
                    onClick={() => formik.setFieldValue('period', 'AM')}
                  >
                    AM
                  </span>
                  <span
                    className={`btn join-item btn-sm flex-1 ${
                      formik.values.period === 'PM' ? 'btn-primary' : ''
                    }`}
                    onClick={() => formik.setFieldValue('period', 'PM')}
                  >
                    PM
                  </span>
                </>
              ) : (
                <span
                  className={`btn join-item btn-sm flex-1 ${
                    formik.values.period === limit.min.period
                      ? 'btn-primary'
                      : ''
                  }`}
                  onClick={() =>
                    formik.setFieldValue('period', limit.min.period)
                  }
                >
                  {limit.min.period}
                </span>
              )}
            </div>
            {formik.errors.period && (
              <div className='error text-red-500'>{formik.errors.period}</div>
            )}
          </div>
          <div className='modal-action'>
            {/* if there is a button in form, it will close the modal */}
            <div className='join flex w-full'>
              <span
                className='btn join-item flex-1'
                onClick={() => closeModal()}
              >
                Close
              </span>
              <span
                className={`btn btn-primary join-item flex-1 ${!formik.isValid ? 'disabled' : ''}`}
                onClick={(event) => {
                  event.preventDefault();
                  formik.handleSubmit();
                }}
              >
                Save
              </span>
            </div>
          </div>
        </form>
        <form method='dialog' className='modal-backdrop'>
          <span onClick={() => closeModal()}>close</span>
        </form>
      </dialog>
    </>
  );
};

export default TimeEditModal;
