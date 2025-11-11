import React from 'react';
import styles from './RegisterButton.module.css';

export default function RegisterButton({ 
  buttonText, 
  onButtonClick 
}) {
  return (
    <button 
      onClick={onButtonClick}
      className={styles.registerButton}
    >
      {buttonText}
    </button>
  );
}
