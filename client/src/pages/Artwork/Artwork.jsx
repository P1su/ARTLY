import { useState } from 'react';
import styles from './Artwork.module.css';
import { mockArtwork } from './mock/mockArtwork';
import SectionTitle from './components/SectionTitle/SectionTitle';
import ArtworkDetailSection from './components/ArtworkDetailSection/ArtworkDetailSection';
import DocentScript from './components/ArtworkDetailSection/DocentScript/DocentScript';
import DocentSection from './components/DocentSection/DocentSection';

const paginateScript = (script, maxLength = 300) => {
  return Array.from(
    { length: Math.ceil(script.length / maxLength) },
    (_, i) => script.slice(i * maxLength, (i + 1) * maxLength)
  );
};

export default function Artwork() {
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
        <DocentSection />
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
