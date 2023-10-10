'use client';

import Navbar from '@/components/Layouts/Navbar';
import SettingsModal from '@/components/Layouts/SettingsModal';
import { useEffect } from 'react';
import { useStore } from '@/stores/store';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
  const { themeMode } = useStore();

  const fetchProfileFunction = async () => {
    try {
      const res = await axios.get('/api/users/fetchprofile');
      useStore.setState(() => ({ userData: res.data.data }));
    } catch (error: any) {
      toast.error(error.message, {
        style: {
          padding: '15px',
          color: 'white',
          backgroundColor: 'rgb(214, 60, 60)',
        },
      });
    }
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem('thememode');

    if (savedTheme) {
      useStore.setState(() => ({ themeMode: savedTheme }));
    }
    fetchProfileFunction();
  }, []);
  return (
    <>
      <div data-theme={themeMode}>
        <Navbar />
        <div className='hero min-h-screen bg-base-200'>
          <div className='hero-content text-center'>
            <div className='max-w-md'>
              <div className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
                <form className='card-body grid gap-y-3 w-full max-w-xl'>
                  <h3 className='text-2xl font-bold text-left'>Update your data</h3>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='username'>
                      <span className='label-text'>Username</span>
                    </label>
                    <input
                      type='text'
                      id='username'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-md'
                    />
                  </div>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='email'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input
                      type='email'
                      id='email'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-xs'
                    />
                  </div>
                  <div className='form-control'>
                    <label
                      className='label'
                      htmlFor='name'>
                      <span className='label-text'>Name (not required)</span>
                    </label>
                    <input
                      type='text'
                      id='name'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-xs'
                    />
                  </div>
                  <div className='form-control mt-6'>
                    <button
                      type='submit'
                      className='btn btn-primary normal-case'>
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <SettingsModal />
      </div>
    </>
  );
};

export default ProfilePage;
