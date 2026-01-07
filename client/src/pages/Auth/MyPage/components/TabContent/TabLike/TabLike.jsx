import { useEffect, useState } from 'react';
import styles from './TabLike.module.css';
import { userInstance } from '../../../../../../apis/instance';
import ExhibitionCard from '../../../../../Category/Exhibition/Exhibitions/components/ExhibitionCard/ExhibitionCard';
import GalleryCard from '../../../../../Nearby/components/GalleryCard/GalleryCard';
import ArtistCard from '../../../../../Category/Artist/Artists/components/ArtistCard/ArtistCard';
import LoadingSpinner from '../../../../../../components/LoadingSpinner/LoadingSpinner.jsx';

const TABS = [
  { label: '전시회', key: 'exhibition' },
  { label: '갤러리', key: 'gallery' },
  { label: '작품', key: 'artwork' },
  { label: '작가', key: 'artist' },
];

const removeDuplicates = (items) => {
  const uniqueIds = new Set();
  return items.filter((item) => {
    if (uniqueIds.has(item.id)) {
      return false;
    }
    uniqueIds.add(item.id);
    return true;
  });
};

export default function TabLike() {
  const [likedData, setLikedData] = useState({
    exhibition: [],
    gallery: [],
    artwork: [],
    artist: [],
  });
  const [activeTab, setActiveTab] = useState('exhibition');
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    try {
      const likeRes = await userInstance.get('/api/users/me/likes');
      const { data } = likeRes;

      const uniqueExhibitions = removeDuplicates(data.like_exhibitions || []);
      const uniqueGalleries = removeDuplicates(data.like_galleries || []);
      const uniqueArtists = removeDuplicates(data.like_artists || []);

      setLikedData({
        exhibition: removeDuplicates(data.like_exhibitions || []).map((item) => ({
          ...item,
          is_liked: true,
        })),
        gallery: removeDuplicates(data.like_galleries || []).map((item) => ({
          ...item,
          is_liked: true,
        })),
        artist: removeDuplicates(data.like_artists || []).map((item) => ({
          ...item,
          is_liked: true,
        })),
        artwork: [],
      });
    } catch (err) {
      console.log('like fetch err : ', err);
      setLikedData({ exhibition: [], gallery: [], artwork: [], artist: [] });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    

    fetchData();
  }, []);

  const filteredItems = likedData[activeTab] || [];

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
            activeTab === 'exhibition' ? (
              filteredItems.map((item) => (
                <ExhibitionCard
                  key={`exhibition-${item.id}`}
                  exhibitionItem={item}
                  onEvent={fetchData}
                />
              ))
            ) : activeTab === 'gallery' ? (
              filteredItems.map((item) => (
                <GalleryCard key={`gallery-${item.id}`} galleryItem={item} />
              ))
            ) : activeTab === 'artist' ? (
              filteredItems.map((item) => (
                <ArtistCard key={`artist-${item.id}`} artistItem={item} />
              ))
            ) : null
          ) : !isLoading ? (
            <p className={styles.emptyText}>
              좋아요한 {TABS.find((tab) => tab.key === activeTab)?.label}가
              없습니다.
            </p>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </section>
    </div>
  );
}
