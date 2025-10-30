import React from 'react';
import styles from './ActionBar.module.css';

export default function ActionBar({ tabList, activeTab, onTabChange }) {
  return (
    <nav className={styles.actionContainer}>
      {tabList.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`${styles.actionButton} ${
            activeTab === tab
              ? styles.actionButtonActive
              : styles.actionButtonInactive
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}