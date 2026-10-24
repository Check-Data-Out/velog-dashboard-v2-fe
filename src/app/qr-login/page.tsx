import { Metadata } from 'next';
import { Content } from './Content';

export const metadata: Metadata = { title: 'QR 로그인', robots: { index: false, follow: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  return <Content token={typeof token === 'string' ? token : undefined} />;
}
