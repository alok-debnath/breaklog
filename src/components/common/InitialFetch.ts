import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { toast } from 'react-hot-toast';
import { handleError } from './CommonCodeBlocks';
import { useRouter } from 'next/navigation';

const InitialFetch = () => {
  const { breaklogMode, themeMode } = useStore();
  const [isFirstEffectCompleted, setIsFirstEffectCompleted] = useState(false);
  const router = useRouter();
  const isClient = typeof window !== 'undefined';

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get('/api/users/fetchprofile');
      useStore.setState(() => ({ userData: res.data.data }));
    } catch (error: any) {
      handleError({ error: error, router: router });
    }
  }, []);

  useEffect(() => {
    const loadLocalStorageData = () => {
      if (isClient) {
        const storedBreaklogMode = localStorage.getItem('breaklogMode');
        const savedTheme = localStorage.getItem('thememode');
        if (storedBreaklogMode) {
          useStore.setState(() => ({ breaklogMode: JSON.parse(storedBreaklogMode) }));
        }
        if (savedTheme) {
          useStore.setState(() => ({ themeMode: savedTheme }));
        }
      }
    };

    fetchData();
    loadLocalStorageData();
    setIsFirstEffectCompleted(true);
  }, [isClient, fetchData]);

  useEffect(() => {
    if (isClient && isFirstEffectCompleted) {
      localStorage.setItem('breaklogMode', JSON.stringify(breaklogMode));
      localStorage.setItem('thememode', themeMode);
    }
  }, [breaklogMode, themeMode, isFirstEffectCompleted, isClient]);

  return null;
};

export default InitialFetch;
