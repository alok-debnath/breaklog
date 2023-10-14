import { useEffect } from 'react';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { toast } from 'react-hot-toast';

const FetchProfileComponent = () => {
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

  return null; // You can return null since this component doesn't render any UI elements directly.
};

export default FetchProfileComponent;