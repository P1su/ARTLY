import { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    isDanger: false,
    resolve: null, // Promise의 resolve 함수를 저장할 곳
  });

  // confirm 호출 함수
  const showConfirm = useCallback((message, isDanger = false) => {
    return new Promise((resolve) => {
      // 1. 상태를 업데이트하여 모달을 엽니다.
      // 2. 여기서 만든 resolve 함수를 state에 저장해둡니다.
      setConfirmState({
        isOpen: true,
        message,
        isDanger,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState.resolve) {
      confirmState.resolve(true); // Promise를 true로 해결 (사용자가 확인 누름)
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    if (confirmState.resolve) {
      confirmState.resolve(false); // Promise를 false로 해결 (사용자가 취소 누름)
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState]);

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        isDanger={confirmState.isDanger}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context)
    throw new Error('useConfirm must be used within a ConfirmProvider');
  return context;
};
