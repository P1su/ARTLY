import styles from './NewsTableHeader.module.css';

export default function NewsTableHeader() {
  return (
    <thead>
      <tr className={styles.headerRow}>
        <th className="text-center">번호</th>
        <th className="text-center">상태</th>
        <th className="text-left">제목</th>
        <th className="text-center">기간</th>
        <th className="text-center">기관</th>
      </tr>
    </thead>
  );
}
