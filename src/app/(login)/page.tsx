import { Metadata } from 'next';
import { Content } from './Content';

export const metadata: Metadata = {
  title: '로그인',
  description: '대시보드 페이지에 진입하기 전 표시되는 로그인 페이지',
};

export default function Page() {
  return <Content />;
}
