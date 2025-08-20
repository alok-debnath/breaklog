'use client';
import { useStore } from '@/stores/store';

const Loading = () => {
  const { loading } = useStore();

  return (
    <>
      <div
        className={`fixed top-0 z-50 h-1 w-full transition-all duration-300 ${
          !loading && 'pointer-events-none opacity-0'
        }`}
      >
        <div className='h-full animate-pulse bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
          <div className='animate-shimmer h-full bg-gradient-to-r from-transparent via-white/20 to-transparent' />
        </div>
      </div>
    </>
  );
};

export default Loading;
