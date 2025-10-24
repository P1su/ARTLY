import styles from './TermsPolicy.module.css';
import { useState } from 'react';
import { termsPolicyData, privacyPolicyData } from './data/termsData';

export default function TermsPolicy() {
  const categoryList = ['이용약관', '개인정보처리방침'];

  const [activeTab, setActiveTab] = useState('이용약관');
  const currentData =
    activeTab === '이용약관' ? termsPolicyData : privacyPolicyData;

  const handleTabChange = (category) => {
    setActiveTab(category);
  };

  return (
    <section className={styles.termsLayout}>
      <h1 className={styles.mainTitle}>이용약관</h1>
      <div className={styles.tabWrapper}>
        {categoryList.map((category) => (
          <button
            key={category}
            className={`${styles.tab} ${activeTab === category ? styles.active : ''}`}
            onClick={() => handleTabChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={styles.contentContainer}>{currentData.content}</div>
    </section>
  );
}
