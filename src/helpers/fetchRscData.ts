'use server';
import { headers } from 'next/headers';

const fetchRscData = () => {
  const getHeaders = async () => {
    const headerObject = Object.fromEntries(await headers());
    const protocol =
      headerObject['x-forwarded-proto'] ||
      (process.env.NEXT_ENV === 'local' ? 'http' : 'https');
    const host = headerObject.host;
    const url = `${protocol}://${host}/api`;
    return { headerObject, url };
  };

  const fetchDynamicLogDataRsc = async (date: string) => {
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

  const fetchProfileDataRsc = async () => {
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

  const fetchLogDataRsc = async () => {
    try {
      const { headerObject, url } = await getHeaders();
      const values = {};
      const response = await fetch(url + '/users/fetchlog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headerObject,
        },
        body: JSON.stringify({ values }),
      });

      const logData = await response.json();
      return {
        logData: logData,
        errorMessage: null,
      };
    } catch (error) {
      console.error('Error fetching log data:', error);
      return {
        logData: null,
        errorMessage: 'Error fetching log data',
      };
    }
  };

  return { fetchDynamicLogDataRsc, fetchProfileDataRsc, fetchLogDataRsc };
};

export default fetchRscData;
