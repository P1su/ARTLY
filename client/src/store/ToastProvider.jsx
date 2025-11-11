import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';
import styles from '../components/Toast/Toast.module.css';

const ToastContext = createContext();
export const useToastContext = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const addToast = useCallback((toastData, duration = 1000) => {
    let title, message;

    if (typeof toastData === 'string') {
      title = toastData;
      message = null;
    } else {
      title = toastData.title;
      message = toastData.message;
    }

    const id = Date.now();
    
    setToast({ id, title, message, duration });
  }, []);

  const removeToast = useCallback((id) => {
    setToast((currentToast) => {
      if (currentToast && currentToast.id === id) {
        return null;
      }
      return currentToast;
    });
  }, []);

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
          />
        )}
      </div>
    </ToastContext.Provider>
  );
}