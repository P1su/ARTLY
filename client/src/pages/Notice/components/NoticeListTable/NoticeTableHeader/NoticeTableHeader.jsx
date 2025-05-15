import styles from './NoticeTableHeader.module.css';

export default function NoticeTableHeader() {
  return (
    <thead>
      <tr className={styles.headerRow}>
        <th className="text-center">번호</th>
        <th className="text-center">상태</th>
        <th className="text-left">제목</th>
        <th className="text-center">기간</th>
        <th className="text-center">주최</th>
      </tr>
    </thead>
  );
}
