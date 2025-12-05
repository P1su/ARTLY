import React, { useEffect, useState } from 'react';
import styles from './AlertModal.module.css';

export default function AlertModal({ isOpen, message, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationClass(styles.slideUp);
    } else if (shouldRender) {
      setAnimationClass(styles.slideDown);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.modalOverlay} ${!isOpen ? styles.fadeOutOverlay : ''}`}
    >
      <div className={`${styles.modalBox} ${animationClass}`}>
        <p className={styles.modalMessage}>{message}</p>
        <button className={styles.modalButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
