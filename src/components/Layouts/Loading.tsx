import { useStore } from '@/stores/store';

const Loading = () => {
  const { loading } = useStore();

  return (
    <>
      <progress
        className={`progress progress-success w-full h-1 rounded-none z-30 fixed top-0 ${
          !loading && 'hidden'
        }`}></progress>
    </>
  );
};

export default Loading;
