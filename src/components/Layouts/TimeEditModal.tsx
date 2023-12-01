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
  fetchLogFunction: Function;
}

const TimeEditModal: React.FC<TimeEditModalProps> = ({ logDateTime, fetchLogFunction }) => {
  const { loading } = useStore();
  const [localHour, setLocalHour] = useState<number>(0);
  const [localMinute, setLocalMinute] = useState<number>(0);
  const [amPm, setAmPm] = useState<string>('AM');

  useEffect(() => {
    const updateLocalTime = () => {
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
    const values = { log_id: logDateTime.log_id, log_dateTime: logDateTime.log_dateTime };
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
          <div className='form-control grid gap-y-5'>
            <div>
              <p className='label-text'>Hour</p>
              <input
                className='input input-bordered min-w-full'
                type='text'
                id='selectedHour'
                name='selectedHour'
                value={localHour}
                onChange={(e) => setLocalHour(Number(e.target.value))}
              />
            </div>
            <div>
              <p className='label-text'>Minute</p>
              <input
                className='input input-bordered min-w-full'
                type='text'
                id='selectedMinute'
                name='selectedMinute'
                value={localMinute}
                onChange={(e) => setLocalMinute(Number(e.target.value))}
              />
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
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default TimeEditModal;
