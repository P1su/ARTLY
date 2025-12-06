import { createContext, useContext, useState, useCallback } from 'react';
import AlertModal from '../components/AlertModal/AlertModal';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    type: 'default', // 'default' | 'error'
  });

  const showAlert = useCallback((message, type = 'default') => {
    setAlertState({
      isOpen: true,
      message: message,
      type: type,
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
        type={alertState.type}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error('useAlert는 AlertProvider 내에서 사용해야 합니다.');
  return context;
};
