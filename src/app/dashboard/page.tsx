'use client';
import Button from '@/components/UI/Button';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { handleError } from '@/components/common/CommonCodeBlocks';
import TimeEditModal from '@/components/Layouts/Modals/TimeEditModal';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/useConfirm';
import LogsCard from '@/components/Layouts/LogsCard';
import BottomNavbar from '@/components/Layouts/BottomNavbar';
import useOnScreen from '@/hooks/useOnScreen';
import { saveFetchedLogsToStore } from '@/utils/saveFetchedLogsToStore';

const Index = () => {
  const { breaklogMode, workData, loading, userData,initialPageLoadDone } = useStore();
  const router = useRouter();
  const { confirm } = useConfirm();
  const isClient = typeof window !== 'undefined';

  const logEntry = async (value: string) => {
    if (!isClient || !initialPageLoadDone) return;
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
      saveFetchedLogsToStore(res.data.fetchedLog);
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  };

  const isWorkDone =
    workData.unformattedWorkDone >=
    (userData.daily_work_required || 0) * 3600000;

  let isWorkDoneSuccess = isWorkDone && Boolean(userData.daily_work_required);

  const [ref, isIntersecting] = useOnScreen(-80);

  return (
    <>
      <div className='flex min-h-dvh place-items-center justify-center bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <LogsCard
              isWorkDoneSuccess={isWorkDoneSuccess}
              isIntersecting={isIntersecting}
            />
            <div className='mb-20'>
              <div ref={ref}>
                <Button
                  text='End Day'
                  className={`btn btn-primary w-full rounded-t-none normal-case ${
                    ['exit', null, 'day end'].includes(
                      workData.lastLogStatus,
                    ) ||
                    loading ||
                    breaklogMode
                      ? 'btn-disabled'
                      : ''
                  } ${isIntersecting || ['exit', null, 'day end'].includes(workData.lastLogStatus) ? '' : 'invisible'}`}
                  onclick={() => logEntry('day end')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavbar logEntry={logEntry} isIntersecting={isIntersecting} />
      <TimeEditModal />
    </>
  );
};

export default Index;
