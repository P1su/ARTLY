import styles from './ContentsInfoSection.module.css';

export default function ContentsInfoSection({
  startDate,
  endDate,
  host,
  contact,
  apply,
  attachment,
  site,
}) {
  return (
    <div className={styles.info}>
      <p>
        <strong>기간:</strong> {startDate} - {endDate}
      </p>
      <p>
        <strong>공모처:</strong> {host}
      </p>
      <p>
        <strong>문의:</strong> {contact}
      </p>
      <p>
        <strong>지원:</strong> {apply}
      </p>
      {site && (
        <p>
          <strong>사이트:</strong>{' '}
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
