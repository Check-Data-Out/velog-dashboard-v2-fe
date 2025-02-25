import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export const useSearchParam = <T extends Record<string, string>>() => {
  const router = useRouter();
  const pathname = usePathname();
  const _searchParams = useSearchParams();
  const searchParams = new URLSearchParams(_searchParams.toString());

  const setNewParams = (newParams: Partial<T>) => {
    for (const [key, value] of Object.entries(newParams)) {
      if (value !== undefined && value !== null) searchParams.set(key, value);
      else searchParams.delete(key);
    }
    return searchParams.toString();
  };

  const setSearchParams = (
    newParams: Partial<T>,
    isReplace: boolean = false,
  ) => {
    if (isReplace) router.replace(`${pathname}?${setNewParams(newParams)}`);

    return router.push(`${pathname}?${setNewParams(newParams)}`);
  };

  return [Object.fromEntries(searchParams) as T, setSearchParams] as const;
};
