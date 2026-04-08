import { BaseError } from '../support';

describe('로그인 페이지', () => {
  beforeEach(() => cy.visit('/'));

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/');
  });

  describe('폼 구조', () => {
    it('로그인 폼이 존재해야 한다', () => {
      cy.get('form').should('be.visible');
      cy.get('input[name="accessToken"]').should('be.visible');
      cy.get('input[name="refreshToken"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('Access Token, Refresh Token 입력 필드가 password 타입이어야 한다', () => {
      // 토큰 값이 화면에 노출되지 않도록 type="password" 적용
      cy.get('input[name="accessToken"]').should('have.attr', 'type', 'password');
      cy.get('input[name="refreshToken"]').should('have.attr', 'type', 'password');
    });

    it('입력값이 비어있을 때 로그인 버튼이 비활성화되어야 한다', () => {
      // useForm mode='all' + required 검증 → isValid=false 시 disabled={!isValid}
      cy.get('button#login').should('be.disabled');
    });

    it('하나의 필드만 입력됐을 때 로그인 버튼이 비활성화되어야 한다', () => {
      cy.get('input[name="accessToken"]').type('some_token');
      cy.get('button#login').should('be.disabled');
    });

    it('두 필드 모두 입력 시 로그인 버튼이 활성화되어야 한다', () => {
      cy.get('input[name="accessToken"]').type('any_access_token');
      cy.get('input[name="refreshToken"]').type('any_refresh_token');
      cy.get('button#login').should('not.be.disabled');
    });
  });

  describe('로그인 성공', () => {
    it('유효한 토큰으로 로그인할 수 있어야 한다', () => {
      cy.get('input[name="accessToken"]').type('valid_access_token');
      cy.get('input[name="refreshToken"]').type('valid_refresh_token');

      cy.get('button#login').click();

      cy.url().should('include', '/main');
      cy.waitForPageLoad();
    });
  });

  describe('로그인 실패', () => {
    it('유효하지 않은 토큰 입력 시 로그인 페이지에 머물러야 한다', () => {
      cy.get('input[name="accessToken"]').type('invalid_token');
      cy.get('input[name="refreshToken"]').type('invalid_token');

      cy.get('button#login').click();

      // e2e.ts 에서 accessToken='invalid_token' → 401 반환 → 페이지 이동 없음
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('로그인 API 서버 오류(500) 시 로그인 페이지에 머물러야 한다', () => {
      cy.intercept('POST', '**/api/login', BaseError(500, '서버 오류가 발생하였습니다.')).as(
        'loginServerErrorAPI',
      );

      cy.get('input[name="accessToken"]').type('any_token');
      cy.get('input[name="refreshToken"]').type('any_token');
      cy.get('button#login').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('로그인 API 네트워크 오류 시 로그인 페이지에 머물러야 한다', () => {
      cy.intercept('POST', '**/api/login', { forceNetworkError: true }).as('networkErrorLoginAPI');

      cy.get('input[name="accessToken"]').type('any_token');
      cy.get('input[name="refreshToken"]').type('any_token');
      cy.get('button#login').click();

      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('체험 계정 로그인', () => {
    it('체험 계정 로그인 버튼이 표시되어야 한다', () => {
      cy.contains('체험 계정 로그인').should('be.visible');
    });

    it('체험 계정 로그인 버튼으로 로그인할 수 있어야 한다', () => {
      cy.contains('체험 계정 로그인').click();
      cy.url().should('include', '/main');
      cy.waitForPageLoad();
    });

    it('체험 계정 로그인 API 오류 시 로그인 페이지에 머물러야 한다', () => {
      cy.intercept('POST', '**/api/login-sample', BaseError(500, '서버 오류.')).as(
        'sampleLoginErrorAPI',
      );

      cy.contains('체험 계정 로그인').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('이미 인증된 상태', () => {
    it('이미 로그인된 상태에서 접근해도 로그인 페이지가 표시되어야 한다', () => {
      // 쿠키를 설정해도 로그인 페이지 자체는 접근 가능
      cy.setAuthCookies();
      cy.visit('/');
      cy.get('form').should('be.visible');
    });
  });
});
