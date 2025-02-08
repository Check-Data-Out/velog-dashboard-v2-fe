import { HttpResponse } from 'msw';

export const BaseSuccess = (data: object | null) =>
  HttpResponse.json(
    { success: true, message: '성공적으로 동작하였습니다', data, error: null },
    { status: 200 },
  );

export const BaseError = (code: number, message: string) =>
  HttpResponse.json(
    {
      success: false,
      message,
      data: null,
      error: {
        code: message,
        statusCode: code,
      },
    },
    { status: code, statusText: message },
  );
