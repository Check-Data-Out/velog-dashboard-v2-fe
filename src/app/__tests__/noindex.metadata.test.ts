import { metadata as unsubscribeMetadata } from '../newsletter/unsubscribe/page';
import { metadata as qrLoginMetadata } from '../qr-login/page';

// 메일·QR 링크로만 들어오는 화면은 검색 결과에 노출하지 않는다
describe('링크 전용 화면 metadata', () => {
  it.each([
    ['/newsletter/unsubscribe', unsubscribeMetadata],
    ['/qr-login', qrLoginMetadata],
  ])('%s 는 검색 엔진이 색인·링크 추적하지 않도록 한다', (_, metadata) => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
