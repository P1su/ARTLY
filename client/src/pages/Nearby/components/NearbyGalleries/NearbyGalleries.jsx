import styles from './NearbyGalleries.module.css';
import { useEffect, useState } from 'react';
import { instance } from '../../../../apis/instance.js';
import GalleryCard from '../GalleryCard/GalleryCard';

export default function NearbyGalleries({ lat, lng }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const pageLen = Math.ceil(results.length / itemsPerPage);
  const currentPageData = results.slice(
    (page - 1) * itemsPerPage,
    itemsPerPage * page,
  );
  console.log(page, pageLen);

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
      {currentPageData.map((item) => (
        <GalleryCard key={item.id} results={item} />
      ))}
      <button
        disabled={page === 1}
        onClick={() => {
          setPage((prev) => prev - 1);
        }}
      >
        이전
      </button>
      <button
        disabled={page === pageLen}
        onClick={() => {
          setPage((prev) => prev + 1);
        }}
      >
        다음
      </button>
    </section>
  );
}
