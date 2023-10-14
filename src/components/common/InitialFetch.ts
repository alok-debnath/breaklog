import { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { toast } from 'react-hot-toast';

const InitialFetch = () => {
  const { breaklogMode, themeMode } = useStore();
  const [isFirstEffectCompleted, setIsFirstEffectCompleted] = useState(false);
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/users/fetchprofile');
        useStore.setState(() => ({ userData: res.data.data }));
      } catch (error: any) {
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

    fetchData();

    if (isClient) {
      const storedBreaklogMode = localStorage.getItem('breaklogMode');
      if (storedBreaklogMode) {
        useStore.setState(() => ({ breaklogMode: JSON.parse(storedBreaklogMode) }));
      }

      const savedTheme = localStorage.getItem('thememode');
      if (savedTheme) {
        useStore.setState(() => ({ themeMode: savedTheme }));
      }
    }
    setIsFirstEffectCompleted(true);
  }, []);

  useEffect(() => {
    if (isClient && isFirstEffectCompleted) {
      localStorage.setItem('breaklogMode', JSON.stringify(breaklogMode));
      localStorage.setItem('thememode', themeMode);
    }
  }, [breaklogMode, themeMode, isFirstEffectCompleted]);

  return null;
};

export default InitialFetch;
