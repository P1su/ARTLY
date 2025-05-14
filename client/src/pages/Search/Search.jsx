import styles from './Search.module.css';
import { useLocation } from 'react-router-dom';
import { mockSearchResult } from './mock/mockSearchResult.js';
import SearchResultItem from './components/SearchResultItem/SearchResultItem';

export default function Search() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryString = params.get('query');

  const { exhibition, artist, gallery, notice } = mockSearchResult;

  console.log(exhibition);
  return (
    <div className={styles.layout}>
      <h1 className={styles.summaryTitle}>
        <span className={styles.queryStringSpan}>{queryString} </span>에 대한
        검색 결과
      </h1>
      <section className={styles.resultSection}>
        <section>
          <h2 className={styles.categoryTitle}>전시회</h2>
          <ul className={styles.resultList}>
            {exhibition.length === 0 ? (
              <span>검색된 결과가 없습니다.</span>
            ) : (
              exhibition.map(
                ({ exhibitionId, exhibitionImage, exhibitionTitle }) => (
                  <SearchResultItem
                    key={exhibitionId}
                    link={`/exhibitions/${exhibitionId}`}
                    image={exhibitionImage}
                    title={exhibitionTitle}
                  />
                ),
              )
            )}
          </ul>
        </section>
        <section>
          <h2 className={styles.categoryTitle}> 작가</h2>
          <ul className={styles.resultList}>
            {artist.length === 0 ? (
              <span>검색된 결과가 없습니다.</span>
            ) : (
              artist.map(({ artistId, artistImage, artistName }) => (
                <SearchResultItem
                  key={artistId}
                  link={`/artists/${artistId}`}
                  image={artistImage}
                  title={artistName}
                />
              ))
            )}
          </ul>
        </section>
        <section>
          <h2 className={styles.categoryTitle}>갤러리</h2>
          <ul className={styles.resultList}>
            {gallery.length === 0 ? (
              <span>검색된 결과가 없습니다.</span>
            ) : (
              gallery.map(({ galleryId, galleryImage, galleryName }) => (
                <SearchResultItem
                  key={galleryId}
                  link={`/galleries/${galleryId}`}
                  image={galleryImage}
                  title={galleryName}
                />
              ))
            )}
          </ul>
        </section>
        <section>
          <h2 className={styles.categoryTitle}>공고</h2>
          <ul className={styles.resultList}>
            {notice.length === 0 ? (
              <span>검색된 결과가 없습니다.</span>
            ) : (
              notice.map(({ noticeId, noticeImage, noticeTitle }) => (
                <SearchResultItem
                  key={noticeId}
                  link={`/notices/${noticeId}`}
                  image={noticeImage}
                  title={noticeTitle}
                />
              ))
            )}
          </ul>
        </section>
      </section>
    </div>
  );
}
