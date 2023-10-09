'use client';

import Navbar from '@/components/Layouts/Navbar';
import SettingsModal from '@/components/Layouts/SettingsModal';
import { useEffect } from 'react';
import { useStore } from '@/stores/store';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
  const fetchProfileFunction = async () => {
    try {
      const res = await axios.get('/api/users/fetchprofile');
      useStore.setState(() => ({ userData: res.data.data }));
    } catch (error:any) {
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
      <Navbar />
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center'>
          <div className='max-w-md'>
            <h1 className='text-5xl font-bold'>Hello there</h1>
            <p className='py-6'>
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
              exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <button className='btn btn-primary'>Get Started</button>
          </div>
        </div>
      </div>
      <SettingsModal/>
    </>
  );
};

export default ProfilePage;
