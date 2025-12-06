import { createContext, useState, useCallback, useContext } from 'react';
import AlertModal from '../components/AlertModal/AlertModal'; // 경로 확인 필요

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
  });

  const showAlert = useCallback((message) => {
    setAlertState({
      isOpen: true,
      message: message,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal
        isOpen={alertState.isOpen}
        message={alertState.message}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
}

// 편하게 쓰기 위한 커스텀 훅
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
