import { Suspense } from 'react';
import ConfirmationModal from '@/components/Layouts/Modals/ConfirmationModal';
import Navbar from '@/components/Layouts/Navbar';
import Loading from '@/components/Layouts/Loading';
import TimeZoneModal from '@/components/Layouts/Modals/TimeZoneModal';
import ThemeWrapper from '@/components/ThemeWrapper';
import InitialRscFetch from '@/components/common/InitialRscFetch';
import { cookies } from 'next/headers';
import SettingsModal from '@/components/Layouts/Modals/SettingsModal';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const themeCookie = (await cookies()).get('theme')?.value || 'caramellatte';

  return (
    <section>
      <ThemeWrapper themeCookie={themeCookie}>
        <Suspense fallback={null}>
          <InitialRscFetch />
        </Suspense>
        <ConfirmationModal />
        <SettingsModal />
        <TimeZoneModal />
        <Loading />
        <Navbar />
        {children}
        <Toaster position="top-left" />
      </ThemeWrapper>
    </section>
  );
}
