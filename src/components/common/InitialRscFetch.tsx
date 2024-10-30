import SaveDataToGlobalStore from './SaveDataToGlobalStore';
import useFetchRscData from '@/hooks/useFetchRscData';

const InitialRscFetch = async () => {
  const { fetchProfileData } = useFetchRscData();
  const { userData, errorMessage: profileError } = await fetchProfileData();

  return <SaveDataToGlobalStore userDataServer={userData} />;
};

export default InitialRscFetch;
