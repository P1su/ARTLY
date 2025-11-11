import React from 'react';
import styles from './BtnPrimary.module.css';

export default function BtnPrimary({ label, onClick, type = "button" }) {
  return (
    <button className={styles.button} onClick={onClick} type={type}>
      {label}
    </button>
  );
}