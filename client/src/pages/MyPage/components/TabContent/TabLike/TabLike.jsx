import { useEffect, useState } from 'react';
import styles from './TabLike.module.css';
import { instance } from '../../../../../apis/instance';
import SectionCard from '../../Sections/SectionCard/SectionCard';

const TABS = [
  { label: '전시회', key: 'exhibition' },
  { label: '갤러리', key: 'gallery' },
  { label: '작품', key: 'artwork' }, // artwork는 예시입니다. API가 없으므로 이후 구현 필요
  { label: '작가', key: 'artist' },
];

export default function TabLike() {
  const [likedItems, setLikedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('exhibition');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likeRes = await instance.get('/api/users/me/likes');
        const { data } = likeRes;

        const exhibitions = data.like_exhibitions.map((item) => ({
          ...item,
          likeType: 'exhibition',
        }));
        const galleries = data.like_galleries.map((item) => ({
          ...item,
          likeType: 'gallery',
        }));
        const artists = data.like_artists.map((item) => ({
          ...item,
          likeType: 'artist',
        }));

        const allLikedItems = [...exhibitions, ...galleries, ...artists];
        setLikedItems(allLikedItems);
      } catch (err) {
        console.log('like fetch err : ', err);
        setLikedItems([]);
      }
    };

    fetchData();
  }, []);

  const filteredItems = likedItems.filter(
    (item) => item.likeType === activeTab,
  );

  return (
    <div>
      <div className={styles.header}>
        <p className={styles.countText}>
          총<span className={styles.count}>{filteredItems.length}</span>개의{' '}
          {TABS.find((tab) => tab.key === activeTab)?.label}가 있습니다.
        </p>

        <div className={styles.tabButtonContainer}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.cardListSection}>
        <div className={styles.cardList}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <SectionCard
                key={`${item.likeType}-${item.id}`}
                item={item}
                type='like'
              />
            ))
          ) : (
            <p className={styles.emptyText}>
              좋아요한 {TABS.find((tab) => tab.key === activeTab)?.label}가
              없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
