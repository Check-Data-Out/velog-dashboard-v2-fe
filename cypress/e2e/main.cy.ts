// ***********************************************************
// 메인 페이지 E2E 테스트
// ***********************************************************

describe('메인 페이지', () => {
  beforeEach(() => {
    // 인증 토큰 설정 (로그인 건너뛰기)
    cy.setAuthCookies();

    // 메인 페이지 방문
    cy.visit('/main');
  });

  it('페이지가 정상적으로 로드되어야 한다', () => {
    cy.waitForPageLoad();
    cy.url().should('include', '/main');
  });

  it('대시보드 통계 정보가 표시되어야 한다', () => {
    // 사이드바 통계 확인
    cy.contains('전체 조회수').should('be.visible');
    cy.contains('전체 좋아요 수').should('be.visible');
    cy.contains('총 게시글 수').should('be.visible');

    // 숫자 값 확인
    cy.contains('2500').should('be.visible'); // totalViews
    cy.contains('350').should('be.visible'); // totalLikes
    cy.contains('15').should('be.visible'); // totalPostCount
  });

  it('게시물 목록이 표시되어야 한다', () => {
    // 게시물 제목 확인
    cy.contains('테스트 게시물 1').should('be.visible');
    cy.contains('테스트 게시물 2').should('be.visible');

    // 게시물 통계 확인
    cy.contains('150').should('be.visible'); // 조회수
    cy.contains('25').should('be.visible'); // 좋아요
  });

  it('정렬 및 필터 기능이 동작해야 한다', () => {
    // 드롭다운 메뉴 확인
    cy.get('select').should('be.visible');

    // 오름차순 체크박스 확인
    cy.get('input[type="checkbox"]').should('be.visible');

    // 새로고침 버튼 확인 (비활성화 상태)
    cy.contains('새로고침').should('be.visible');
    cy.contains('새로고침').should('be.disabled');
  });

  it('마지막 업데이트 시간이 표시되어야 한다', () => {
    // 업데이트 시간 텍스트 확인
    cy.contains('마지막 업데이트').should('be.visible');

    // 날짜 형식 확인 (YYYY-MM-DD 형식이어야 함)
    cy.contains(/\d{4}-\d{2}-\d{2}/).should('be.visible');
  });

  it('로그아웃 기능이 동작해야 한다', () => {
    // 프로필 클릭하여 드롭다운 열기
    cy.get('#profile').click();

    // 로그아웃 버튼 확인
    cy.contains('로그아웃').should('be.visible');

    // 로그아웃 클릭
    cy.contains('로그아웃').click();

    // 로그인 페이지로 리다이렉트 확인
    cy.url().should('include', '/');
  });

  it('빈 데이터 상태를 올바르게 처리해야 한다', () => {
    // 빈 게시물 데이터 응답을 모킹
    cy.intercept('GET', '**/api/posts*', {
      statusCode: 200,
      body: {
        success: true,
        message: '게시물 목록 조회에 성공하였습니다.',
        data: {
          nextCursor: null,
          posts: [], // 빈 배열
        },
        error: null,
      },
    }).as('emptyPostsAPI');

    // 페이지 새로고침하여 빈 데이터 모킹 적용
    cy.reload();

    // 빈 데이터 상태 메시지 확인
    cy.contains('게시물이 없습니다').should('be.visible');
    cy.contains('아직 작성된 게시물이 없습니다. 첫 번째 게시물을 작성해보세요!').should(
      'be.visible',
    );

    // 📝 이모지 아이콘 확인
    cy.contains('📝').should('be.visible');
  });
});
