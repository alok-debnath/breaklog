import React from 'react';
import LogsCard from '@/components/Layouts/LogsCard';
import { headers } from 'next/headers';
import { UserData } from '@/stores/store';

export default async function SpecificDayLog({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params; // Resolve the params promise

  // Fetch logs and user data
  const fetchLogFunction = async () => {
    const headerObject = Object.fromEntries(await headers());
    try {
      const logRes = await fetch(`http://127.0.0.1:3000/api/users/fetchlog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headerObject,
        },
        body: JSON.stringify({ date }),
      });

      const profileRes = await fetch(
        `http://127.0.0.1:3000/api/users/profile/fetchprofile`,
        {
          headers: {
            ...headerObject,
          },
        },
      );

      const logsData = await logRes.json();
      const profileData = await profileRes.json();

      const logs = logsData.data || [];
      const workData = logsData.workdata || {};
      const userData: UserData = profileData.data;

      if (logsData.status === 404) {
        return {
          logs: [],
          workData: {},
          userData,
          errorMessage: logsData.message,
        };
      }

      return {
        logs,
        workData,
        userData,
        errorMessage: null,
      };
    } catch (error) {
      console.error('Error fetching data:', error); // Log the error for debugging
      return {
        logs: [],
        workData: {},
        userData: {} as UserData, // Default value
        errorMessage: 'Error fetching data',
      };
    }
  };

  const { logs, workData, userData, errorMessage } = await fetchLogFunction();

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
