'use client';
import { useStore } from '@/stores/store';

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeMode } = useStore();

  return <div data-theme={themeMode}>{children}</div>;
}
