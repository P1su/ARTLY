import React, { useMemo, useState } from 'react';
import styles from './Catalog.module.css';
import CatalogTitle from './CatalogTitle/CatalogTitle';
import CatalogIndex from './CatalogIndex/CatalogIndex';
import CatalogContents from './CatalogContents/CatalogContents';
import { mockCatalog } from './mock/mockCatalog';

const paginateScript = (script, maxLength = 200) => {
  const plain = script.replace(/\n/g, '').trim();
  return Array.from(
    { length: Math.ceil(plain.length / maxLength) },
    (_, i) => plain.slice(i * maxLength, (i + 1) * maxLength)
  );
};

export default function Catalog() {
  const [showIndex, setShowIndex] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const { allPages, sectionStarts } = useMemo(() => {
    const pages = [];
    const starts = [];

    mockCatalog.forEach((item) => {
      const split = paginateScript(item.script);
      starts.push(pages.length);
      split.forEach((text) => {
        pages.push({
          ...item,
          script: text,
        });
      });
    });

    return { allPages: pages, sectionStarts: starts };
  }, []);

  const goPrev = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setCurrentPageIndex((prev) => Math.min(allPages.length - 1, prev + 1));
  };

  const currentSectionIndex = useMemo(() => {
    let result = 0;
    for (let i = 0; i < sectionStarts.length; i++) {
      if (currentPageIndex >= sectionStarts[i]) {
        result = i;
      } else {
        break;
      }
    }
    return result;
  }, [currentPageIndex, sectionStarts]);

  return (
    <div className={styles.catalogLayout}>
      <CatalogTitle onToggleIndex={() => setShowIndex((p) => !p)} />
      <div className={styles.bodyContainer}>
        {showIndex && (
          <>
            <div className={styles.overlay} />
            <CatalogIndex
              onSelect={(pageIndex) => setCurrentPageIndex(pageIndex)}
              onClose={() => setShowIndex(false)}
              currentIndex={currentSectionIndex}
              sectionStarts={sectionStarts}
            />
          </>
        )}
        <CatalogContents
          data={allPages[currentPageIndex]}
          pageIndex={currentPageIndex}
          totalPages={allPages.length}
          onPrev={goPrev}
          onNext={goNext}
          isFirst={currentPageIndex === 0}
          isLast={currentPageIndex === allPages.length - 1}
        />
      </div>
    </div>
  );
}