import React, { useEffect, useState, useRef } from 'react';
import styles from './AlertModal.module.css';

export default function AlertModal({
  isOpen,
  message,
  onClose,
  type = 'default',
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const buttonRef = useRef(null);

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

  useEffect(() => {
    if (isOpen && shouldRender && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const isError = type === 'error';

  const buttonClass = isError
    ? `${styles.modalButton} ${styles.errorButton}`
    : styles.modalButton;

  const messageClass = isError
    ? `${styles.modalMessage} ${styles.errorMessage}`
    : styles.modalMessage;

  return (
    <div
      className={`${styles.modalOverlay} ${!isOpen ? styles.fadeOutOverlay : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modalBox} ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={messageClass}>{message}</p>

        <button ref={buttonRef} className={buttonClass} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
