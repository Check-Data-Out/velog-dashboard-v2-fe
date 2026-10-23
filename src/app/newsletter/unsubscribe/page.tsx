import { Metadata } from 'next';
import { Content } from './Content';

export const metadata: Metadata = { title: '뉴스레터 수신거부' };

type Param = string | string[] | undefined;
const single = (value: Param) => (typeof value === 'string' ? value : undefined);

export default function Page({ searchParams }: { searchParams: { uid?: Param; sig?: Param } }) {
  return <Content uid={single(searchParams.uid)} sig={single(searchParams.sig)} />;
}
