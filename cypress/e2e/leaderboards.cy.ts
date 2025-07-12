// ***********************************************************
// 리더보드 페이지 E2E 테스트
// ***********************************************************

describe('리더보드 페이지', () => {
  beforeEach(() => {
    // 인증 토큰 설정 (로그인 건너뛰기)
    cy.setAuthCookies();

    // 리더보드 페이지 방문
    cy.visit('/leaderboards');
  });

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/leaderboards');
  });

  it('사용자 리더보드가 표시되어야 한다', () => {
    // 사용자 리더보드 기본 선택 확인 (기본값이 '사용자 기준'이므로)
    cy.get('select').first().should('have.value', '사용자 기준');

    // 사용자 정보 확인 (이메일 앞부분 표시)
    cy.contains('user1').should('be.visible');
    cy.contains('user2').should('be.visible');

    // 통계 정보 확인 (viewDiff 값들)
    cy.contains('500').should('be.visible'); // user1의 viewDiff
    cy.contains('300').should('be.visible'); // user2의 viewDiff
  });

  it('게시물 리더보드가 표시되어야 한다', () => {
    // 게시물 리더보드로 전환
    cy.get('select').first().select('게시글 기준');

    // 게시물 정보 확인
    cy.contains('인기 게시물 1').should('be.visible');
    cy.contains('인기 게시물 2').should('be.visible');

    // 통계 정보 확인 (viewDiff 값들)
    cy.contains('200').should('be.visible'); // post1의 viewDiff
    cy.contains('150').should('be.visible'); // post2의 viewDiff
  });

  it('필터 기능이 동작해야 한다', () => {
    // 4개의 드롭다운 확인 (기준, 정렬, 개수, 기간)
    cy.get('select').should('have.length', 4);

    // 정렬 옵션 변경 테스트
    cy.get('select').eq(1).select('좋아요 증가순');
    cy.get('select').eq(1).select('조회수 증가순');

    // 개수 제한 변경 테스트
    cy.get('select').eq(2).select('30위까지');
    cy.get('select').eq(2).select('10위까지');

    // 기간 필터 변경 테스트
    cy.get('select').eq(3).select('지난 7일');
    cy.get('select').eq(3).select('지난 30일');
  });

  it('랭킹 순위가 표시되어야 한다', () => {
    // 순위 표시 확인
    cy.get('[data-testid="rank"], [class*="rank"]').should('be.visible');
    cy.contains('1').should('be.visible'); // 1위
    cy.contains('2').should('be.visible'); // 2위
  });

  it('통계 변화량이 표시되어야 한다', () => {
    // 변화량 숫자 확인 (기본 사용자 리더보드, 조회수 기준)
    cy.contains('500').should('be.visible'); // user1의 viewDiff
    cy.contains('300').should('be.visible'); // user2의 viewDiff
    cy.contains('250').should('be.visible'); // user3의 viewDiff

    // 좋아요 기준으로 변경
    cy.get('select').eq(1).select('좋아요 증가순');
    cy.contains('50').should('be.visible'); // user1의 likeDiff
    cy.contains('40').should('be.visible'); // user2의 likeDiff
  });

  it('빈 데이터 상태를 올바르게 처리해야 한다', () => {
    // 빈 데이터 응답을 모킹
    cy.intercept('GET', '**/api/leaderboard/user*', {
      statusCode: 200,
      body: {
        success: true,
        message: '사용자 리더보드 조회에 성공하였습니다.',
        data: {
          users: [], // 빈 배열
        },
        error: null,
      },
    }).as('emptyUserLeaderboardAPI');

    cy.intercept('GET', '**/api/leaderboard/post*', {
      statusCode: 200,
      body: {
        success: true,
        message: '게시물 리더보드 조회에 성공하였습니다.',
        data: {
          posts: [], // 빈 배열
        },
        error: null,
      },
    }).as('emptyPostLeaderboardAPI');

    // 페이지 새로고침하여 빈 데이터 모킹 적용
    cy.reload();

    // 빈 데이터 상태 메시지 확인
    cy.contains('리더보드 데이터가 없습니다').should('be.visible');
    cy.contains('현재 설정된 조건에 맞는 사용자 데이터가 없습니다').should('be.visible');

    // 게시물 리더보드로 전환하여 빈 데이터 상태 확인
    cy.get('select').first().select('게시글 기준');
    cy.contains('현재 설정된 조건에 맞는 게시물 데이터가 없습니다').should('be.visible');
  });
});
