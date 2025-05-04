import React from 'react';
import styles from './TabNav.module.css';

export default function TabNav({ selectedTab, setSelectedTab }) {
  const tabs = ['My Artly', 'Like', '구매 내역'];
  console.log(selectedTab);
  return (
    <div className={styles.layout}>
      <nav className={styles}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={styles.tabButton}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
