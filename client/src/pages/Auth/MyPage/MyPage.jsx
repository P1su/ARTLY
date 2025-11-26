import React, { useEffect, useState } from 'react';
import styles from './Mypage.module.css';
import ProfileCard from './components/ProfileCard/ProfileCard';
import TabLike from './components/TabContent/TabLike/TabLike';
import TabPurchased from './components/TabContent/TabPurchased/TabPurchased';
import TabMyView from './components/TabContent/TabMyView/TabMyView';
import { useLocation } from 'react-router-dom';

export default function MyPage() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('좋아요');
  const tabs = ['좋아요', 'MY관람', 'MY도록'];

  useEffect(() => {
    if (location.state?.successModal) {
      setSelectedTab('MY관람');
    } else if (location.state?.activeTab) {
      setSelectedTab(location.state.activeTab);
    }
  }, [location.state]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case '좋아요':
        return <TabLike />;
      case 'MY관람':
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
