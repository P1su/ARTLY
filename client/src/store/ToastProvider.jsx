import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from '../components/Toast/Toast';
import styles from '../components/Toast/Toast.module.css';

const ToastContext = createContext();
export const useToastContext = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const addToast = useCallback((toastData, duration = 3000) => {
    let title, message, actions;

    if (typeof toastData === 'string') {
      title = toastData;
      message = null;
      actions = null;
    } else {
      title = toastData.title;
      message = toastData.message;
      actions = toastData.actions;
    }

    const id = Date.now();
    setToast({ id, title, message, duration, actions });
  }, []);

  const removeToast = useCallback((id) => {
    setToast((currentToast) => {
      if (currentToast && currentToast.id === id) {
        return null;
      }
      return currentToast;
    });
  }, []);

  useEffect(() => {
    window.addToast = addToast;
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className={styles.toastContainer}>
        {toast && (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            removeToast={removeToast}
            actions={toast.actions}
          />
        )}
      </div>
    </ToastContext.Provider>
  );
}