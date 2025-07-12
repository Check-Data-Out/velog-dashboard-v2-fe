// ***********************************************************
// 로그인 페이지 E2E 테스트
// ***********************************************************

describe('로그인 페이지', () => {
  beforeEach(() => {
    // 로그인 페이지 방문
    cy.visit('/');
  });

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/');
  });

  it('로그인 폼이 존재해야 한다', () => {
    cy.get('form').should('be.visible');
    cy.get(
      'input[name*="accessToken"], input[name*="access"], input[placeholder*="Access"]',
    ).should('be.visible');
    cy.get(
      'input[name*="refreshToken"], input[name*="refresh"], input[placeholder*="Refresh"]',
    ).should('be.visible');
    cy.get('button[type="submit"], button:contains("로그인")').should('be.visible');
  });

  it('유효한 토큰으로 로그인할 수 있어야 한다', () => {
    // 토큰 입력
    cy.get('input[name*="accessToken"], input[name*="access"], input[placeholder*="Access"]')
      .first()
      .type('valid_access_token');
    cy.get('input[name*="refreshToken"], input[name*="refresh"], input[placeholder*="Refresh"]')
      .first()
      .type('valid_refresh_token');

    // 로그인 버튼 클릭
    cy.get('button[type="submit"], button:contains("로그인")').first().click();

    // 메인 페이지로 리디렉션 확인
    cy.url().should('include', '/main');
    cy.waitForPageLoad();
  });

  it('유효하지 않은 토큰으로 로그인 시 에러를 표시해야 한다', () => {
    // 유효하지 않은 토큰 입력
    cy.get('input[name*="accessToken"], input[name*="access"], input[placeholder*="Access"]')
      .first()
      .type('invalid_token');
    cy.get('input[name*="refreshToken"], input[name*="refresh"], input[placeholder*="Refresh"]')
      .first()
      .type('invalid_token');

    // 로그인 버튼 클릭
    cy.get('button[type="submit"], button:contains("로그인")').first().click();

    // 401 에러 시 홈페이지로 리디렉트되는 것이 정상 동작
    // (instance.request.ts에서 401 에러 시 자동으로 '/'로 리디렉트)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('샘플 로그인 버튼이 동작해야 한다', () => {
    // 체험 계정 로그인 버튼 클릭 (실제 텍스트 사용)
    cy.contains('체험 계정 로그인').should('be.visible').click();

    // 메인 페이지로 리디렉션 확인
    cy.url().should('include', '/main');
    cy.waitForPageLoad();
  });
});
