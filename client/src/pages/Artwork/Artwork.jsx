import { useState } from 'react';
import styles from './Artwork.module.css';
import { mockArtwork } from './mock/mockArtwork';
import SectionTitle from './components/SectionTitle/SectionTitle';
import ArtworkDetailSection from './components/ArtworkDetailSection/ArtworkDetailSection';
import DocentScript from './components/ArtworkDetailSection/DocentScript/DocentScript';
import DocentSection from './components/DocentSection/DocentSection';

const paginateScript = (script, maxLength = 300) => {
  const chunks = [];
  for (let i = 0; i < script.length; i += maxLength) {
    chunks.push(script.slice(i, i + maxLength));
  }
  return chunks;
};

const Artwork = () => {
  const { title, image, artist, info, script } = mockArtwork;
  const scriptPages = paginateScript(script);
  const [pageIndex, setPageIndex] = useState(0);

  const goToNextPage = () => {
    if (pageIndex < scriptPages.length - 1) setPageIndex(pageIndex + 1);
  };

  const goToPreviousPage = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
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
      </div>

      <div className={styles.bottomBar}>
        <DocentSection />
        <div className={styles.buttonRow}>
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
      </div>
    </div>
  );
};

export default Artwork;
