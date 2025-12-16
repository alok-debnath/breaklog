export const dynamic = "force-dynamic";

import { Suspense } from "react";
import InitialDataWrapper from "@/components/common/InitialDataWrapper";
import Loading from "@/components/Layouts/Loading";
import ConfirmationModal from "@/components/Layouts/Modals/ConfirmationModal";
import SettingsModal from "@/components/Layouts/Modals/SettingsModal";
import TimeZoneModal from "@/components/Layouts/Modals/TimeZoneModal";
import Navbar from "@/components/Layouts/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col pt-20 pb-20 min-h-screen">
      <Suspense fallback={null}>
        <InitialDataWrapper />
      </Suspense>
      <ConfirmationModal />
      <SettingsModal />
      <TimeZoneModal />
      <Loading />
      <Navbar />
      <main className="grow flex">
        <div className="flex items-center justify-center p-4 w-full">
          {children}
        </div>
      </main>
      <Toaster position="top-left" />
    </section>
  );
}
