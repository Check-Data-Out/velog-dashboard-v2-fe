import { Metadata } from 'next';
import { Content } from './Content';

export const metadata: Metadata = { title: 'QR 로그인' };

export default function Page({ searchParams }: { searchParams: { token?: string | string[] } }) {
  const { token } = searchParams;
  return <Content token={typeof token === 'string' ? token : undefined} />;
}
