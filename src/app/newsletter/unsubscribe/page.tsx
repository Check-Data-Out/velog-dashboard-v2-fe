import { Metadata } from 'next';
import { Content } from './Content';

export const metadata: Metadata = { title: '뉴스레터 수신거부' };

type Param = string | string[] | undefined;
const single = (value: Param) => (typeof value === 'string' ? value : undefined);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ uid?: Param; sig?: Param }>;
}) {
  const { uid, sig } = await searchParams;
  return <Content uid={single(uid)} sig={single(sig)} />;
}
