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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTimezoneSelect, allTimezones } from 'react-timezone-select';
import { handleError, handleSuccessToast } from '../../common/CommonCodeBlocks';

const TimeZoneModal: React.FC = () => {
  const { userData, loading, isTimeZoneModalOpen } = useStore();
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
        useStore.setState({ isTimeZoneModalOpen: false });
        useStore.setState({
          userData: {
            ...userData,
          },
        });
        handleSuccessToast({
          message: 'Data saved successfully',
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
  }, [options]);

  return (
    <Dialog open={isTimeZoneModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Time Zone</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            Device Timezone:{' '}
            <span
              className={
                deviceTimeZone
                  ? selectedTimeZone === deviceTimeZone
                    ? 'text-green-500'
                    : 'text-yellow-500'
                  : 'text-red-500'
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
              className={selectedTimeZone ? 'text-green-500' : 'text-red-500'}
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
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>More Info</AccordionTrigger>
              <AccordionContent>
                <p>
                  If your work ends within the same day then you don&apos;t
                  have to bother and can select your own timezone
                </p>
                <div className='divider'>OR</div>
                <p>
                  In the event that you have an irregular work schedule,
                  consider using a TimeZone where your shift will start and
                  end within the same working day (this is solely for
                  calculation purposes only and won&apos;t affect how you see
                  the time).
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className='form-control'>
            <label className='label' htmlFor='log_type'>
              <span className='label-text flex items-center'>
                Default Time Zone
              </span>
            </label>
            <Select onValueChange={(value) => setSelectedTimeZone(value)} defaultValue={selectedTimeZone}>
              <SelectTrigger>
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!selectedTimeZone}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeZoneModal;
