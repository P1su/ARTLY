import React from 'react';
import styles from './InputText.module.css';

export default function InputText({ type = 'text', placeholder, value, onChange }) {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
