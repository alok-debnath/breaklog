'use client';
import Navbar from '@/components/Layouts/Navbar';
import InitialFetch from '@/components/common/InitialFetch';
import { useStore } from '@/stores/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const { themeMode, loading, monthLogs, summary } = useStore();
  const [collapseBoxState, setCollapseBoxState] = useState(false);

  // Initialize selectedMonth and selectedYear with the current month and year.
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Months are zero-based, so add 1.
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = Array.from({ length: new Date().getFullYear() - 2022 }, (_, index) => 2023 + index);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleSearch = async () => {
    const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;

    const monthStart =
      selectedYear + '-' + String(selectedMonth).padStart(2, '0') + '-01T00:00:00.000Z';
    const monthEnd = nextYear + '-' + String(nextMonth).padStart(2, '0') + '-01T00:00:00.000Z';

    try {
      setCollapseBoxState(false);
      useStore.setState(() => ({ loading: true }));

      const values = {
        monthStart: monthStart,
        monthEnd: monthEnd,
      };

      const res = await axios.post('/api/users/fetchlog/fetchdynamiclog', values);

      if (res.data.status === 200) {
        setCollapseBoxState(true);

        useStore.setState(() => ({ monthLogs: res.data.data }));
        useStore.setState(() => ({ loading: false }));
        useStore.setState(() => ({ summary: res.data.summary }));
      } else {
        setCollapseBoxState(false);
        useStore.setState(() => ({ loading: false }));
        toast.error('Error: ' + res.data.status, {
          style: {
            padding: '15px',
            color: 'white',
            backgroundColor: 'rgb(214, 60, 60)',
          },
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error('Error: ' + error.message, {
          style: {
            padding: '15px',
            color: 'white',
            backgroundColor: 'rgb(214, 60, 60)',
          },
        });
      }
    }
  };

  useEffect(() => {
    setCollapseBoxState(false);
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <div className='hero min-h-screen min-w-fit bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <div className='overflow-x-auto'>
              <div className='card bg-base-100 my-20'>
                <div className='card-body'>
                  <h3 className='text-md font-semibold text-left'>Fetch the data you need</h3>
                  <div className='mt-5 mb-2'>
                    <div className='join'>
                      <select
                        className='select select-bordered join-item'
                        value={selectedMonth.toString()} // Convert to string for consistency
                        onChange={(e) => setSelectedMonth(+e.target.value)} // Convert to number
                      >
                        {months.map((month, index) => (
                          <option
                            key={index}
                            value={(index + 1).toString()} // Convert to string
                            disabled={index + 1 === selectedMonth ? true : undefined}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <select
                        className='select select-bordered join-item'
                        value={selectedYear.toString()} // Convert to string for consistency
                        onChange={(e) => setSelectedYear(+e.target.value)} // Convert to number
                      >
                        {years.map((year, index) => (
                          <option
                            key={index}
                            value={year.toString()} // Convert to string
                            disabled={year === selectedYear ? true : undefined}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='mt-3'>
                      <button
                        className={`btn ${loading ? 'btn-disabled' : ''}`}
                        onClick={() => {
                          handleSearch();
                        }}>
                        Search{' '}
                        {loading && <span className='loading loading-ring loading-md'></span>}
                      </button>
                    </div>
                  </div>
                  <div className='collapse bg-base-200'>
                    <input
                      type='checkbox'
                      checked={collapseBoxState}
                      readOnly
                      hidden
                    />
                    <div className='collapse-content px-2'>
                      <div className='pt-2'>
                        <div className='card bg-base-100'>
                          <div className='card-body text-sm py-5'>
                            <p>
                              Work Required:{' '}
                              <span className='font-semibold'>{summary.expectedWorkHours}</span> hr
                            </p>
                            <p>
                              Work Done:{' '}
                              <span
                                className={`font-semibold ${
                                  summary.totalWorkDone >= summary.expectedWorkHours * 3600000
                                    ? 'text-success'
                                    : 'text-error'
                                }`}>
                                {summary.formattedTotalWorkDone}
                              </span>{' '}
                              hr
                            </p>
                            <div className='divider my-1'></div>
                            <p>
                              Days Logged:{' '}
                              <span className='font-semibold text-success'>
                                {summary.numberOfDays}
                              </span>{' '}
                              day
                            </p>
                            <p>
                              Break Taken:{' '}
                              <span className='font-semibold text-success'>
                                {summary.formattedTotalBreakTime}
                              </span>{' '}
                              hr
                            </p>
                          </div>
                        </div>
                        <table className='table md:table-md table-xs text-center mt-3'>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>
                                Break
                                <br />
                                hh:mm:ss
                              </th>
                              <th>
                                Work
                                <br />
                                hh:mm:ss
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {monthLogs &&
                              [...monthLogs].reverse().map((log, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{log.date}</td>
                                    <td>{log.formattedBreakTime}</td>
                                    <td
                                      className={`${
                                        log.workDone >= 8 * 3600000 ? 'text-success' : 'text-error'
                                      }`}>
                                      {log.formattedWorkDone}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
