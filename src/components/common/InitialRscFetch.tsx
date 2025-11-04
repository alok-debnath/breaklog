"use client";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { SaveDataToGlobalStore } from "./SaveDataToGlobalStore";

const InitialRscFetch = () => {
  const profileData = useQuery(api.fetchProfile.fetchProfile);
  const logsData = useQuery(api.fetchLogs.fetchLogs, { date: undefined });
  const createUserProfile = useMutation(api.fetchProfile.createUserProfile);

  useEffect(() => {
    if (profileData && !profileData.userProfileExists) {
      createUserProfile();
    }
  }, [profileData, createUserProfile]);

  const userData = profileData?.data;
  const logData = logsData ? {
    message: logsData.message,
    status: logsData.status,
    data: logsData.data,
    workdata: logsData.workdata,
  } : null;

  if (!userData || !logData) {
    return null;
  }

  return (
    <SaveDataToGlobalStore userDataServer={userData} logDataServer={logData} />
  );
};;

export default InitialRscFetch;
