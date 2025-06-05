import styles from './ContentsDetailSection.module.css';

export default function ContentsDetailSection({ content }) {
  return (
    <div className={styles.contentsDetail}>
      <h2 className={styles.heading}>공모내용</h2>
      {content?.split('\n').map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={crypto.randomUUID()} />;
        return <p key={trimmed}>{trimmed}</p>;
      })}
    </div>
  );
}
