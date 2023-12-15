'use client';
import ConfirmationModal from '@/components/Layouts/ConfirmationModal';
import Navbar from '@/components/Layouts/Navbar';
import InitialFetch from '@/components/common/InitialFetch';
import { useStore } from '@/stores/store';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { themeMode } = useStore();

  return (
    <section>
      <div data-theme={themeMode}>
        <InitialFetch />
        <ConfirmationModal />
        <Navbar />
        {children}
      </div>
    </section>
  );
}
