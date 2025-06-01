import React, { useState } from 'react';
import styles from './Mypage.module.css';
import ProfileCard from './components/ProfileCard/ProfileCard';
import TabLike from './components/TabContent/TabLike/TabLike';
import TabPurchased from './components/TabContent/TabPurchased/TabPurchased';
import TabMyView from './components/TabContent/TabMyView/TabMyView';

export default function MyPage() {
  const [selectedTab, setSelectedTab] = useState('My관람');
  const tabs = ['좋아요', 'My관람', 'MY도록'];

  const renderTabContent = () => {
    switch (selectedTab) {
      case '좋아요':
        return <TabLike />;
      case 'My관람':
        return <TabMyView />;
      case 'MY도록':
        return <TabPurchased />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      <ProfileCard />

      <nav className={styles.mainTab}>
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

      {renderTabContent()}
    </div>
  );
}
