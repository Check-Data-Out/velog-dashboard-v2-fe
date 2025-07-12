// ***********************************************************
// Cypress 커스텀 명령어
// ***********************************************************

import { MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN } from '../../src/__mock__/handlers';

// 인증 토큰을 쿠키에 설정하여 로그인 상태를 모킹
Cypress.Commands.add('setAuthCookies', () => {
  cy.setCookie('access_token', MOCK_ACCESS_TOKEN, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
  cy.setCookie('refresh_token', MOCK_REFRESH_TOKEN, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });

  // API 호출 확인을 위한 대기
  cy.wait(100);
});

// 인증 토큰을 쿠키에서 제거
Cypress.Commands.add('clearAuthCookies', () => {
  cy.clearCookie('access_token');
  cy.clearCookie('refresh_token');
});

// 페이지 로드를 기다립니다
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().should('have.property', 'document');
});
