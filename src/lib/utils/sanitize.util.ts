import sanitizeHtml from 'sanitize-html';

// 공지 본문은 백오피스에서 작성한 HTML 이고, 소제목·링크 강조를 인라인 style 로 넣는다.
// sanitize-html 기본값은 style 을 통째로 지우므로 공지에서 쓰는 속성만 값 형식까지 제한해 허용한다.
// (url()·expression() 같은 값과 position 등 레이아웃을 깨는 속성은 허용 목록에 없어 지워진다)
const COLOR = '(#[0-9a-f]{3,8}|rgba?\\([\\d\\s.,%]+\\)|[a-z]+)';
const LENGTH = '\\d+(\\.\\d+)?(px|em|rem|%)?';

const color = new RegExp(`^${COLOR}$`, 'i');
const box = new RegExp(`^${LENGTH}( ${LENGTH}){0,3}$`);

const NOTICE_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['style'] },
  allowedStyles: {
    '*': {
      color: [color],
      background: [color],
      'border-left': [new RegExp(`^\\d+px (solid|dashed|dotted) ${COLOR}$`, 'i')],
      padding: [box],
      margin: [box],
      'font-size': [/^\d+(\.\d+)?(px|em|rem)$/],
      'font-weight': [/^(normal|bold|[1-9]00)$/],
      'text-decoration': [/^(none|underline|line-through)$/],
    },
  },
};

/** 공지 본문 HTML 에서 스크립트·이벤트 핸들러는 지우고, 공지 강조용 인라인 style 은 남긴다 */
export const sanitizeNoticeHtml = (html: string) => sanitizeHtml(html, NOTICE_SANITIZE_OPTIONS);
