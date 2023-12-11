import axios from 'axios';
import toast from 'react-hot-toast';

export const handleInvalidToken = async ({ error, router }: { error: any; router: any }) => {
  const responseData = JSON.parse(error.request.response);
  if (responseData.error === 'invalid token') {
    try {
      await axios.get('/api/auth/logout');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message, {
        style: {
          padding: '15px',
          color: 'white',
          backgroundColor: 'rgb(214, 60, 60)',
        },
      });
    }
  }
};
