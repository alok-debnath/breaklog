import toast from 'react-hot-toast';
import { useStore } from '@/stores/store';

const updateLoadingState = () => {
  useStore.setState(() => ({ loading: false }));
};

export const handleError = async ({
  error,
  router,
}: {
  error: any;
  router?: any;
}) => {
  if (error.name !== 'AbortError') {
    updateLoadingState();
    if (error.response?.data.TokenError) {
      await router.push('/login');
      toast.error('Error: ' + 'Invalid Token', {
        style: {
          padding: '15px',
          color: 'white',
          backgroundColor: 'rgb(214, 60, 60)',
        },
      });
    } else {
      toast.error('Error: ' + error.message, {
        style: {
          padding: '15px',
          color: 'white',
          backgroundColor: 'rgb(214, 60, 60)',
        },
      });
    }
  }
};
