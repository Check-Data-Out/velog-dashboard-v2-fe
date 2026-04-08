import { render, screen } from '@testing-library/react';
import { Inform } from '../Inform';

describe('Inform', () => {
  describe('Inform (루트 컴포넌트)', () => {
    it('children을 렌더링해야 한다', () => {
      render(
        <Inform>
          <span>내용</span>
        </Inform>,
      );
      expect(screen.getByText('내용')).toBeInTheDocument();
    });
  });

  describe('Inform.Title', () => {
    it('제목 텍스트를 렌더링해야 한다', () => {
      render(
        <Inform>
          <Inform.Title>제목입니다</Inform.Title>
        </Inform>,
      );
      expect(screen.getByText('제목입니다')).toBeInTheDocument();
    });

    it('h1 태그로 렌더링되어야 한다', () => {
      render(
        <Inform>
          <Inform.Title>제목</Inform.Title>
        </Inform>,
      );
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  describe('Inform.Content', () => {
    it('내용 텍스트를 렌더링해야 한다', () => {
      render(
        <Inform>
          <Inform.Content>1,234</Inform.Content>
        </Inform>,
      );
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('suffix가 있을 때 suffix를 붙여서 렌더링해야 한다', () => {
      render(
        <Inform>
          <Inform.Content suffix="회">1,234</Inform.Content>
        </Inform>,
      );
      expect(screen.getByText('1,234회')).toBeInTheDocument();
    });

    it('suffix가 없을 때 숫자만 렌더링해야 한다', () => {
      render(
        <Inform>
          <Inform.Content>999</Inform.Content>
        </Inform>,
      );
      expect(screen.getByText('999')).toBeInTheDocument();
    });
  });

  describe('Inform.Highlighted', () => {
    it('강조 텍스트를 렌더링해야 한다', () => {
      render(
        <Inform>
          <Inform.Highlighted>+12%</Inform.Highlighted>
        </Inform>,
      );
      expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    it('suffix가 있을 때 suffix를 붙여서 렌더링해야 한다', () => {
      render(
        <Inform>
          <Inform.Highlighted suffix=" 증가">+50</Inform.Highlighted>
        </Inform>,
      );
      expect(screen.getByText('+50 증가')).toBeInTheDocument();
    });
  });

  describe('Inform.Horizontal', () => {
    it('가로 배치로 children을 렌더링해야 한다', () => {
      render(
        <Inform>
          <Inform.Horizontal>
            <span>왼쪽</span>
            <span>오른쪽</span>
          </Inform.Horizontal>
        </Inform>,
      );
      expect(screen.getByText('왼쪽')).toBeInTheDocument();
      expect(screen.getByText('오른쪽')).toBeInTheDocument();
    });

    it('flex 레이아웃으로 렌더링되어야 한다', () => {
      const { container } = render(
        <Inform>
          <Inform.Horizontal>
            <span>내용</span>
          </Inform.Horizontal>
        </Inform>,
      );
      const horizontal = container.querySelector('.flex.gap-2') as HTMLElement;
      expect(horizontal).toBeInTheDocument();
    });
  });

  describe('복합 사용', () => {
    it('모든 서브컴포넌트를 함께 사용할 수 있어야 한다', () => {
      render(
        <Inform>
          <Inform.Title>전체 조회수</Inform.Title>
          <Inform.Content suffix="회">12,345</Inform.Content>
          <Inform.Highlighted>+15%</Inform.Highlighted>
        </Inform>,
      );
      expect(screen.getByText('전체 조회수')).toBeInTheDocument();
      expect(screen.getByText('12,345회')).toBeInTheDocument();
      expect(screen.getByText('+15%')).toBeInTheDocument();
    });
  });
});
