'use server';
import { SaveDataToGlobalStore } from './SaveDataToGlobalStore';
import fetchRscData from '@/helpers/fetchRscData';

const InitialRscFetch = async () => {
  const { fetchProfileDataRsc, fetchLogDataRsc } = fetchRscData();
  const { userData, errorMessage: profileError } = await fetchProfileDataRsc();
  const { logData, errorMessage: logError } = await fetchLogDataRsc();

  return (
    <SaveDataToGlobalStore userDataServer={userData} logDataServer={logData} />
  );
};

export default InitialRscFetch;
