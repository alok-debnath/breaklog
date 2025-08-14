'use client';
import { useStore } from '@/stores/store';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ConnectedThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode } = useStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(themeMode);
  }, [themeMode, setTheme]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
