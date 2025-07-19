import { MOCK_ACCESS_TOKEN, MOCK_REFRESH_TOKEN } from './mock';

const DEFAULT_OPTION = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
} as const;

Cypress.Commands.add('setAuthCookies', () => {
  cy.setCookie('access_token', MOCK_ACCESS_TOKEN, DEFAULT_OPTION);
  cy.setCookie('refresh_token', MOCK_REFRESH_TOKEN, DEFAULT_OPTION);
  cy.wait(100);
});

Cypress.Commands.add('clearAuthCookies', () => {
  cy.clearCookie('access_token');
  cy.clearCookie('refresh_token');
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().should('have.property', 'document');
});
