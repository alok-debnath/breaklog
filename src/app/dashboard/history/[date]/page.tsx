import React from 'react';
import LogsCard from '@/components/Layouts/LogsCard';
import useFetchRscData from '@/hooks/useFetchRscData';

export default async function SpecificDayLog({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params; // Resolve the params promise
  const { fetchDynamicLogData, fetchProfileData } = useFetchRscData();

  // Fetch logs data with the specific date
  const { logs, workData, errorMessage: logsError } = await fetchDynamicLogData(date);
  // Fetch profile data independently
  const { userData, errorMessage: profileError } = await fetchProfileData();  

  const isWorkDone =
    workData.unformattedWorkDone >=
    (userData.daily_work_required || 0) * 3600000;

  const isWorkDoneSuccess = isWorkDone && userData.daily_work_required > 0;

  return (
    <div className='flex min-h-dvh min-w-fit place-items-center justify-center bg-base-200'>
      <div className='hero-content text-center'>
        <LogsCard
          page='history'
          isWorkDoneSuccess={isWorkDoneSuccess}
          logsServer={logs} // logs fetched from server
          workDataServer={workData} // workData fetched from server
          // errorMessage={errorMessage} // Uncomment if you want to handle error messages
        />
      </div>
    </div>
  );
}
