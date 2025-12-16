"use client";
import type { Preloaded } from "convex/react";
import { useMutation, usePreloadedQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import type { FetchedLogsDataType } from "@/utils/saveFetchedLogsToStore";
import { SaveDataToGlobalStore } from "./SaveDataToGlobalStore";

interface PreloadedComponentProps {
  preloadedProfile: Preloaded<typeof api.user.profile.fetch>;
  preloadedLogs: Preloaded<typeof api.user.fetchLogs.fetchLogs>;
}

const PreloadedComponent = ({
  preloadedProfile,
  preloadedLogs,
}: PreloadedComponentProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const profileData = usePreloadedQuery(preloadedProfile);
  const logsData = usePreloadedQuery(preloadedLogs);
  const createUserProfile = useMutation(api.user.profile.create);

  useEffect(() => {
    if (!session) {
      router.replace("/login");
      return;
    }
  }, [session, router]);

  useEffect(() => {
    if (
      profileData?.error === "unauthorized" ||
      logsData?.error === "unauthorized"
    ) {
      router.replace("/login");
      return;
    }
    if (profileData && !profileData.userProfileExists) {
      createUserProfile();
    }
  }, [profileData, logsData, createUserProfile, router]);

  const userData = profileData?.data;
  const logData = logsData
    ? ({
        message: logsData.message,
        status: logsData.status,
        data: logsData.data,
        workdata: logsData.workdata,
      } as FetchedLogsDataType)
    : null;

  if (
    !session ||
    profileData?.error === "unauthorized" ||
    logsData?.error === "unauthorized" ||
    !userData ||
    !logData
  ) {
    return null;
  }

  return (
    <SaveDataToGlobalStore userDataServer={userData} logDataServer={logData} />
  );
};

export default PreloadedComponent;
