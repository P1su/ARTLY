import styles from './NearbyGalleries.module.css';
import { useEffect, useState } from 'react';
import { instance } from '../../../../apis/instance.js';
import GalleryCard from '../GalleryCard/GalleryCard';

export default function NearbyGalleries({ lat, lng }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const getNaerbyGalleries = async () => {
      try {
        const response = await instance.get('/api/galleries', {
          params: {
            latitude: lat,
            longitude: lng,
          },
        });

        setResults(response.data);
      } catch (error) {
        console.error(error);
        alert('주변 갤러리를 불러오는데 실패했습니다');
      }
    };

    getNaerbyGalleries();
  }, [lat, lng]);

  return (
    <section className={styles.layout}>
      <div>
        <h2 className={styles.searchTitle}>주변 갤러리 검색 결과</h2>
        <p className={styles.resultNumParagraph}>
          총 <span className={styles.highlightSpan}>{results.length}</span> 개의
          갤러리
        </p>
      </div>
      {results.map((item) => (
        <GalleryCard key={item.id} results={item} />
      ))}
    </section>
  );
}
