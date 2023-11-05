'use client';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '@/stores/store';

export default function SpecificDayLog({ params }: any) {
  const { logs, workData, loading } = useStore();

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
      } catch (error: any) {
        useStore.setState(() => ({ loading: false }));
        if (error.name !== 'AbortError') {
          toast.error(error.message, {
            style: {
              padding: '15px',
              color: 'white',
              backgroundColor: 'rgb(214, 60, 60)',
            },
          });
        }
      }
    };

    fetchLogFunction();
  }, [params.date]);

  return (
    <>
      <div className='hero min-h-screen min-w-fit bg-base-200'>
        <div className='hero-content text-center'>
          <div className='card bg-base-100 my-20 shadow-xl'>
            <div className='card-body'>
              <div className='text-left font-semibold mb-2 block'>
                <p
                  className={`btn btn-sm underline no-animation ${
                    workData.unformattedWorkDone >= 8 * 3600000 ? 'btn-success' : 'btn-error'
                  }`}>
                  Data from past
                </p>
              </div>
              <div className='text-left font-semibold mb-3'>
                {logs.length > 0 && (
                  <p>
                    {new Date(logs[0].createdAt).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'long',
                    })}
                    ,
                  </p>
                )}
                {logs.length > 0 && (
                  <p>
                    {new Date(logs[0].createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                  </p>
                )}
                {workData.workDone ? (
                  <>
                    <p className='font-medium my-2'>Work done: {workData.workDone} (hh:mm:ss)</p>
                    <p className='font-medium my-2'>Break taken: {workData.breakTime} (hh:mm:ss)</p>
                  </>
                ) : (
                  <span className='animate-pulse'>
                    <span className='flex space-x-4'>
                      <span className='flex-1 space-y-9 py-1'>
                        <span className='space-y-3'>
                          <span className='grid grid-cols-5 gap-3'>
                            <span className='h-2 bg-slate-700 rounded col-span-3'></span>
                            <span className='h-2 bg-slate-700 rounded col-span-2'></span>
                          </span>
                          <span className='grid grid-cols-5 gap-3'>
                            <span className='h-2 bg-slate-700 rounded col-span-3'></span>
                            <span className='h-2 bg-slate-700 rounded col-span-2'></span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                )}
              </div>
              {loading && <progress className='progress progress-success'></progress>}
              <table className='table text-center'>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Log</th>
                  </tr>
                </thead>
                <tbody className='text-left'>
                  {logs &&
                    [...logs].reverse().map((log) => {
                      const createdAt = new Date(log.createdAt);
                      const utcFormattedDate = createdAt.toLocaleString('en-US', {
                        timeZone: 'Asia/Kolkata',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        month: 'short',
                        day: 'numeric',
                      });
                      return (
                        <tr key={log.id}>
                          <td>{utcFormattedDate}</td>
                          <td>{log.log_status}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
