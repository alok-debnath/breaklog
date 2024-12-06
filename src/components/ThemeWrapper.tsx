'use client';
import { useStore } from '@/stores/store';

export default function ThemeWrapper({
  children,
  themeCookie,
}: {
  children: React.ReactNode;
  themeCookie: string;
}) {
  const { themeMode } = useStore();

  const isClient = typeof window !== 'undefined';
  const theme = isClient && themeMode !== '' ? themeMode : themeCookie;

  return <div data-theme={theme}>{children}</div>;
}
