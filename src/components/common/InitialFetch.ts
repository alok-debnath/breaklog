import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useStore } from '@/stores/store';
import { handleError } from './CommonCodeBlocks';
import { useRouter } from 'next/navigation';

const InitialFetch = () => {
  const { breaklogMode, themeMode, userData } = useStore();
  const [isFirstEffectCompleted, setIsFirstEffectCompleted] = useState(false);
  const router = useRouter();
  const isClient = typeof window !== 'undefined';

  const fetchData = useCallback(async () => {
    try {
      useStore.setState(() => ({ loading: true }));
      const res = await axios.get('/api/users/profile/fetchprofile');
      useStore.setState(() => ({ userData: res.data.data }));

      if (isClient) {
        const storedBreaklogMode = localStorage.getItem('breaklogMode');
        if (!storedBreaklogMode) {
          useStore.setState(() => ({
            breaklogMode: JSON.parse(
              res.data.data.log_type === 'breakmode' ? 'true' : 'false',
            ),
          }));
        }
      }
    } catch (error: any) {
      handleError({ error: error, router: router });
    } finally {
      useStore.setState(() => ({ loading: false }));
      setIsFirstEffectCompleted(true);
    }
  }, []);

  useEffect(() => {
    const loadLocalStorageData = () => {
      if (isClient) {
        const storedBreaklogMode = localStorage.getItem('breaklogMode');
        const savedTheme = localStorage.getItem('thememode');
        if (storedBreaklogMode) {
          useStore.setState(() => ({
            breaklogMode: JSON.parse(storedBreaklogMode),
          }));
        }
        if (savedTheme) {
          useStore.setState(() => ({ themeMode: savedTheme }));
        }
      }
    };

    fetchData();
    loadLocalStorageData();
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
