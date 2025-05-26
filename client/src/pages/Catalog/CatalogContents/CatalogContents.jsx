import styles from './CatalogContents.module.css';

export default function CatalogContents({
  data,
  pageIndex,
  totalPages,
  onPrev,
  onNext,
  isFirst,
  isLast
}) {
  return (
    <div className={styles.container}>
      {!isFirst && (
        <button onClick={onPrev} className={styles.arrowLeft}>〈</button>
      )}
      {!isLast && (
        <button onClick={onNext} className={styles.arrowRight}>〉</button>
      )}
      <div className={styles.page}>
        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className={styles.image}
          />
        )}
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.meta}>
          {data.artist} · {data.info}
        </p>
        <p className={styles.script}>{data.script}</p>
        <p className={styles.pageCount}>
          페이지 {pageIndex + 1} / {totalPages}
        </p>
      </div>
    </div>
  );
}
