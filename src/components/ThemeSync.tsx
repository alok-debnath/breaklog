'use client';
import { useStore } from '@/stores/store';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeSync() {
  const { themeMode } = useStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (themeMode) {
      setTheme(themeMode);
    }
  }, [themeMode, setTheme]);

  return null;
}
