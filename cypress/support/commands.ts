import { MOCK_SESSION_TOKEN } from './mock';

const DEFAULT_OPTION = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
} as const;

Cypress.Commands.add('setAuthCookies', () => {
  cy.setCookie('vd_session', MOCK_SESSION_TOKEN, DEFAULT_OPTION);
  cy.wait(100);
});

Cypress.Commands.add('clearAuthCookies', () => {
  cy.clearCookie('vd_session');
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().should('have.property', 'document');
});
