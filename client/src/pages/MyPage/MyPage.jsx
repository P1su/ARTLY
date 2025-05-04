import React, { useState } from 'react';
import styles from './Mypage.module.css';
import ProfileCard from './components/ProfileCard/ProfileCard';
import TabNav from './components/TabNav/TabNav';
import TabContent from './components/TabContent/TabContent';

export default function MyPage() {
  const [selectedTab, setSelectedTab] = useState('MyArtly');
  return (
    <div className={styles.layout}>
      <ProfileCard />
      <TabNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <TabContent tab={selectedTab} />
    </div>
  );
}
