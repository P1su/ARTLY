import React from 'react';
import styles from './NoticeCategoryTabs.module.css';

export default function NoticeCategoryTabs({ activeTab, setActiveTab }) {
  const tabs = ['공모', '프로그램', '채용'];

  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
