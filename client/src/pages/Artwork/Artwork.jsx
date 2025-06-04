import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Artwork.module.css';
import SectionTitle from './components/SectionTitle/SectionTitle';
import ArtworkDetailSection from './components/ArtworkDetailSection/ArtworkDetailSection';
import DocentScript from './components/ArtworkDetailSection/DocentScript/DocentScript';
import DocentSection from './components/DocentSection/DocentSection';
import { instance } from '../../apis/instance.js';

const paginateScript = (script, maxLength = 300) => {
  return Array.from(
    { length: Math.ceil(script.length / maxLength) },
    (_, i) => script.slice(i * maxLength, (i + 1) * maxLength)
  );
};

export default function Artwork() {
  const { artId } = useParams();  // get artId from URL params

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [artist, setArtist] = useState('');
  const [info, setInfo] = useState('');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const scriptPages = paginateScript(script);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);

    const fetchArtworkData = async (id) => {
      try {
        const { data: artworkData } = await instance.get('/api/arts/' + id);

        setTitle(artworkData.art_title);
        setImage(artworkData.art_image);
        setArtist(artworkData.artist_name);
        setInfo(artworkData.art_description);
        setScript(artworkData.art_docent);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          console.error('Error fetching artwork data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    // fetch artwork data
    if (artId) fetchArtworkData(artId);

  }, [artId]);

  const goToNextPage = () => {
    setPageIndex(prevIndex => {
      if (prevIndex < scriptPages.length - 1) return prevIndex + 1;
      return prevIndex;
    });
  };

  const goToPreviousPage = () => {
    setPageIndex(prevIndex => {
      if (prevIndex > 0) return prevIndex - 1;
      return prevIndex;
    });
  };

  if (loading) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.loadingMessage}>
          작품 정보를 불러오는 중입니다...
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.notFoundMessage}>
          해당하는 작품을 찾을 수 없습니다.
        </div>
      </main>
    );
  }

  return (
    <main className={styles.pageContainer}>
      <section className={styles.mainContent}>
        <SectionTitle title="Description" />
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
