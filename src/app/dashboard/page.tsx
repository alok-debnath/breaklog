'use client';
import { useEffect } from 'react';
import Button from '@/components/UI/Button';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { handleError } from '@/components/common/CommonCodeBlocks';
import TimeEditModal from '@/components/Layouts/TimeEditModal';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/useConfirm';
import LogsCard from '@/components/Layouts/LogsCard';
import BottomNavbar from '@/components/Layouts/BottomNavbar';

type LogEntry = {
  id: string;
  updatedAt: string;
  log_status: string;
};
interface FetchedLogsData {
  message: string;
  status: number;
  data: LogEntry[];
  workdata: {
    breakTime: string;
    workDone: string;
    unformattedWorkDone: number;
    currentBreak: null | Date;
    firstLogStatus: string | null;
    lastLogStatus: string;
    formattedWorkEndTime: string;
    formattedWorkLeft: string;
  };
}

const Index = () => {
  const { breaklogMode, workData, loading, userData } = useStore();
  const router = useRouter();
  const { confirm } = useConfirm();
  const isClient = typeof window !== 'undefined';

  const saveFetchedLogs = (data: FetchedLogsData) => {
    useStore.setState(() => ({
      loading: false,
      logs: data.data,
      workData: data.workdata,
    }));

    if (data.workdata.currentBreak !== null) {
      useStore.setState(() => ({
        currBreak: data.workdata.currentBreak,
      }));
    } else {
      useStore.setState(() => ({
        currBreak: null,
        liveBreaks: 0,
      }));
    }
    if (data.workdata.firstLogStatus === 'day start') {
      useStore.setState(() => ({ breaklogMode: false }));
    }
  };

  const logEntry = async (value: string) => {
    try {
      if (value === 'undo log') {
        const isConfirmed = await confirm({
          modal_body:
            'Your most recent log will be permanently deleted, proceed with caution.',
          modal_head: 'Delete most recent log?',
          modal_confirm_btn: 'Delete',
          modal_cancel_btn: 'Cancel',
        });
        if (!isConfirmed) {
          useStore.setState(() => ({ loading: false }));
          return;
        }
      }

      const values = {
        logtype: value,
      };

      useStore.setState(() => ({ loading: true }));
      const res = await axios.post('/api/users/submitlog', values);
      saveFetchedLogs(res.data.fetchedLog);
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  const fetchLogFunction = async () => {
    try {
      useStore.setState(() => ({ loading: true }));
      const values = {};

      const res = await axios.post('/api/users/fetchlog', values);
      saveFetchedLogs(res.data);
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  useEffect(() => {
    fetchLogFunction();
  }, []);

  const isWorkDone =
    workData.unformattedWorkDone >=
    (userData.daily_work_required || 0) * 3600000;

  let isWorkDoneSuccess =
    isWorkDone &&
    (userData.daily_work_required !== 0 ||
      userData.daily_work_required !== undefined ||
      userData.daily_work_required !== null);

  return (
    <>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <LogsCard isWorkDoneSuccess={isWorkDoneSuccess} />
            <div className='mb-20'>
              <Button
                text='End Day'
                className={`btn btn-primary w-full rounded-t-none normal-case ${
                  ['exit', null, 'day end'].includes(workData.lastLogStatus) ||
                  loading ||
                  breaklogMode
                    ? 'btn-disabled'
                    : ''
                }`}
                onclick={() => logEntry('day end')}
              />
            </div>
          </div>
        </div>
      </div>
      <BottomNavbar logEntry={logEntry} fetchLogFunction={fetchLogFunction} />
      <TimeEditModal saveFetchedLogs={saveFetchedLogs} />
    </>
  );
};

export default Index;
