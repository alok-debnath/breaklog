'use client';
import { useStore } from '@/stores/store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import { handleError } from '../../common/CommonCodeBlocks';
import toast from 'react-hot-toast';
declare global {
  interface Window {
    time_zone_modal: {
      showModal: () => void;
      close: () => void;
    };
  }
}
interface TimeZoneModalProps {}

const TimeZoneModal: React.FC<TimeZoneModalProps> = () => {
  const { userData, loading } = useStore();
  const router = useRouter();

  const labelStyle = 'abbrev';
  const timezones = {
    ...allTimezones,
  };
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [deviceTimeZone, setDeviceTimeZone] = useState('');

  async function handleSubmit() {
    useStore.setState(() => ({ loading: true }));
    try {
      const res = await axios.post('/api/users/profile/updateprofile', {
        ...userData,
        default_time_zone: selectedTimeZone,
      });

      if ((res.data.success = true)) {
        window.time_zone_modal.close();
        useStore.setState({
          userData: {
            ...userData,
          },
        });
        toast.success('Data saved succesfully', {
          style: {
            padding: '15px',
            color: 'white',
            backgroundColor: 'rgb(0, 120, 0)',
          },
        });
      }
    } catch (error: any) {
      handleError({ error: error, router: router });
    } finally {
      useStore.setState(() => ({ loading: false }));
    }
  }

  useEffect(() => {
    const userDeviceTimezone = Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.toLowerCase();
    const isTimeZoneMatch = options.some(
      (option) => option.value.toLowerCase() === userDeviceTimezone,
    );
    if (isTimeZoneMatch) {
      setDeviceTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  }, []);

  return (
    <>
      <dialog
        id='time_zone_modal'
        className='modal modal-bottom sm:modal-middle'
      >
        <form method='dialog' className='modal-box bg-base-200 px-0 pb-0 pt-0'>
          <h3 className='py-6 text-center text-lg font-bold'>Select Time Zone</h3>
          <div className='rounded-t- card rounded-b-none bg-base-100 px-5 pb-5'>
            <div className='card-body'>
              <p>
                Device Timezone:{' '}
                <span
                  className={
                    deviceTimeZone
                      ? selectedTimeZone === deviceTimeZone
                        ? 'text-success'
                        : 'text-warning'
                      : 'text-error'
                  }
                >
                  {(deviceTimeZone && (
                    <>
                      {deviceTimeZone + ' '}
                      <span className='whitespace-nowrap'>
                        {parseTimezone(deviceTimeZone).label.split(') ')[0] +
                          ')'}
                      </span>
                    </>
                  )) ||
                    'undefined'}
                </span>
              </p>
              <p>
                Selected Timezone:{' '}
                <span
                  className={selectedTimeZone ? 'text-success' : 'text-error'}
                >
                  {(selectedTimeZone && (
                    <>
                      {selectedTimeZone + ' '}
                      <span className='whitespace-nowrap'>
                        {parseTimezone(selectedTimeZone).label.split(') ')[0] +
                          ')'}
                      </span>
                    </>
                  )) ||
                    'undefined'}
                </span>
              </p>
              <div className='collapse collapse-arrow bg-base-200'>
                <input type='checkbox' />
                <div className='collapse-title font-medium'>
                  Click for more info
                </div>
                <div className='collapse-content text-sm'>
                  <p>
                    If your work ends within the same day then you don't have to
                    bother and can select your own timezone
                  </p>
                  <div className='divider'>OR</div>
                  <p>
                    In the event that you have an irregular work schedule,
                    consider using a TimeZone where your shift will start and
                    end within the same working day (this is solely for
                    calculation purposes only and won't affect how you see the
                    time).
                  </p>
                  <h3 className='mt-3 font-bold'>Example:</h3>
                  <p className='mb-3'>
                    Here the work starts at May 6 but ends at May 7.
                    <br />
                    So selecting a timezone for example which is 2 or 3 (or
                    maybe more) hours behind your timezone is preffered,
                    <br />
                    like in this case my timezone is at{' '}
                    <span className='font-bold'>GMT+5:30</span> so I will select
                    someting like
                    <span className='font-bold'> GMT+2:00 or GMT+3:00</span>
                  </p>
                  <table className='table table-zebra text-center'>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>May 7, 1:29 AM</td>
                        <td>day end</td>
                      </tr>
                      <tr>
                        <td>May 6, 3:00 PM</td>
                        <td>day start</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='form-control'>
                <label className='label' htmlFor='log_type'>
                  <span className='label-text flex items-center'>
                    Default Time Zone
                  </span>
                </label>
                <select
                  value={selectedTimeZone}
                  className='select select-bordered w-full'
                  onChange={(e) => setSelectedTimeZone(e.currentTarget.value)}
                >
                  <option value=''>Select a timezone</option>
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='modal-action'>
              {/* if there is a button in form, it will close the modal */}
              <div className='join flex w-full'>
                <span
                  className={`btn btn-primary join-item flex-1 ${!selectedTimeZone && 'btn-disabled'}`}
                  onClick={handleSubmit}
                >
                  Confirm
                </span>
              </div>
            </div>
          </div>
        </form>
        <form method='dialog' className='modal-backdrop'>
          {/* <span onClick={onCancel}>close</span> */}
        </form>
      </dialog>
    </>
  );
};

export default TimeZoneModal;
