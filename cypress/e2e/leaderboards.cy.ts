describe('리더보드 페이지', () => {
  beforeEach(() => {
    cy.setAuthCookies();
    cy.visit('/leaderboards');
  });

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/leaderboards');
  });

  it('사용자 리더보드가 표시되어야 한다', () => {
    cy.get('select').first().should('have.value', '사용자 기준');

    cy.contains('user1').should('be.visible');
    cy.contains('user2').should('be.visible');

    cy.contains('500').should('be.visible');
    cy.contains('300').should('be.visible');
  });

  it('게시물 리더보드가 표시되어야 한다', () => {
    cy.get('select').first().select('게시글 기준');

    cy.contains('인기 게시물 1').should('be.visible');
    cy.contains('인기 게시물 2').should('be.visible');

    cy.contains('200').should('be.visible');
    cy.contains('150').should('be.visible');
  });

  it('필터 기능이 동작해야 한다', () => {
    cy.get('select').should('have.length', 4);

    cy.get('select').eq(1).select('좋아요 증가순');
    cy.get('select').eq(1).select('조회수 증가순');

    cy.get('select').eq(2).select('30위까지');
    cy.get('select').eq(2).select('10위까지');

    cy.get('select').eq(3).select('지난 7일');
    cy.get('select').eq(3).select('지난 30일');
  });

  it('랭킹 순위가 표시되어야 한다', () => {
    cy.get('[data-testid="rank"], [class*="rank"]').should('be.visible');
    cy.contains('1').should('be.visible');
    cy.contains('2').should('be.visible');
  });

  it('통계 변화량이 표시되어야 한다', () => {
    cy.contains('500').should('be.visible');
    cy.contains('300').should('be.visible');
    cy.contains('250').should('be.visible');

    cy.get('select').eq(1).select('좋아요 증가순');
    cy.contains('50').should('be.visible');
    cy.contains('40').should('be.visible');
  });

  it('빈 데이터 상태를 올바르게 처리해야 한다', () => {
    cy.intercept('GET', '**/api/leaderboard/user*', {
      statusCode: 200,
      body: {
        success: true,
        message: '사용자 리더보드 조회에 성공하였습니다.',
        data: {
          users: [],
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
          posts: [],
        },
        error: null,
      },
    }).as('emptyPostLeaderboardAPI');

    cy.reload();

    cy.contains('리더보드 데이터가 없습니다').should('be.visible');
    cy.contains('현재 설정된 조건에 맞는 사용자 데이터가 없습니다').should('be.visible');

    cy.get('select').first().select('게시글 기준');
    cy.contains('현재 설정된 조건에 맞는 게시물 데이터가 없습니다').should('be.visible');
  });
});
