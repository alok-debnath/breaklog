'use client';
import { useStore } from '@/stores/store';

const Loading = () => {
  const { loading } = useStore();

  return (
    <>
      <progress
        className={`progress progress-success fixed top-0 z-30 h-1 w-full rounded-none ${
          !loading && 'hidden'
        }`}
      ></progress>
    </>
  );
};

export default Loading;
