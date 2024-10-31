'use server';
import SaveDataToGlobalStore from './SaveDataToGlobalStore';
import fetchRscData from '@/helpers/fetchRscData';

const InitialRscFetch = async () => {
  const { fetchProfileData } = fetchRscData();
  const { userData, errorMessage: profileError } = await fetchProfileData();

  return <SaveDataToGlobalStore userDataServer={userData} />;
};

export default InitialRscFetch;
