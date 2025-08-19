'use client';
import { UserData, useStore } from '@/stores/store';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FetchedLogsDataType,
  saveFetchedLogsToStore,
} from '@/utils/saveFetchedLogsToStore';

interface SaveDataToGlobalStoreProps {
  userDataServer: UserData;
  logDataServer: FetchedLogsDataType;
}

export const SaveDataToGlobalStore: React.FC<SaveDataToGlobalStoreProps> = ({
  userDataServer,
  logDataServer,
}) => {
  const [isFirstEffectCompleted, setIsFirstEffectCompleted] = useState(false);
  const { breaklogMode, themeMode, userData } = useStore();

  // Helper function to initialize local storage data
  const loadLocalStorageData = useCallback(() => {
    useStore.setState({ userData: userDataServer });
    saveFetchedLogsToStore(logDataServer);

    const storedBreaklogMode = localStorage.getItem('breaklogMode');
    const savedTheme = localStorage.getItem('thememode');

    useStore.setState({
      breaklogMode: storedBreaklogMode
        ? JSON.parse(storedBreaklogMode)
        : userDataServer.log_type === 'breakmode',
      themeMode: savedTheme || themeMode,
    });
    document.cookie = `theme=${themeMode}; path=/; max-age=31536000`;

    setIsFirstEffectCompleted(true);
  }, [logDataServer, themeMode, userDataServer]);

  // Load data on first render if in client-side environment
  useEffect(() => {
    if (typeof window !== 'undefined') loadLocalStorageData();
  }, [loadLocalStorageData]);

  // Update local storage and trigger timezone modal if needed
  useEffect(() => {
    if (isFirstEffectCompleted) {
      if (!userData.default_time_zone)
        useStore.setState({ isTimeZoneModalOpen: true });
      localStorage.setItem('breaklogMode', JSON.stringify(breaklogMode));
      localStorage.setItem('thememode', themeMode);
      document.cookie = `theme=${themeMode}; path=/; max-age=31536000`;
      useStore.setState({
        initialPageLoadDone: true,
      });
    }
  }, [
    breaklogMode,
    themeMode,
    userData.default_time_zone,
    isFirstEffectCompleted,
  ]);

  return null;
};
