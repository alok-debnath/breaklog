'use client';
import { useEffect } from 'react';
import NavbarBottom from '@/components/Layouts/NavbarBottom';
import Button from '@/components/UI/Button';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { handleError } from '@/components/common/CommonCodeBlocks';
import TimeEditModal from '@/components/Layouts/TimeEditModal';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/useConfirm';
import LogsCard from '@/components/Layouts/LogsCard';
import BreakCalculator from '@/utility/BreakCalculator';

const Index = () => {
  const { breaklogMode, workData, loading, userData } = useStore();
  const router = useRouter();
  const { confirm } = useConfirm();
  const isClient = typeof window !== 'undefined';

  BreakCalculator();

  const logEntry = async (value: string) => {
    try {
      if (value === 'undo log') {
        const isConfirmed = await confirm({
          modal_body: 'Your most recent log will be permanently deleted, proceed with caution.',
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
      await fetchLogFunction();

      useStore.setState(() => ({ loading: false }));
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  const fetchLogFunction = async () => {
    try {
      useStore.setState(() => ({ loading: true }));
      const values = {};

      const res = await axios.post('/api/users/fetchlog', values);
      useStore.setState(() => ({
        loading: false,
        logs: res.data.data,
        workData: res.data.workdata,
      }));

      if (res.data.workdata.currentBreak !== null) {
        useStore.setState(() => ({ currBreak: res.data.workdata.currentBreak }));
      } else {
        useStore.setState(() => ({
          currBreak: null,
          liveBreaks: 0,
        }));
      }
      if (res.data.workdata.firstLogStatus === 'day start') {
        useStore.setState(() => ({ breaklogMode: false }));
      }
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  useEffect(() => {
    fetchLogFunction();
  }, []);

  const isWorkDone = workData.unformattedWorkDone >= (userData.daily_work_required || 0) * 3600000;
  const isWorkDoneSuccess =
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
                } ${
                  workData.unformattedWorkDone >= 8 * 3600000
                    ? 'btn-outline btn-success border-2 border-t-0'
                    : ''
                }`}
                onclick={() => logEntry('day end')}
              />
            </div>
          </div>
        </div>
        <div className='fixed bottom-5 right-5 items-center justify-end mb-14'>
          <div className='dropdown dropdown-top dropdown-end'>
            <label
              tabIndex={0}
              className='btn bg-primary/40 shadow-xl backdrop-blur-md'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className='dropdown-content menu shadow bg-base-100 rounded-box mb-2'>
              <li>
                <span onClick={() => fetchLogFunction()}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
                    />
                  </svg>
                </span>
              </li>
              <li>
                <span onClick={() => logEntry('undo log')}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
                    />
                  </svg>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <NavbarBottom logEntry={logEntry} />
      <TimeEditModal fetchLogFunction={fetchLogFunction} />
    </>
  );
};

export default Index;
