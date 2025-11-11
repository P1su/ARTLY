import { useEffect } from 'react';
import useToast from '../../hooks/useToast';
import styles from './Toast.module.css';

export default function Toast({ id, title, message, duration, removeToast }) {
  
  const { start, clear, done, isExiting } = useToast(() => {
    removeToast(id);
  }, duration);

  const handleMouseEnter = () => clear();
  const handleMouseLeave = () => start();

  useEffect(() => {
    start();
  }, [start]);
  
  const toastClassName = `${styles.toast} ${isExiting ? styles.exiting : ''}`;

  const handleAnimationEnd = () => {
    if (isExiting) {
      done();
    }
  };

  return (
    <div
      className={toastClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.title}>{title}</div>
      {message && (
        <div className={styles.message}>{message}</div>
      )}
    </div>
  );
}