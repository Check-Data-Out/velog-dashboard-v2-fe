import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from '../Dropdown';

describe('Dropdown', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('옵션 렌더링', () => {
    it('문자열 옵션 목록을 렌더링해야 한다', () => {
      render(
        <Dropdown
          options={['옵션1', '옵션2', '옵션3']}
          onChange={mockOnChange}
          defaultValue="옵션1"
        />,
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('옵션1')).toBeInTheDocument();
      expect(screen.getByText('옵션2')).toBeInTheDocument();
      expect(screen.getByText('옵션3')).toBeInTheDocument();
    });

    it('튜플 옵션의 첫 번째 값(key)을 표시해야 한다', () => {
      render(
        <Dropdown
          options={[
            ['표시값', '실제값'],
            ['표시값2', '실제값2'],
          ]}
          onChange={mockOnChange}
          defaultValue={['표시값', '실제값']}
        />,
      );
      expect(screen.getByText('표시값')).toBeInTheDocument();
      expect(screen.getByText('표시값2')).toBeInTheDocument();
    });

    it('defaultValue가 문자열일 때 기본 선택값으로 설정되어야 한다', () => {
      render(
        <Dropdown
          options={['옵션1', '옵션2', '옵션3']}
          onChange={mockOnChange}
          defaultValue="옵션2"
        />,
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('옵션2');
    });

    it('defaultValue가 튜플일 때 key를 기본 선택값으로 설정해야 한다', () => {
      render(
        <Dropdown
          options={[
            ['표시값', '실제값'],
            ['표시값2', '실제값2'],
          ]}
          onChange={mockOnChange}
          defaultValue={['표시값2', '실제값2']}
        />,
      );
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('표시값2');
    });
  });

  describe('onChange 동작', () => {
    it('문자열 옵션 선택 시 해당 문자열로 onChange가 호출되어야 한다', () => {
      render(
        <Dropdown
          options={['옵션A', '옵션B', '옵션C']}
          onChange={mockOnChange}
          defaultValue="옵션A"
        />,
      );
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '옵션B' } });
      expect(mockOnChange).toHaveBeenCalledWith('옵션B');
    });

    it('튜플 옵션 선택 시 value(두 번째 값)로 onChange가 호출되어야 한다', () => {
      render(
        <Dropdown
          options={[
            ['표시값1', '실제값1'],
            ['표시값2', '실제값2'],
          ]}
          onChange={mockOnChange}
          defaultValue={['표시값1', '실제값1']}
        />,
      );
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '표시값2' } });
      expect(mockOnChange).toHaveBeenCalledWith('실제값2');
    });

    it('세 번째 값이 true인 튜플 선택 시 전체 튜플을 반환해야 한다', () => {
      const options: [string, string, boolean][] = [
        ['표시값1', '실제값1', true],
        ['표시값2', '실제값2', true],
      ];
      render(<Dropdown options={options} onChange={mockOnChange} defaultValue={options[0]} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '표시값2' } });
      expect(mockOnChange).toHaveBeenCalledWith(['표시값2', '실제값2', true]);
    });
  });

  describe('disabled 상태', () => {
    it('disabled=true일 때 select가 비활성화되어야 한다', () => {
      render(
        <Dropdown
          options={['옵션1', '옵션2']}
          onChange={mockOnChange}
          defaultValue="옵션1"
          disabled={true}
        />,
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('disabled=false일 때 select가 활성화되어야 한다', () => {
      render(
        <Dropdown
          options={['옵션1', '옵션2']}
          onChange={mockOnChange}
          defaultValue="옵션1"
          disabled={false}
        />,
      );
      expect(screen.getByRole('combobox')).toBeEnabled();
    });
  });
});
