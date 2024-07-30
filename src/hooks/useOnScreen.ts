import { useEffect, useRef, useState } from 'react';

type UseOnScreenResult = [React.RefObject<HTMLDivElement>, boolean];

const useOnScreen = (offset: number = 0): UseOnScreenResult => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      {
        root: null, // relative to the viewport
        rootMargin: `0px 0px ${offset}px 0px`, // bottom margin for detection
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [offset]);

  return [ref, isIntersecting];
};

export default useOnScreen;
