import { sanitizeNoticeHtml } from '../sanitize.util';

describe('sanitizeNoticeHtml', () => {
  it('공지 소제목의 강조 스타일(글자색·배경·왼쪽 테두리 등)을 유지한다', () => {
    const html =
      '<h3 style=" color: rgb(38, 192, 124); font-weight: bold; font-size: 18px; background: rgba(38, 192, 124, 0.12); padding: 10px; border-left: 3px solid rgb(38, 192, 124); margin: 12px 0; ">제목</h3>';

    expect(sanitizeNoticeHtml(html)).toBe(
      '<h3 style="color:rgb(38, 192, 124);font-weight:bold;font-size:18px;background:rgba(38, 192, 124, 0.12);padding:10px;border-left:3px solid rgb(38, 192, 124);margin:12px 0">제목</h3>',
    );
  });

  it('공지 링크 스타일을 유지한다', () => {
    const html =
      '<a href="https://velog.io" target="_blank" style="font-size: 16px; text-decoration: none; color: inherit;">링크</a>';

    expect(sanitizeNoticeHtml(html)).toBe(
      '<a href="https://velog.io" target="_blank" style="font-size:16px;text-decoration:none;color:inherit">링크</a>',
    );
  });

  it('허용하지 않은 스타일 속성과 url() 값은 지운다', () => {
    const html =
      '<h3 style="position: fixed; inset: 0; background: url(https://evil.example/x.png); color: #26c07c;">제목</h3>';

    expect(sanitizeNoticeHtml(html)).toBe('<h3 style="color:#26c07c">제목</h3>');
  });

  it('스크립트와 이벤트 핸들러는 계속 지운다', () => {
    const html = '<script>alert(1)</script><p onclick="alert(1)">본문</p>';

    expect(sanitizeNoticeHtml(html)).toBe('<p>본문</p>');
  });
});
