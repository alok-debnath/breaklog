'use client';
import ConfirmationModal from '@/components/Layouts/ConfirmationModal';
import Navbar from '@/components/Layouts/Navbar';
import InitialFetch from '@/components/common/InitialFetch';
import Loading from '@/components/Layouts/Loading';
import { useStore } from '@/stores/store';
import { useUrlQuery } from '@/hooks/useUrlQuery';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { themeMode, userData } = useStore();
  const { getQuery } = useUrlQuery();

  const isClient = typeof window !== 'undefined';
  const serverTheme = getQuery('theme', 'light');

  return (
    <section>
      <div data-theme={isClient && userData.username ? themeMode : serverTheme}>
        <InitialFetch />
        <ConfirmationModal />
        <Loading />
        <Navbar />
        {children}
      </div>
    </section>
  );
}
