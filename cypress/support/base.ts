export const BaseSuccess = <T>(data: T, message: string = '성공적으로 처리되었습니다.') => ({
  statusCode: 200,
  body: {
    success: true,
    message,
    data,
    error: null,
  },
});

export const BaseError = (statusCode: number, message: string) => ({
  statusCode,
  body: {
    success: false,
    message,
    data: null,
    error: {
      name: 'ServerError',
      message,
    },
  },
});
