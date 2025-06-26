import React, { useEffect, useState } from 'react';
import styles from './Mypage.module.css';
import ProfileCard from './components/ProfileCard/ProfileCard';
import TabLike from './components/TabContent/TabLike/TabLike';
import TabPurchased from './components/TabContent/TabPurchased/TabPurchased';
import TabMyView from './components/TabContent/TabMyView/TabMyView';

export default function MyPage() {
  const [selectedTab, setSelectedTab] = useState('좋아요');
  const tabs = ['좋아요', 'MY관람', 'MY도록'];

  useEffect(() => {
    const attendanceModalFlag = localStorage.getItem('showAttendanceModal');
    const fromReservationModalFlag = localStorage.getItem(
      'fromReservationModal',
    );

    if (attendanceModalFlag === 'true' || fromReservationModalFlag === 'true') {
      setSelectedTab('MY관람');
      localStorage.removeItem('fromReservationModal');
    }
  }, []);

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
