import returnFetch from 'return-fetch';

export const instace = returnFetch({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { Accept: 'application/json' },
});
