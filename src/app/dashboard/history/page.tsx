'use client';
import Navbar from '@/components/Layouts/Navbar';
import InitialFetch from '@/components/common/InitialFetch';
import { useStore } from '@/stores/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const HistoryPage = () => {
  const { themeMode, loading, monthLogs } = useStore();
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

      useStore.setState(() => ({ monthLogs: res.data.data }));
      useStore.setState(() => ({ loading: false }));

      if (res.data.status === 200) {
        setCollapseBoxState(true);
      } else {
        setCollapseBoxState(false);
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
        toast.error('Error while log entry: ' + error.message, {
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
      <InitialFetch />
      <div data-theme={themeMode}>
        <Navbar />
        <div className='hero min-h-screen min-w-fit bg-base-200'>
          <Toaster
            position='top-left'
            reverseOrder={false}
          />
          <div className='hero-content text-center'>
            <div className='max-w-md'>
              <div className='overflow-x-auto'>
                <div className='card bg-base-100 mt-20'>
                  <div className='card-body'>
                    <h3 className='text-md font-semibold text-left'>Fetch the data you need</h3>
                    <div className='my-5'>
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
                            className='btn'
                            onClick={() => {
                              handleSearch();
                            }}>
                            Search
                          </button>
                        </div>
                    </div>
                    <div className='collapse bg-base-200'>
                      <input
                        type='checkbox'
                        defaultChecked={collapseBoxState}
                        hidden
                      />
                      <div className='collapse-content'>
                        <div className='pt-4'>
                          <table className='table text-center text-sm'>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Break</th>
                                <th>Work</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthLogs &&
                                [...monthLogs].reverse().map((log, index) => {
                                  return (
                                    <tr key={index}>
                                      <td>{log.date}</td>
                                      <td>{log.formattedBreakTime}</td>
                                      <td>{log.formattedWorkDone}</td>
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
      </div>
    </>
  );
};

export default HistoryPage;
