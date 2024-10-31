import { Suspense } from 'react';
import ConfirmationModal from '@/components/Layouts/Modals/ConfirmationModal';
import Navbar from '@/components/Layouts/Navbar';
import Loading from '@/components/Layouts/Loading';
import TimeZoneModal from '@/components/Layouts/Modals/TimeZoneModal';
import ThemeWrapper from '@/components/ThemeWrapper';
import InitialRscFetch from '@/components/common/InitialRscFetch';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ThemeWrapper>
        <Suspense fallback={null}>
          <InitialRscFetch />
        </Suspense>
        <ConfirmationModal />
        <TimeZoneModal />
        <Loading />
        <Navbar />
        {children}
      </ThemeWrapper>
    </section>
  );
}
