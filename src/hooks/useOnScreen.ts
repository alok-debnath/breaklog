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

    const element = ref.current; // Create a local variable to store ref.current
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [offset]);

  return [ref, isIntersecting];
};

export default useOnScreen;
