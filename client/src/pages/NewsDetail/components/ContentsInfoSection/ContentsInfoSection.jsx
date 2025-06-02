import styles from './ContentsInfoSection.module.css';

export default function ContentsInfoSection({
  startDate,
  host,
  contact,
  apply,
  attachment,
  site,
}) {
  return (
    <div className={styles.info}>
      <p>
        <strong className={styles.label}>기간 </strong> {startDate}
      </p>
      <p>
        <strong className={styles.label}>기관 </strong> {host}
      </p>
      <p>
        <strong className={styles.label}>문의 </strong> {contact}
      </p>
      <p>
        <strong className={styles.label}>지원 </strong> {apply}
      </p>
      {site && (
        <p>
          <strong className={styles.label}>사이트 </strong>{' '}
          <a href={site} target='_blank' rel='noreferrer'>
            {site}
          </a>
        </p>
      )}
      {attachment && (
        <p>
          <strong>첨부파일:</strong>{' '}
          <a href={attachment.url} target='_blank' rel='noreferrer'>
            {attachment.name}
          </a>
        </p>
      )}
    </div>
  );
}
