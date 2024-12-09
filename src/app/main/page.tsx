import type { Metadata } from 'next';
import { Content } from './Content';

export const metadata: Metadata = {
  title: '대시보드',
  description: '각종 Velog 통계를 볼 수 있는 대시보드',
};

export default function Home() {
  return <Content />;
}
