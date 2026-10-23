import { Metadata } from 'next';
import { Content } from './Content';

export const metadata: Metadata = { title: '뉴스레터 수신거부' };

export default function Page() {
  return <Content />;
}
