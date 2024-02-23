'use client';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '@/stores/store';
import { handleError } from '@/components/common/CommonCodeBlocks';
import { useRouter } from 'next/navigation';
import LogsCard from '@/components/Layouts/LogsCard';

export default function SpecificDayLog({ params }: any) {
  const { workData, userData } = useStore();
  const router = useRouter();

  useEffect(() => {
    const fetchLogFunction = async () => {
      try {
        useStore.setState(() => ({ loading: true }));
        const values = { date: params.date };
        const res = await axios.post('/api/users/fetchlog', values);

        useStore.setState(() => ({
          loading: false,
          logs: res.data.data,
          workData: res.data.workdata,
        }));

        if (res.data.status === 404) {
          toast.error(res.data.message, {
            style: {
              padding: '15px',
              color: 'white',
              backgroundColor: 'rgb(214, 60, 60)',
            },
          });
        }
      } catch (error: any) {
        handleError({ error: error, router: router });
      }
    };

    fetchLogFunction();
  }, [params.date]);

  const isWorkDone =
    workData.unformattedWorkDone >=
    (userData.daily_work_required || 0) * 3600000;
  const isWorkDoneSuccess =
    isWorkDone &&
    (userData.daily_work_required !== 0 ||
      userData.daily_work_required !== undefined ||
      userData.daily_work_required !== null);

  return (
    <>
      <div className='hero min-h-screen min-w-fit bg-base-200'>
        <div className='hero-content text-center'>
          <LogsCard page='history' isWorkDoneSuccess={isWorkDoneSuccess} />
        </div>
      </div>
    </>
  );
}
