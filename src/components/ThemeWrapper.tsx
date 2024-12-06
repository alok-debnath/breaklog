'use client';
import { useStore } from '@/stores/store';

export default function ThemeWrapper({
  children,
  themeCookie,
}: {
  children: React.ReactNode;
  themeCookie: string | null;
}) {
  const { themeMode } = useStore();

  return <div data-theme={themeCookie ?? themeMode}>{children}</div>;
}
