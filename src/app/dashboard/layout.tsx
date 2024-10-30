import ConfirmationModal from '@/components/Layouts/Modals/ConfirmationModal';
import Navbar from '@/components/Layouts/Navbar';
import InitialRscFetch from '@/components/common/InitialRscFetch';
import Loading from '@/components/Layouts/Loading';
import TimeZoneModal from '@/components/Layouts/Modals/TimeZoneModal';
import ThemeWrapper from '@/components/ThemeWrapper';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ThemeWrapper>
        <InitialRscFetch />
        <ConfirmationModal />
        <TimeZoneModal />
        <Loading />
        <Navbar />
        {children}
      </ThemeWrapper>
    </section>
  );
}
