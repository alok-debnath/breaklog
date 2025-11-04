"use client";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import type { FetchedLogsDataType } from "@/utils/saveFetchedLogsToStore";
import { api } from "../../../convex/_generated/api";
import { SaveDataToGlobalStore } from "./SaveDataToGlobalStore";

const InitialRscFetch = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
      return;
    }
  }, [session, router]);

  const profileData = useQuery(api.fetchProfile.fetchProfile);
  const logsData = useQuery(api.fetchLogs.fetchLogs, { date: undefined });
  const createUserProfile = useMutation(api.fetchProfile.createUserProfile);

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

export default InitialRscFetch;
