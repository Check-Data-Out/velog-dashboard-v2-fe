import { BaseError, BaseSuccess, postsFirstData, postsStatsResponseData } from '../support';

describe('메인 페이지', () => {
  beforeEach(() => {
    cy.setAuthCookies();
    cy.visit('/main');
  });

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/main');
  });

  describe('대시보드 통계', () => {
    it('대시보드 통계 정보가 표시되어야 한다', () => {
      cy.contains('전체 조회수').should('be.visible');
      cy.contains('전체 좋아요 수').should('be.visible');
      cy.contains('총 게시글 수').should('be.visible');

      cy.contains('2,500').should('be.visible');
      cy.contains('350').should('be.visible');
      cy.contains('15').should('be.visible');
    });

    it('통계 카드를 클릭하면 통계 그래프 모달이 열려야 한다', () => {
      cy.contains('클릭해서 통계 그래프 보기').first().click();
      cy.contains('전체 조회수 통계').should('be.visible');
    });

    it('어제 대비 증가분이 통계 카드에 표시되어야 한다', () => {
      // totalViews(2500) - yesterdayViews(180) = 2,320
      cy.contains('2,320').should('be.visible');
    });
  });

  describe('게시물 목록', () => {
    it('게시물 목록이 표시되어야 한다', () => {
      cy.contains('테스트 게시물 1').should('be.visible');
      cy.contains('테스트 게시물 2').should('be.visible');

      cy.get('section').should('contain.text', '150');
      cy.get('section').should('contain.text', '25');
      cy.get('section').should('contain.text', '200');
      cy.get('section').should('contain.text', '35');
    });

    it('게시물 카드를 클릭하면 그래프 영역이 펼쳐져야 한다', () => {
      // cy.get('section').first()는 Summary 모바일 토글 section(MBI:hidden)을 잡으므로
      // 포스트 Section 컴포넌트는 class에 'h-fit'을 가짐
      cy.get('section[class*="h-fit"]')
        .first()
        .within(() => {
          cy.contains('150').click();
        });

      // Graph 컴포넌트 내 날짜 선택 드롭다운 표시 확인
      cy.contains('미선택').should('be.visible');
      cy.contains('날짜를 선택해서 데이터를 확인하세요!').should('be.visible');
    });

    it('그래프 날짜 범위를 선택하면 차트 데이터가 로드되어야 한다', () => {
      cy.get('section[class*="h-fit"]')
        .first()
        .within(() => {
          cy.contains('150').click();
        });

      cy.get('section[class*="h-fit"]').first().find('select').first().select('지난 7일');

      // 날짜 선택 후 안내 문구 사라짐
      cy.contains('날짜를 선택해서 데이터를 확인하세요!').should('not.exist');
    });

    it('그래프 조회수/좋아요 탭이 존재해야 한다', () => {
      cy.get('section[class*="h-fit"]')
        .first()
        .within(() => {
          cy.contains('150').click();
        });

      cy.get('section[class*="h-fit"]')
        .first()
        .within(() => {
          cy.contains('조회수').should('be.visible');
          cy.contains('좋아요').should('be.visible');
        });
    });

    it('게시물 항목의 외부 링크 아이콘을 클릭하면 새 창으로 이동해야 한다', () => {
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.contains('테스트 게시물 1')
        .parents('section')
        .first()
        .find('[title="해당 글로 바로가기"]')
        .click({ force: true });

      cy.get('@windowOpen').should('have.been.called');
    });
  });

  describe('무한 스크롤', () => {
    it('스크롤 시 다음 페이지 게시물이 로드되어야 한다', () => {
      cy.contains('테스트 게시물 1').should('be.visible');
      cy.get('section').last().scrollIntoView();

      cy.contains('테스트 게시물 3').should('be.visible');
      cy.contains('테스트 게시물 4').should('be.visible');
    });

    it('마지막 페이지(nextCursor: null)에서 추가 fetch가 발생하지 않아야 한다', () => {
      // 마지막 페이지(nextCursor=null) 반환
      cy.intercept('GET', '**/api/posts*', (req) => {
        req.reply(
          BaseSuccess(
            { nextCursor: null, posts: postsFirstData.posts },
            '게시물 목록 조회에 성공하였습니다.',
          ),
        );
      }).as('lastPagePostsAPI');

      cy.reload();
      // 초기 로드가 완료될 때까지 대기
      cy.contains('테스트 게시물 1').should('be.visible');

      // 초기 로드 후 요청 수 기록
      cy.get('@lastPagePostsAPI.all').then(($before) => {
        const countBefore = $before.length;

        // 스크롤 후 추가 fetch가 발생하지 않아야 함
        cy.get('section').last().scrollIntoView();
        cy.get('@lastPagePostsAPI.all').should('have.length', countBefore);
      });
    });
  });

  describe('정렬 및 필터', () => {
    it('정렬 컨트롤(체크박스, 드롭다운, 새로고침)이 존재해야 한다', () => {
      // Check 컴포넌트는 label > div(시각적) + input.hidden 구조
      cy.contains('오름차순').should('be.visible');
      cy.get('select').should('exist');
      cy.contains('새로고침').should('be.visible');
    });

    it('오름차순 체크박스를 토글하면 URL 파라미터가 변경되어야 한다', () => {
      // Check 컴포넌트의 실제 input은 display:none이므로 label(오름차순 텍스트)을 클릭
      cy.contains('오름차순').click();
      cy.url().should('include', 'asc=true');

      cy.contains('오름차순').click();
      cy.url().should('include', 'asc=false');
    });

    it('정렬 드롭다운 선택 시 URL 파라미터가 변경되어야 한다', () => {
      cy.get('select').first().select('조회순');
      cy.url().should('include', 'sort=dailyViewCount');

      cy.get('select').first().select('좋아요순');
      cy.url().should('include', 'sort=dailyLikeCount');

      cy.get('select').first().select('작성일순');
      cy.url().should('include', 'sort=');
    });

    it('URL 파라미터가 페이지 리로드 후에도 유지되어야 한다', () => {
      cy.contains('오름차순').click();
      cy.url().should('include', 'asc=true');

      cy.reload();

      cy.url().should('include', 'asc=true');
    });
  });

  describe('마지막 업데이트', () => {
    it('마지막 업데이트 시간이 표시되어야 한다', () => {
      cy.contains('마지막 업데이트').should('exist');
      // lastUpdatedDate: '2025-01-09T00:00:00Z' → KST '2025-01-09'
      cy.get('body').should('contain.text', '2025');
    });
  });

  describe('새로고침 버튼', () => {
    it('새로고침 버튼이 초기에는 활성화되어 있어야 한다', () => {
      cy.contains('button', '새로고침').should('not.be.disabled');
    });

    it('새로고침 버튼 클릭 시 비활성화되어야 한다', () => {
      cy.clock();
      cy.contains('button', '새로고침').click();
      cy.wait('@statsRefreshAPI');

      // status=true → disabled={true}
      // cy.contains('button', '새로고침') 은 <button> 요소만 찾으므로 토스트 div와 구별됨
      cy.contains('button', '새로고침').should('be.disabled');
    });

    it('새로고침 클릭 시 시작 토스트가 표시되어야 한다', () => {
      cy.clock();
      cy.contains('button', '새로고침').click();
      cy.wait('@statsRefreshAPI');

      cy.contains('통계 새로고침이 시작되었습니다!').should('be.visible');
    });

    it('새로고침 완료 응답 수신 시 버튼이 재활성화되고 완료 토스트가 표시되어야 한다', () => {
      cy.clock();
      cy.contains('button', '새로고침').click();
      cy.wait('@statsRefreshAPI');

      // 5초 후 2차 폴링 → 완료(409 + lastUpdatedAt) 반환
      cy.intercept('POST', '**/api/stats-refresh', {
        statusCode: 409,
        body: {
          success: false,
          message: '이미 새로고침이 완료되었습니다.',
          data: { lastUpdatedAt: '2025-01-09T10:00:00Z' },
          error: { name: 'StatsAlreadyRefreshedError', message: '이미 새로고침이 완료되었습니다.' },
        },
      }).as('statsRefreshCompletedAPI');

      cy.tick(1000 * 5);
      cy.wait('@statsRefreshCompletedAPI');

      cy.contains('button', '새로고침').should('not.be.disabled');
      cy.contains('새로고침이 완료되었습니다!').should('be.visible');
    });

    it('이미 새로고침이 완료된 상태에서 버튼 클릭 시 오류 토스트가 표시되어야 한다', () => {
      cy.intercept('POST', '**/api/stats-refresh', {
        statusCode: 409,
        body: {
          success: false,
          message: '이미 최신 상태입니다.',
          data: { lastUpdatedAt: '2025-01-09T10:00:00Z' },
          error: { name: 'StatsAlreadyRefreshedError', message: '이미 최신 상태입니다.' },
        },
      }).as('alreadyRefreshedAPI');

      cy.contains('button', '새로고침').click();
      cy.wait('@alreadyRefreshedAPI');

      cy.get('.Toastify').should('be.visible');
    });
  });

  describe('로그아웃', () => {
    it('로그아웃 기능이 동작해야 한다', () => {
      cy.get('#profile').click();
      cy.contains('로그아웃').should('be.visible');
      cy.contains('로그아웃').click();
      cy.url().should('include', '/');
    });
  });

  describe('빈 데이터 상태', () => {
    it('게시물이 없을 때 빈 상태 화면이 표시되어야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/posts*',
        BaseSuccess({ nextCursor: null, posts: [] }, '게시물 목록 조회에 성공하였습니다.'),
      ).as('emptyPostsAPI');

      cy.reload();

      cy.contains('게시물이 없습니다').should('be.visible');
      cy.contains('아직 작성된 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!').should(
        'be.visible',
      );
      cy.contains('📝').should('be.visible');
    });
  });

  describe('네트워크 오류', () => {
    it('게시물 API 서버 오류(500) 시 빈 상태가 표시되어야 한다', () => {
      cy.intercept('GET', '**/api/posts*', BaseError(500, '서버 오류가 발생하였습니다.')).as(
        'serverErrorPostsAPI',
      );

      cy.reload();

      cy.contains('게시물이 없습니다').should('be.visible');
    });

    it('게시물 API 서비스 오류 시 빈 상태가 표시되어야 한다', () => {
      cy.intercept('GET', '**/api/posts*', BaseError(503, '서비스를 이용할 수 없습니다.')).as(
        'serviceErrorPostsAPI',
      );

      cy.reload();

      cy.contains('게시물이 없습니다').should('be.visible');
    });

    it('통계 API 오류 시에도 게시물 목록이 표시되어야 한다', () => {
      cy.intercept('GET', '**/api/posts-stats', BaseError(503, '서비스를 이용할 수 없습니다.')).as(
        'serviceErrorStatsAPI',
      );

      cy.reload();

      // 통계 없이도 게시물 목록은 표시되어야 함
      cy.contains('테스트 게시물 1').should('be.visible');
    });

    it('느린 네트워크에서도 게시물 목록이 결국 표시되어야 한다', () => {
      cy.intercept('GET', '**/api/posts*', (req) => {
        req.reply({
          delay: 2000,
          ...BaseSuccess(postsFirstData, '게시물 목록 조회에 성공하였습니다.'),
        });
      }).as('slowPostsAPI');

      cy.reload();
      cy.wait('@slowPostsAPI');

      cy.contains('테스트 게시물 1').should('be.visible');
    });

    it('통계 API 느린 응답에서도 페이지가 정상 로드되어야 한다', () => {
      cy.intercept('GET', '**/api/posts-stats', (req) => {
        req.reply({
          delay: 3000,
          ...BaseSuccess(postsStatsResponseData, '게시물 통계 조회에 성공하였습니다.'),
        });
      }).as('slowStatsAPI');

      cy.reload();

      cy.contains('오름차순').should('be.visible');
      cy.wait('@slowStatsAPI');
      cy.contains('2,500').should('be.visible');
    });

    it('게시물과 통계 API 동시 오류 시 UI가 깨지지 않아야 한다', () => {
      cy.intercept('GET', '**/api/posts*', BaseError(503, '서비스를 이용할 수 없습니다.')).as(
        'errorPostsAPI',
      );
      cy.intercept('GET', '**/api/posts-stats', BaseError(503, '서비스를 이용할 수 없습니다.')).as(
        'errorStatsAPI',
      );

      cy.reload();

      cy.get('body').should('be.visible');
      cy.contains('게시물이 없습니다').should('be.visible');
    });
  });
});
