import React from 'react';
import styles from './TabNav.module.css';

export default function TabNav({ selectedTab, setSelectedTab }) {
  const tabs = ['My Artly', 'Like', '구매 내역'];
  console.log(selectedTab);
  return (
    <nav className={styles.layout}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tabButton} ${selectedTab === tab ? styles.active : ''}`}
          onClick={() => setSelectedTab(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
