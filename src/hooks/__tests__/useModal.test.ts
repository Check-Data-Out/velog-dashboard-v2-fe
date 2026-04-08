import { act } from '@testing-library/react';
import { useModal } from '../useModal';

describe('useModal', () => {
  beforeEach(() => {
    act(() => {
      useModal.setState({ modal: null });
    });
  });

  it('초기 상태에서 modal이 null이어야 한다', () => {
    const { modal } = useModal.getState();
    expect(modal).toBeNull();
  });

  describe('open', () => {
    it('notice 타입 모달을 열 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'notice' });
      });
      expect(useModal.getState().modal).toEqual({ type: 'notice' });
    });

    it('qrcode 타입 모달을 열 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'qrcode' });
      });
      expect(useModal.getState().modal).toEqual({ type: 'qrcode' });
    });

    it('badge 타입 모달을 열 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'badge' });
      });
      expect(useModal.getState().modal).toEqual({ type: 'badge' });
    });

    it('stats 타입 모달을 name과 함께 열 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'stats', name: 'view' });
      });
      expect(useModal.getState().modal).toEqual({ type: 'stats', name: 'view' });
    });

    it('stats 타입 모달에 like를 전달할 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'stats', name: 'like' });
      });
      expect(useModal.getState().modal).toEqual({ type: 'stats', name: 'like' });
    });

    it('stats 타입 모달에 post를 전달할 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'stats', name: 'post' });
      });
      expect(useModal.getState().modal).toEqual({ type: 'stats', name: 'post' });
    });

    it('모달을 다른 타입으로 교체할 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'notice' });
      });
      act(() => {
        useModal.getState().open({ type: 'badge' });
      });
      expect(useModal.getState().modal).toEqual({ type: 'badge' });
    });
  });

  describe('close', () => {
    it('열린 모달을 닫을 수 있어야 한다', () => {
      act(() => {
        useModal.getState().open({ type: 'notice' });
      });
      act(() => {
        useModal.getState().close();
      });
      expect(useModal.getState().modal).toBeNull();
    });

    it('이미 닫힌 상태에서 close를 호출해도 null을 유지해야 한다', () => {
      act(() => {
        useModal.getState().close();
      });
      expect(useModal.getState().modal).toBeNull();
    });
  });
});
