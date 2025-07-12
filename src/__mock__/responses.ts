import { HttpResponse } from 'msw';

// API 프로젝트의 BaseResponseDto 형식에 맞춘 응답 타입
export interface BaseResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}

// 성공 응답
export const BaseSuccess = <T>(
  data: T,
  message: string = '성공적으로 처리되었습니다.',
): HttpResponse =>
  HttpResponse.json<BaseResponseDto<T>>(
    {
      success: true,
      message,
      data,
      error: null,
    },
    { status: 200 },
  );

// 에러 응답
export const BaseError = (statusCode: number, message: string): HttpResponse =>
  HttpResponse.json<BaseResponseDto<null>>(
    {
      success: false,
      message,
      data: null,
      error: message,
    },
    {
      status: statusCode,
      statusText: message,
    },
  );

// 인증 실패 응답
export const UnauthorizedError = (message: string = '인증이 필요합니다.'): HttpResponse =>
  BaseError(401, message);

// 잘못된 요청 응답
export const BadRequestError = (message: string = '잘못된 요청입니다.'): HttpResponse =>
  BaseError(400, message);

// 서버 오류 응답
export const InternalServerError = (
  message: string = '서버 내부 오류가 발생했습니다.',
): HttpResponse => BaseError(500, message);

// 인증 토큰 확인 유틸리티
export const checkAuthTokens = (headers: Headers): boolean => {
  const cookies = headers.get('cookie') || '';
  return cookies.includes('access_token') && cookies.includes('refresh_token');
};
