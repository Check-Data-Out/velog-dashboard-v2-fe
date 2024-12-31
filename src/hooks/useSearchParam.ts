import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export const useSearchParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const _searchParams = useSearchParams();
  const searchParams = new URLSearchParams(_searchParams.toString());

  const setNewParams = (newParams: Record<string, string>) => {
    for (const [key, value] of Object.entries(newParams)) {
      if (value !== undefined && value !== null) searchParams.set(key, value);
      else searchParams.delete(key);
    }
    return searchParams.toString();
  };

  const setSearchParams = (newParams: Record<string, string>) => {
    return router.push(`${pathname}?${setNewParams(newParams)}`);
  };

  return {
    searchParams: Object.fromEntries(searchParams),
    setSearchParams,
  };
};
