import { headers } from 'next/headers';

const fetchRscData = () => {
  const getHeaders = async () => {
    const headerObject = Object.fromEntries(await headers());
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = headerObject.host;
    const url = `${protocol}://${host}/api`;
    return { headerObject, url };
  };

  const fetchDynamicLogData = async (date: string) => {
    try {
      const { headerObject, url } = await getHeaders();
      const response = await fetch(url + '/users/fetchlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headerObject,
        },
        body: JSON.stringify({ date }),
      });

      const logsData = await response.json();
      return {
        logs: logsData.data || [],
        workData: logsData.workdata || {},
        errorMessage: logsData.status === 404 ? logsData.message : null,
      };
    } catch (error) {
      console.error('Error fetching log data:', error);
      return {
        logs: [],
        workData: {},
        errorMessage: 'Error fetching log data',
      };
    }
  };

  const fetchProfileData = async () => {
    try {
      const { headerObject, url } = await getHeaders();
      const response = await fetch(url + '/users/profile/fetchprofile', {
        headers: headerObject,
      });

      const profileData = await response.json();
      return {
        userData: profileData.data,
        errorMessage: null,
      };
    } catch (error) {
      console.error('Error fetching profile data:', error);
      return {
        userData: null,
        errorMessage: 'Error fetching profile data',
      };
    }
  };

  return { fetchDynamicLogData, fetchProfileData };
};

export default fetchRscData;
