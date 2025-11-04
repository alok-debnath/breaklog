"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import LogsCard from "@/components/Layouts/LogsCard";
import { api } from "../../../../../convex/_generated/api";

export default function SpecificDayLog() {
  const params = useParams();
  const date = params.date as string;

  const logsData = useQuery(api.fetchLogs.fetchLogs, { date });
  const profileData = useQuery(api.fetchProfile.fetchProfile);

  const logs = logsData?.data || [];
  const workData = logsData?.workdata;
  const userData = profileData?.data;

  if (!workData || !userData) {
    return <div>Loading...</div>;
  }

  const isWorkDone =
    workData.unformattedWorkDone >=
    (userData.daily_work_required || 0) * 3600000;

  const isWorkDoneSuccess = isWorkDone && (userData.daily_work_required || 0) > 0;

  return (
    <div className="from-background via-background/95 to-muted/20 bg-linear-to-br">
      <LogsCard
        page="history"
        isWorkDoneSuccess={isWorkDoneSuccess}
        logsServer={logs}
        workDataServer={workData}
      />
    </div>
  );
}
