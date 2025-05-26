import React, { useState } from 'react';
import styles from './Mypage.module.css';
import ProfileCard from './components/ProfileCard/ProfileCard';
import TabNav from './components/TabNav/TabNav';
import TabContent from './components/TabContent/TabContent';
import TabMyArtly from './components/TabContent/TabMyArtly/TabMyArtly';
import TabLike from './components/TabContent/TabLike/TabLike';
import TabPurchased from './components/TabContent/TabPurchased/TabPurchased';

export default function MyPage() {
  const [selectedTab, setSelectedTab] = useState('My Artly');

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'My Artly':
        return <TabMyArtly />;
      case 'Like':
        return <TabLike />;
      case '구매 내역':
        return <TabPurchased />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      <ProfileCard />
      <TabNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {renderTabContent()}
    </div>
  );
}
