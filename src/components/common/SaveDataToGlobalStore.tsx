'use client';
import { UserData, useStore } from '@/stores/store';
import React, { useEffect, useState } from 'react';

interface SaveDataToGlobalStoreProps {
  userDataServer: UserData;
}

const SaveDataToGlobalStore: React.FC<SaveDataToGlobalStoreProps> = ({
  userDataServer,
}) => {
  const [isFirstEffectCompleted, setIsFirstEffectCompleted] = useState(false);
  const { breaklogMode, themeMode, userData } = useStore();

  // Helper function to initialize local storage data
  const loadLocalStorageData = () => {
    useStore.setState({ userData: userDataServer });

    const storedBreaklogMode = localStorage.getItem('breaklogMode');
    const savedTheme = localStorage.getItem('thememode');

    useStore.setState({
      breaklogMode: storedBreaklogMode
        ? JSON.parse(storedBreaklogMode)
        : userDataServer.log_type === 'breakmode',
      themeMode: savedTheme || themeMode,
    });

    setIsFirstEffectCompleted(true);
  };

  // Load data on first render if in client-side environment
  useEffect(() => {
    if (typeof window !== 'undefined') loadLocalStorageData();
  }, []);

  // Update local storage and trigger timezone modal if needed
  useEffect(() => {
    if (isFirstEffectCompleted) {
      if (!userData.default_time_zone) window.time_zone_modal.showModal();
      localStorage.setItem('breaklogMode', JSON.stringify(breaklogMode));
      localStorage.setItem('thememode', themeMode);
    }
  }, [
    breaklogMode,
    themeMode,
    userData.default_time_zone,
    isFirstEffectCompleted,
  ]);

  return null;
};

export default SaveDataToGlobalStore;
