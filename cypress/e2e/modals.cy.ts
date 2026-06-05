import { BaseError, BaseSuccess, recentNotificationsResponseData } from '../support';

describe('모달', () => {
  beforeEach(() => {
    cy.setAuthCookies();
    cy.visit('/main');
    cy.waitForPageLoad();
  });

  describe('QR 로그인 모달', () => {
    beforeEach(() => {
      cy.get('#profile').click();
      cy.contains('QR 로그인').click();
    });

    it('모달이 열리고 타이틀이 표시되어야 한다', () => {
      cy.contains('QR 로그인').should('be.visible');
    });

    it('QR 코드 SVG가 렌더링되어야 한다', () => {
      // QRCodeSVG는 width=171로 렌더링됨 (viewport 1920 > SCREENS.MBI=834)
      cy.get('svg[width="171"]').should('exist');
    });

    it('만료 타이머가 표시되어야 한다', () => {
      // formatTimeToMMSS(300) = '05분 00초'
      cy.wait('@qrLoginAPI');
      cy.contains('만료까지').should('be.visible');
      cy.contains('분').should('be.visible');
      cy.contains('초').should('be.visible');
    });

    it('로딩 완료 후 QR 코드가 흐림 없이 표시되어야 한다', () => {
      cy.wait('@qrLoginAPI');
      // isLoading=false, timeLeft>0 → isUnusable=false → blur-sm 없음
      cy.get('svg[width="171"]').should('not.have.class', 'blur-sm');
    });

    it('로딩 중에는 QR 코드가 흐리게 표시되어야 한다', () => {
      // beforeEach의 API 응답이 React Query 캐시에 남아 있어
      // 단순 재오픈 시 isLoading=false가 됨 → reload로 캐시 초기화 필요
      cy.get('body').type('{esc}');

      cy.intercept('POST', '**/api/qr-login', (req) => {
        req.reply({ delay: 1000, ...BaseSuccess({ token: 'slow_token' }, 'QR 토큰 발급') });
      }).as('slowQRAPI');

      cy.reload();
      cy.waitForPageLoad();
      cy.get('#profile').click();
      cy.contains('QR 로그인').click();

      // 캐시 없음 → isLoading=true → isUnusable=true → blur-sm 적용
      cy.get('svg[width="171"]').should('have.class', 'blur-sm');
    });

    it('로딩 중에는 QR 이미지 영역에 로딩 스타일이 적용되어야 한다', () => {
      cy.get('body').type('{esc}');

      cy.intercept('POST', '**/api/qr-login', (req) => {
        req.reply({ delay: 1000, ...BaseSuccess({ token: 'slow_token' }, 'QR 토큰 발급') });
      }).as('slowQRLoadingAPI');

      cy.reload();
      cy.waitForPageLoad();
      cy.get('#profile').click();
      cy.contains('QR 로그인').click();

      // isUnusable=true → 부모 div에 relative 클래스 → position: relative
      cy.get('svg[width="171"]').parent().should('have.css', 'position', 'relative');
    });

    it('QR 토큰을 복사할 수 있는 복사 버튼이 존재해야 한다', () => {
      cy.wait('@qrLoginAPI');
      // CopyButton은 url prop을 버튼 텍스트로 렌더링: ...?token=mock_qr_token_12345
      cy.contains('mock_qr_token_12345').should('exist');
    });

    it('만료 후 새로고침 버튼이 표시되어야 한다', () => {
      // cy.clock()을 먼저 설치한 뒤 모달을 닫고 재오픈해야
      // useEffect의 setInterval이 fake timer로 생성됨
      cy.clock();
      cy.get('body').type('{esc}');
      cy.get('#profile').click();
      cy.contains('QR 로그인').click();
      cy.wait('@qrLoginAPI');

      cy.tick(300 * 1000);

      // 메인 페이지 새로고침 버튼과 구별하기 위해 모달 내부로 스코프 한정
      cy.get('[class*="000000AA"]').within(() => {
        cy.contains('새로고침').should('be.visible');
      });
    });

    it('만료 후 QR 코드가 흐리게 표시되어야 한다', () => {
      cy.clock();
      cy.get('body').type('{esc}');
      cy.get('#profile').click();
      cy.contains('QR 로그인').click();
      cy.wait('@qrLoginAPI');

      cy.tick(300 * 1000);

      // timeLeft=0 → isUnusable=true → blur-sm 적용
      cy.get('svg[width="171"]').should('have.class', 'blur-sm');
    });

    it('만료 후 복사 버튼이 비활성화되어야 한다', () => {
      cy.clock();
      cy.get('body').type('{esc}');
      cy.get('#profile').click();
      cy.contains('QR 로그인').click();
      cy.wait('@qrLoginAPI');

      cy.tick(300 * 1000);

      // isUnusable=true → CopyButton disabled=true
      cy.contains('mock_qr_token_12345').should('be.disabled');
    });

    it('만료 후 새로고침 버튼을 클릭하면 QR 코드가 재발급되어야 한다', () => {
      cy.clock();
      cy.get('body').type('{esc}');
      cy.get('#profile').click();
      cy.contains('QR 로그인').click();
      cy.wait('@qrLoginAPI');

      cy.tick(300 * 1000);

      cy.intercept(
        'POST',
        '**/api/qr-login',
        BaseSuccess({ token: 'new_token' }, 'QR 토큰 재발급'),
      ).as('refreshQRAPI');

      cy.get('[class*="000000AA"]').within(() => {
        cy.contains('새로고침').click();
      });
      cy.wait('@refreshQRAPI');

      // setTimeLeft(300) 호출 → isUnusable=false → 새로고침 버튼 숨겨짐
      cy.get('[class*="000000AA"]').within(() => {
        cy.contains('새로고침').should('not.exist');
      });
    });

    it('QR 토큰 API 오류 시에도 모달이 닫히지 않아야 한다', () => {
      cy.get('body').type('{esc}');

      cy.intercept('POST', '**/api/qr-login', { statusCode: 500, body: {} }).as('qrErrorAPI');

      cy.get('#profile').click();
      cy.contains('QR 로그인').click();
      cy.wait('@qrErrorAPI');

      // 오류가 발생해도 모달 UI는 유지되어야 함
      cy.contains('QR 로그인').should('be.visible');
    });
  });

  describe('뱃지 생성기 모달', () => {
    beforeEach(() => {
      cy.get('#profile').click();
      cy.contains('뱃지 생성기').click();
    });

    it('모달이 열리고 타이틀이 표시되어야 한다', () => {
      cy.contains('뱃지 생성기').should('be.visible');
    });

    it('레이아웃 형태 드롭다운이 존재해야 한다', () => {
      cy.contains('레이아웃 형태').should('be.visible');
      cy.contains('기본 보기').should('exist');
    });

    it('표시할 통계 체크박스 3개가 기본으로 모두 체크되어야 한다', () => {
      cy.contains('표시할 통계').should('be.visible');
      // BadgeGenerator: assets = { views: true, likes: true, posts: true }
      cy.get('input[id="views"]').should('be.checked');
      cy.get('input[id="likes"]').should('be.checked');
      cy.get('input[id="posts"]').should('be.checked');
    });

    it('체크박스 레이블이 올바르게 표시되어야 한다', () => {
      cy.contains('총 조회수').should('be.visible');
      cy.contains('총 좋아요 수').should('be.visible');
      cy.contains('총 게시물 수').should('be.visible');
    });

    it('체크박스를 해제하면 상태가 반영되어야 한다', () => {
      // Check 컴포넌트의 input은 display:none이므로 force 옵션 필요
      cy.get('input[id="views"]').uncheck({ force: true });
      cy.get('input[id="views"]').should('not.be.checked');
    });

    it('HTML 코드 복사 영역이 표시되어야 한다', () => {
      cy.contains('HTML 코드').should('be.visible');
    });

    it('URL 복사 영역이 표시되어야 한다', () => {
      cy.contains('URL').should('be.visible');
    });

    it('미리보기 영역이 표시되어야 한다', () => {
      cy.contains('미리보기').should('be.visible');
    });

    it('레이아웃을 간단 보기로 변경할 수 있어야 한다', () => {
      cy.contains('레이아웃 형태').parent().find('select').select('간단 보기');
      cy.contains('간단 보기').should('exist');
    });

    it('URL에 username이 포함되어야 한다', () => {
      // me API mock: username = 'testuser'
      cy.contains('testuser').should('exist');
    });

    it('URL에 선택된 assets가 반영되어야 한다', () => {
      cy.contains('assets=views').should('exist');
    });

    it('체크박스 해제 시 URL에서 해당 asset이 제거되어야 한다', () => {
      cy.get('input[id="views"]').uncheck({ force: true });
      cy.get('input[id="likes"]').uncheck({ force: true });
      cy.get('input[id="posts"]').uncheck({ force: true });

      // 모든 asset 해제 → assets 파라미터 자체가 URL에서 제거됨
      cy.contains('assets=').should('not.exist');
    });
  });

  describe('공지사항 모달', () => {
    beforeEach(() => {
      cy.contains('공지사항').click();
    });

    it('모달이 열리고 타이틀이 표시되어야 한다', () => {
      cy.contains('공지사항').should('be.visible');
    });

    it('공지사항 목록이 표시되어야 한다', () => {
      // notificationsResponseData 의 title 필드
      cy.contains('시스템 점검 안내').should('be.visible');
      cy.contains('새로운 기능 업데이트').should('be.visible');
    });

    it('공지사항 내용이 표시되어야 한다', () => {
      cy.contains('시스템 점검이 예정되어 있습니다.').should('be.visible');
      cy.contains('새로운 기능이 추가되었습니다.').should('be.visible');
    });

    it('공지사항 날짜가 표시되어야 한다', () => {
      // created_at: '2025-01-08T09:00:00Z' → KST: '2025-01-08'
      cy.contains('2025-01-08').should('be.visible');
    });

    it('공지사항이 없을 때 모달이 비어있어야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/notis',
        BaseSuccess({ posts: [] }, '공지사항 조회에 성공하였습니다.'),
      ).as('emptyNotisAPI');

      cy.get('body').click(0, 0, { force: true });
      cy.reload();
      cy.waitForPageLoad();

      cy.contains('공지사항').click();
      cy.contains('시스템 점검 안내').should('not.exist');
    });
  });

  describe('공지사항 배너', () => {
    it('최근 4일 이내 공지가 있으면 배너가 표시되어야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/notis',
        BaseSuccess(recentNotificationsResponseData, '공지사항 조회에 성공하였습니다.'),
      ).as('recentNotisAPI');

      // localStorage 초기화 (이전 dismiss 기록 제거)
      cy.clearLocalStorage('noti_expiry');
      cy.reload();
      cy.waitForPageLoad();

      // Notice 컴포넌트: h-[50px] 배너 표시
      cy.contains('📣 새로운 업데이트를 확인해보세요!').should('be.visible');
      cy.contains('확인하기').should('be.visible');
    });

    it('배너의 확인하기 버튼 클릭 시 공지사항 모달이 열려야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/notis',
        BaseSuccess(recentNotificationsResponseData, '공지사항 조회에 성공하였습니다.'),
      ).as('recentNotisAPI');

      cy.clearLocalStorage('noti_expiry');
      cy.reload();
      cy.waitForPageLoad();

      cy.contains('확인하기').click();

      cy.contains('공지사항').should('be.visible');
      cy.contains('긴급 공지사항').should('be.visible');
    });

    it('확인하기 클릭 후 배너가 사라져야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/notis',
        BaseSuccess(recentNotificationsResponseData, '공지사항 조회에 성공하였습니다.'),
      ).as('recentNotisAPI');

      cy.clearLocalStorage('noti_expiry');
      cy.reload();
      cy.waitForPageLoad();

      cy.contains('확인하기').click();

      // 클릭 후 setShow(false) → 배너 숨김
      cy.contains('📣 새로운 업데이트를 확인해보세요!').should('not.be.visible');
    });

    it('4일 이상 지난 공지는 배너가 표시되지 않아야 한다', () => {
      // notificationsResponseData: 2025-01-08 (오래된 날짜) → daysSinceUpdate > 4
      cy.clearLocalStorage('noti_expiry');
      cy.reload();
      cy.waitForPageLoad();

      cy.contains('📣 새로운 업데이트를 확인해보세요!').should('not.be.visible');
    });

    it('공지사항 API 오류 시 배너가 표시되지 않아야 한다', () => {
      cy.intercept('GET', '**/api/notis', { forceNetworkError: true }).as('errorNotisAPI');

      cy.clearLocalStorage('noti_expiry');
      cy.reload();
      cy.waitForPageLoad();

      cy.contains('📣 새로운 업데이트를 확인해보세요!').should('not.be.visible');
    });
  });

  describe('통계 그래프 모달', () => {
    it('전체 조회수 카드 클릭 시 조회수 통계 모달이 열려야 한다', () => {
      // #forTest는 SidebarContent 3개를 담는 aside 엘리먼트
      cy.get('#forTest').contains('전체 조회수').click();
      cy.contains('전체 조회수 통계').should('be.visible');
    });

    it('전체 좋아요 수 카드 클릭 시 좋아요 통계 모달이 열려야 한다', () => {
      cy.get('#forTest').contains('전체 좋아요 수').click();
      cy.contains('전체 좋아요 통계').should('be.visible');
    });

    it('총 게시글 수 카드 클릭 시 게시글 통계 모달이 열려야 한다', () => {
      cy.get('#forTest').contains('총 게시글 수').click();
      cy.contains('총 게시글 통계').should('be.visible');
    });

    it('통계 모달에 라인 차트가 렌더링되어야 한다', () => {
      cy.get('#forTest').contains('전체 조회수').click();
      cy.get('canvas').should('exist');
    });

    it('통계 모달에 7일 전까지 안내 문구가 표시되어야 한다', () => {
      cy.get('#forTest').contains('전체 조회수').click();
      cy.contains('7일 전까지의 데이터만 표시됩니다').should('be.visible');
    });

    it('통계 API 오류 시에도 모달이 열려야 한다', () => {
      cy.intercept('GET', '**/api/total-stats*', BaseError(503, '서비스를 이용할 수 없습니다.')).as(
        'errorTotalStatsAPI',
      );

      cy.get('#forTest').contains('전체 조회수').click();

      // 오류가 발생해도 모달 타이틀은 표시되어야 함
      cy.contains('전체 조회수 통계').should('be.visible');
    });
  });

  describe('헤더 프로필 메뉴', () => {
    it('프로필 클릭 시 드롭다운 메뉴가 열려야 한다', () => {
      cy.get('#profile').click();

      cy.contains('로그아웃').should('be.visible');
      cy.contains('QR 로그인').should('be.visible');
      cy.contains('뱃지 생성기').should('be.visible');
    });

    it('메뉴 외부 클릭 시 드롭다운이 닫혀야 한다', () => {
      cy.get('#profile').click();
      cy.contains('로그아웃').should('be.visible');

      cy.get('body').click(0, 0, { force: true });

      cy.contains('로그아웃').should('not.exist');
    });

    it('username이 프로필 메뉴에 표시되어야 한다', () => {
      // me API mock: username = 'testuser'
      cy.get('#profile').should('contain.text', 'testuser');
    });
  });
});
