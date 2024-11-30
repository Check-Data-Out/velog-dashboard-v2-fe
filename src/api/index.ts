import returnFetch from 'return-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error('BASE_URL가 ENV에서 설정되지 않았습니다.');
}

export const instance = returnFetch({
  baseUrl: BASE_URL,
  headers: { Accept: 'application/json' },
  interceptors: {
    response: async (response) => {
      if (!response.ok) throw response;
      return response;
    },
  },
});
