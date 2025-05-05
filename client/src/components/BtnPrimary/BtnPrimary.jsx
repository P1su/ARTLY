import React from 'react';
import styles from './BtnPrimary.module.css';

export default function BtnPrimary({ label, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
}