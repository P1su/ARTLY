import { useEffect, useState } from 'react';
import styles from './TabLike.module.css';
import { userInstance } from '../../../../../../apis/instance';
// no direct navigation here; cards handle their own links
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

export default function TabLike() {
  const [likedData, setLikedData] = useState({
    exhibition: [],
    gallery: [],
    artwork: [],
    artist: [],
  });
  const [activeTab, setActiveTab] = useState('exhibition');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    const fetchData = async () => {
      try {
        const likeRes = await userInstance.get('/api/users/me/likes');
        const { data } = likeRes;

        setLikedData({
        exhibition: data.like_exhibitions || [],
        gallery: data.like_galleries || [],
        artist: data.like_artists || [],
        artwork: [],
      });
    } catch (err) {
      console.log('like fetch err : ', err);
      setLikedData({ exhibition: [], gallery: [], artwork: [], artist: [] });
    } finally {
      setIsLoading(false);
    }
  };

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
                filteredItems.map((item, index) => (
                  <ExhibitionCard
                    key={`exhibition-${item.id}-${index}`}
                    exhibitionItem={item}
                  />
                ))
              ) : activeTab === 'gallery' ? (
                filteredItems.map((item, index) => (
                  <GalleryCard 
                    key={`gallery-${item.id}-${index}`}
                    galleryItem={item} />
                ))
              ) : activeTab === 'artist' ? (
                filteredItems.map((item, index) => (
                  <ArtistCard 
                    key={`artist-${item.id}-${index}`} 
                    artistItem={item} />
                ))
              ) : null
            ) : (
              !isLoading ? (
              <p className={styles.emptyText}>
                좋아요한 {TABS.find((tab) => tab.key === activeTab)?.label}가
                없습니다.
              </p>
              ) : ( <LoadingSpinner /> )
            )
          }
        </div>
      </section>
    </div>
  );
}
