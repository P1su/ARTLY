import React from 'react';
import styles from './CountList.module.css';

export default function CountList({ count }) {
  return (
    <span className={styles.countText}>
      전체 {count}개
    </span>
  );
}
