'use client';
import Navbar from '@/components/Layouts/Navbar';
import InitialFetch from '@/components/common/InitialFetch';
import { useStore } from '@/stores/store';
import React from 'react';

const HistoryPage = () => {
  const { themeMode } = useStore();

  return (
    <>
      <InitialFetch />
      <div data-theme={themeMode}>
        <Navbar />
        <div className='hero min-h-screen bg-base-200'>
          <div className='hero-content text-center'>
            <div className='max-w-2xl'>
              <div className='card flex-shrink-0 w-full max-w-2xl shadow-2xl bg-base-100'>
                <form className='card-body grid gap-y-3 w-full max-w-2xl'>
                  <h3 className='text-2xl font-bold text-left'>Update your data</h3>
                  <div className='collapse collapse-arrow bg-base-200'>
                    <input type='checkbox' />
                    <div className='collapse-title text-xl font-medium'>
                      Click me to show/hide contentfffff ffffffffffffffff
                    </div>
                    <div className='collapse-content'>
                      <p>hello</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPage;
