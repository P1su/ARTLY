import styles from './Artwork.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { instance } from '../../apis/instance.js';
import ArtworkDetailSection from './components/ArtworkDetailSection/ArtworkDetailSection';
import DocentScript from './components/ArtworkDetailSection/DocentScript/DocentScript';
import DocentSection from './components/DocentSection/DocentSection';

const paginateScript = (script, maxLength = 300) => {
  return Array.from({ length: Math.ceil(script?.length / maxLength) }, (_, i) =>
    script.slice(i * maxLength, (i + 1) * maxLength),
  );
};

export default function Artwork() {
  const [artwork, setArtwork] = useState([]);
  const {
    art_image: image,
    art_title: title,
    art_description: info,
    art_docent: script,
    artist_name: artist,
  } = artwork;
  const { artId } = useParams();
  const scriptPages = paginateScript(script);
  const [pageIndex, setPageIndex] = useState(0);

  const goToNextPage = () => {
    setPageIndex((prevIndex) => {
      if (prevIndex < scriptPages.length - 1) return prevIndex + 1;
      return prevIndex;
    });
  };

  const goToPreviousPage = () => {
    setPageIndex((prevIndex) => {
      if (prevIndex > 0) return prevIndex - 1;
      return prevIndex;
    });
  };

  useEffect(() => {
    const getArtwork = async () => {
      //추후 userInstance 수정 논의
      try {
        const response = await instance.get(`/api/arts/${artId}`);
        setArtwork(response.data);
      } catch (error) {
        console.error(error);
        alert('데이터를 받아오는 중 오류가 발생했습니다.');
      }
    };
    getArtwork();
  }, []);

  return (
    <main className={styles.pageContainer}>
      <section className={styles.mainContent}>
        <h2 className={styles.title}>Description</h2>
        {pageIndex === 0 ? (
          <ArtworkDetailSection
            title={title}
            image={image}
            artist={artist}
            info={info}
            script={scriptPages[pageIndex]}
          />
        ) : (
          <DocentScript script={scriptPages[pageIndex]} />
        )}
      </section>

      <section className={styles.bottomContainer}>
        <DocentSection script={script} />
        <div className={styles.buttonContainer}>
          <button
            className={styles.navButton}
            onClick={goToPreviousPage}
            disabled={pageIndex === 0}
          >
            ← 이전 페이지
          </button>
          <button
            className={styles.navButton}
            onClick={goToNextPage}
            disabled={pageIndex === scriptPages.length - 1}
          >
            다음 페이지 →
          </button>
        </div>
      </section>
    </main>
  );
}
