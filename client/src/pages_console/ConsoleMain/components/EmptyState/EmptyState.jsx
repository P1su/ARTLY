import React from 'react';
import styles from './EmptyState.module.css';

export default function EmptyState({ message, buttonText }) {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
      <p className={styles.buttonText}>{buttonText}</p>
      <p className={styles.instruction}>버튼을 눌러</p>
      <p className={styles.instruction}>새로 등록해 주세요.</p>
    </div>
  );
}
