'use client';
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
    if (error.response?.data.SessionError) {
      await router.push('/login');
      toast.custom((t) => (
        <div
          className={`bg-error/20 rounded-2xl px-6 py-4 font-semibold shadow-lg ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}
        >
          Error: Invalid Token
        </div>
      ));
    } else {
      toast.custom((t) => (
        <div
          className={`bg-base-100 text-error border-2 border-error/30 rounded-2xl px-6 py-3 font-semibold shadow-lg ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}
        >
          Error: {error.message}
        </div>
      ));
    }
  }
};

export const handleSuccessToast = async ({ message }: { message: string }) => {
  toast.custom((t) => (
    <div
      className={`bg-base-100 text-success border-2 border-success/30 rounded-2xl px-6 py-3 font-semibold shadow-lg ${
      t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      {message}
    </div>
  ));
};
