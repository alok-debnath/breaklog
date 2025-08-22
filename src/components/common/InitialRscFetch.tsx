"use server";
import fetchRscData from "@/helpers/fetchRscData";
import { SaveDataToGlobalStore } from "./SaveDataToGlobalStore";

const InitialRscFetch = async () => {
  const { fetchProfileDataRsc, fetchLogDataRsc } = fetchRscData();
  const { userData, errorMessage: profileError } = await fetchProfileDataRsc();
  const { logData, errorMessage: logError } = await fetchLogDataRsc();

  return (
    <SaveDataToGlobalStore userDataServer={userData} logDataServer={logData} />
  );
};

export default InitialRscFetch;
