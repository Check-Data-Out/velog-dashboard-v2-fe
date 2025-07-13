import { BaseSuccess } from '../support';

describe('메인 페이지', () => {
  beforeEach(() => {
    cy.setAuthCookies();
    cy.visit('/main');
  });

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/main');
  });

  it('대시보드 통계 정보가 표시되어야 한다', () => {
    cy.contains('전체 조회수').should('be.visible');
    cy.contains('전체 좋아요 수').should('be.visible');
    cy.contains('총 게시글 수').should('be.visible');

    cy.contains('2500').should('be.visible');
    cy.contains('350').should('be.visible');
    cy.contains('15').should('be.visible');
  });

  it('게시물 목록이 표시되어야 한다', () => {
    cy.contains('테스트 게시물 1').should('be.visible');
    cy.contains('테스트 게시물 2').should('be.visible');

    cy.contains('150').should('be.visible');
    cy.contains('25').should('be.visible');
  });

  it('정렬 및 필터 기능이 동작해야 한다', () => {
    cy.get('select').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains('새로고침').should('be.visible');
    cy.contains('새로고침').should('be.disabled');
  });

  it('마지막 업데이트 시간이 표시되어야 한다', () => {
    cy.contains('마지막 업데이트').should('be.visible');
    cy.contains(/\d{4}-\d{2}-\d{2}/).should('be.visible');
  });

  it('로그아웃 기능이 동작해야 한다', () => {
    cy.get('#profile').click();
    cy.contains('로그아웃').should('be.visible');
    cy.contains('로그아웃').click();
    cy.url().should('include', '/');
  });

  it('빈 데이터 상태를 올바르게 처리해야 한다', () => {
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
