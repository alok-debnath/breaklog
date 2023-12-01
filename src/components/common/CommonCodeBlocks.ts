import toast from 'react-hot-toast';
import { useStore } from '@/stores/store';

export const handleError = (error: any): void => {
  if (error.name !== 'AbortError') {
    useStore.setState(() => ({ loading: false }));
    toast.error('Error: ' + error.message, {
      style: {
        padding: '15px',
        color: 'white',
        backgroundColor: 'rgb(214, 60, 60)',
      },
    });
  }
};
