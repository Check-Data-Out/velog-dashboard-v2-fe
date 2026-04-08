import { BaseError, BaseSuccess } from '../support';

describe('리더보드 페이지', () => {
  beforeEach(() => {
    cy.setAuthCookies();
    cy.visit('/leaderboards');
  });

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/leaderboards');
  });

  describe('사용자 리더보드', () => {
    it('사용자 리더보드가 표시되어야 한다', () => {
      // Dropdown 컴포넌트는 option에 value 속성 없이 텍스트를 그대로 value로 사용
      cy.get('select').first().should('have.value', '사용자 기준');

      // mock.ts userLeaderboardResponseData 의 username 필드값과 일치해야 함
      cy.contains('topuser1').should('be.visible');
      cy.contains('topuser2').should('be.visible');

      // viewDiff 값 (500, 300) 표시 확인
      cy.contains('500').should('be.visible');
      cy.contains('300').should('be.visible');
    });

    it('1~3위에 순위 스타일이 적용되어야 한다', () => {
      cy.contains('1위').should('be.visible');
      cy.contains('2위').should('be.visible');
      cy.contains('3위').should('be.visible');
    });

    it('작성자명이 표시되어야 한다', () => {
      cy.contains('topuser1').should('be.visible');
      cy.contains('topuser2').should('be.visible');
      cy.contains('topuser3').should('be.visible');
    });
  });

  describe('게시물 리더보드', () => {
    it('게시물 리더보드가 표시되어야 한다', () => {
      cy.get('select').first().select('게시글 기준');

      cy.contains('인기 게시물 1').should('be.visible');
      cy.contains('인기 게시물 2').should('be.visible');

      // viewDiff 값 표시 확인
      cy.contains('200').should('be.visible');
      cy.contains('150').should('be.visible');
    });

    it('게시물 리더보드에서 작성자명이 표시되어야 한다', () => {
      cy.get('select').first().select('게시글 기준');

      // Rank 컴포넌트의 suffix 로 username이 표시됨
      cy.contains('author1').should('be.visible');
      cy.contains('author2').should('be.visible');
    });
  });

  describe('필터 기능', () => {
    it('필터 드롭다운이 4개 존재해야 한다', () => {
      cy.get('select').should('have.length', 4);
    });

    it('정렬 필터(조회수/좋아요)가 동작해야 한다', () => {
      cy.get('select').eq(1).select('좋아요 증가순');
      cy.get('select').eq(1).should('have.value', '좋아요 증가순');

      cy.get('select').eq(1).select('조회수 증가순');
      cy.get('select').eq(1).should('have.value', '조회수 증가순');
    });

    it('표시 개수 필터(10위/30위)가 동작해야 한다', () => {
      cy.get('select').eq(2).select('30위까지');
      cy.get('select').eq(2).should('have.value', '30위까지');

      cy.get('select').eq(2).select('10위까지');
      cy.get('select').eq(2).should('have.value', '10위까지');
    });

    it('기간 필터(7일/30일)가 동작해야 한다', () => {
      cy.get('select').eq(3).select('지난 7일');
      cy.get('select').eq(3).should('have.value', '지난 7일');

      cy.get('select').eq(3).select('지난 30일');
      cy.get('select').eq(3).should('have.value', '지난 30일');
    });

    it('여러 필터를 동시에 변경해도 각 필터 값이 유지되어야 한다', () => {
      cy.get('select').eq(1).select('좋아요 증가순');
      cy.get('select').eq(2).select('30위까지');
      cy.get('select').eq(3).select('지난 7일');

      cy.get('select').eq(1).should('have.value', '좋아요 증가순');
      cy.get('select').eq(2).should('have.value', '30위까지');
      cy.get('select').eq(3).should('have.value', '지난 7일');
    });
  });

  describe('통계 변화량', () => {
    it('조회수 증가순 정렬 시 viewDiff 값이 표시되어야 한다', () => {
      // 기본값: 사용자 기준 + 조회수 증가순 → viewDiff: 500, 300, 250
      cy.contains('500').should('be.visible');
      cy.contains('300').should('be.visible');
      cy.contains('250').should('be.visible');
    });

    it('좋아요 증가순 정렬 시 likeDiff 값이 표시되어야 한다', () => {
      cy.get('select').eq(1).select('좋아요 증가순');

      // mock 데이터 likeDiff: 50, 40, 35
      cy.contains('50').should('be.visible');
      cy.contains('40').should('be.visible');
    });
  });

  describe('빈 데이터 상태', () => {
    it('빈 데이터 상태를 올바르게 처리해야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/leaderboard/user*',
        BaseSuccess({ users: [] }, '사용자 리더보드 조회에 성공하였습니다.'),
      ).as('emptyUserLeaderboardAPI');

      cy.intercept(
        'GET',
        '**/api/leaderboard/post*',
        BaseSuccess({ posts: [] }, '게시물 리더보드 조회에 성공하였습니다.'),
      ).as('emptyPostLeaderboardAPI');

      cy.reload();

      cy.contains('리더보드 데이터가 없습니다').should('be.visible');
      cy.contains('현재 설정된 조건에 맞는 사용자 데이터가 없습니다').should('be.visible');

      cy.get('select').first().select('게시글 기준');
      cy.contains('현재 설정된 조건에 맞는 게시물 데이터가 없습니다').should('be.visible');
    });
  });

  describe('네트워크 오류', () => {
    it('사용자 리더보드 API 서버 오류(500) 시 빈 상태를 처리해야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/leaderboard/user*',
        BaseError(500, '서버 오류가 발생하였습니다.'),
      ).as('serverErrorUserAPI');

      cy.reload();

      cy.contains('리더보드 데이터가 없습니다').should('be.visible');
    });

    it('게시물 리더보드 API 서버 오류(500) 시 빈 상태를 처리해야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/leaderboard/post*',
        BaseError(500, '서버 오류가 발생하였습니다.'),
      ).as('serverErrorPostAPI');

      cy.get('select').first().select('게시글 기준');

      cy.contains('리더보드 데이터가 없습니다').should('be.visible');
    });

    it('서비스 오류 시 리더보드를 빈 상태로 처리해야 한다', () => {
      cy.intercept(
        'GET',
        '**/api/leaderboard/user*',
        BaseError(503, '서비스를 이용할 수 없습니다.'),
      ).as('serviceErrorAPI');

      cy.reload();

      cy.contains('리더보드 데이터가 없습니다').should('be.visible');
    });

    it('느린 네트워크에서도 데이터가 결국 표시되어야 한다', () => {
      cy.intercept('GET', '**/api/leaderboard/user*', (req) => {
        req.reply({
          delay: 2000,
          ...BaseSuccess(
            {
              users: [
                {
                  id: 'user-slow',
                  email: 'slow@example.com',
                  username: 'slowuser',
                  totalViews: 1000,
                  totalLikes: 100,
                  totalPosts: 5,
                  viewDiff: 50,
                  likeDiff: 5,
                  postDiff: 0,
                },
              ],
            },
            '사용자 리더보드 조회에 성공하였습니다.',
          ),
        });
      }).as('slowLeaderboardAPI');

      cy.reload();
      cy.wait('@slowLeaderboardAPI');

      cy.contains('slowuser').should('be.visible');
    });
  });
});
