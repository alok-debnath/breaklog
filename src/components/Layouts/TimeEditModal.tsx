import { useStore } from '@/stores/store';
import axios from 'axios';
import { handleError } from '../common/CommonCodeBlocks';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    time_edit_modal: {
      showModal: () => void;
      close: () => void;
    };
  }
}
interface TimeEditModalProps {
  logDateTime: {
    log_id: string;
    log_dateTime: string;
    log_dateTime_ahead: string;
    log_dateTime_behind: string;
  };
  setLogDateTime: React.Dispatch<
    React.SetStateAction<{
      log_id: string;
      log_dateTime: string;
      log_dateTime_ahead: string;
      log_dateTime_behind: string;
    }>
  >;
  fetchLogFunction: Function;
}

const TimeEditModal: React.FC<TimeEditModalProps> = ({
  logDateTime,
  setLogDateTime,
  fetchLogFunction,
}) => {
  const { loading } = useStore();
  const [localHour, setLocalHour] = useState<number>(0);
  const [localMinute, setLocalMinute] = useState<number>(0);
  const [amPm, setAmPm] = useState<string>('AM');

  useEffect(() => {
    const updateLocalTime = () => {
      console.log("gg");
      
      const updatedLocalTime = new Date(logDateTime.log_dateTime).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const [hour, minute, period] = updatedLocalTime.split(/:|\s/);

      setLocalHour(Number(hour));
      setLocalMinute(Number(minute));
      setAmPm(period || 'AM');
    };

    updateLocalTime();
  }, [logDateTime.log_dateTime]);

  const logEdit = async () => {
    const originalDateTime = new Date(logDateTime.log_dateTime);

    // Get the user's local timezone offset in minutes
    const localTimeZoneOffset = originalDateTime.getTimezoneOffset();

    // Set the local hours and minutes considering the local timezone offset
    const updatedDateTime = new Date(originalDateTime);
    updatedDateTime.setMinutes(originalDateTime.getMinutes() + localTimeZoneOffset);
    updatedDateTime.setHours(localHour);

    // Adjust AM/PM if necessary
    if (amPm === 'PM' && localHour < 12) {
      updatedDateTime.setHours(localHour + 12);
    } else if (amPm === 'AM' && localHour === 12) {
      updatedDateTime.setHours(0);
    }

    updatedDateTime.setMinutes(localMinute);

    // Ensure the updated time is in the correct day by checking if it's before the original time
    if (updatedDateTime < originalDateTime) {
      updatedDateTime.setDate(originalDateTime.getDate());
    }

    // Convert the updatedDateTime to a string in ISO format (UTC)
    const updatedDateTimeUTC = updatedDateTime.toISOString();

    const values = { log_id: logDateTime.log_id, log_dateTime: updatedDateTimeUTC };

    try {
      useStore.setState(() => ({ loading: true }));
      const res = await axios.post('/api/users/logedit', values);
      fetchLogFunction();
      // useStore.setState(() => ({ loading: false }));
    } catch (error: any) {
      handleError(error);
    }
    window.time_edit_modal.close();
  };

  const closeModal = () => {
    window.time_edit_modal.close();
    setLogDateTime({
      log_id: '',
      log_dateTime: '',
      log_dateTime_ahead: '',
      log_dateTime_behind: '',
    });
  };
  return (
    <>
      <dialog
        id='time_edit_modal'
        className='modal modal-bottom sm:modal-middle'>
        <form
          method='dialog'
          className='modal-box'>
          {/* <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> */}
          <h3 className='font-bold text-lg text-center'>Edit Time</h3>
          {loading ? (
            <progress className='progress progress-success my-4'></progress>
          ) : (
            <div className='divider'></div>
          )}
          <div className='form-control grid gap-y-5 card p-5'>
            <div>
              <p className='label-text'>Hour</p>
              <div className='w-full flex'>
                <input
                  className='input input-bordered flex-1'
                  type='text'
                  id='selectedHour'
                  name='selectedHour'
                  value={isNaN(localHour) ? 0 : localHour}
                  onChange={(e) => setLocalHour(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <p className='label-text'>Minute</p>
              <div className='join w-full flex'>
                <input
                  className='input input-bordered flex-1 join-item'
                  type='text'
                  id='selectedMinute'
                  name='selectedMinute'
                  value={isNaN(localMinute) ? 0 : localMinute}
                  onChange={(e) => setLocalMinute(Number(e.target.value))}
                />
                {/* <p className='btn input-bordered join-item no-animation flex-1'>Search</p>
                <p className='btn input-bordered join-item no-animation flex-1'>Search</p> */}
              </div>
            </div>
            <div className='join join-horizontal flex'>
              <span
                className={`btn btn-sm join-item flex-1 ${amPm === 'AM' ? 'btn-primary' : ''}`}
                onClick={() => setAmPm('AM')}>
                AM
              </span>
              <span
                className={`btn btn-sm join-item flex-1 ${amPm === 'PM' ? 'btn-primary' : ''}`}
                onClick={() => setAmPm('PM')}>
                PM
              </span>
            </div>
          </div>
          <div className='modal-action'>
            {/* if there is a button in form, it will close the modal */}
            <div className='join w-full flex'>
              <button className='btn join-item flex-1'>Close</button>
              <span
                className='btn btn-primary join-item flex-1'
                onClick={() => logEdit()}>
                Save
              </span>
            </div>
          </div>
        </form>
        <form
          method='dialog'
          className='modal-backdrop'>
          <span onClick={() => closeModal()}>close</span>
        </form>
      </dialog>
    </>
  );
};

export default TimeEditModal;
