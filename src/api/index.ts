import returnFetch from 'return-fetch';

export const instance = returnFetch({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { Accept: 'application/json' },
  interceptors: {
    response: async (response) => {
      if (!response.ok) throw response;
      return response;
    },
  },
});
