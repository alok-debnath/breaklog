import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useUrlQuery = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const replaceQuery = (query: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(query, value);
    replace(`${pathname}?${params.toString()}`);
  };

  const getQuery = (query: string, defaultVal: string) => {
    const queryValue = searchParams.get(query)?.toString() || defaultVal;
    return queryValue;
  };

  return { replaceQuery, getQuery };
};
