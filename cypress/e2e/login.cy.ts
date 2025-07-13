describe('로그인 페이지', () => {
  beforeEach(() => {
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
    cy.get('input[name*="accessToken"], input[name*="access"], input[placeholder*="Access"]')
      .first()
      .type('valid_access_token');
    cy.get('input[name*="refreshToken"], input[name*="refresh"], input[placeholder*="Refresh"]')
      .first()
      .type('valid_refresh_token');

    cy.get('button[type="submit"], button:contains("로그인")').first().click();

    cy.url().should('include', '/main');
    cy.waitForPageLoad();
  });

  it('유효하지 않은 토큰으로 로그인 시 에러를 표시해야 한다', () => {
    cy.get('input[name*="accessToken"], input[name*="access"], input[placeholder*="Access"]')
      .first()
      .type('invalid_token');
    cy.get('input[name*="refreshToken"], input[name*="refresh"], input[placeholder*="Refresh"]')
      .first()
      .type('invalid_token');

    cy.get('button[type="submit"], button:contains("로그인")').first().click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('샘플 로그인 버튼이 동작해야 한다', () => {
    cy.contains('체험 계정 로그인').should('be.visible').click();
    cy.url().should('include', '/main');
    cy.waitForPageLoad();
  });
});
