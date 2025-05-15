import { useParams } from 'react-router-dom';
import { mockNoticeDetail } from './mock/mockNoticeDetail';
import ContentsTitle from './components/ContentsTitle/ContentsTitle';
import ContentsCard from './components/ContentsCard/ContentsCard';
import ContentsInfoSection from './components/ContentsInfoSection/ContentsInfoSection';
import ContentsDetailSection from './components/ContentsDetailSection/ContentsDetailSection';
import styles from './NoticeDetail.module.css';

export default function NoticeDetail() {
  const { noticeId } = useParams();
  const notice = mockNoticeDetail.find((n) => String(n.id) === noticeId);

  if (!notice) {
    return <p>해당 공지가 존재하지 않습니다.</p>;
  }

  const { title, image, period, host, contact, apply, attachment, site, content, } = notice;

  return (
    <section className={styles.noticeLayout}>
      <ContentsTitle title={title} />

      <div className={styles.contentsContainer}>
        <ContentsCard image={image} alt={title} />

        <div className={styles.infoWrapper}>
          <ContentsInfoSection
            period={period}
            host={host}
            contact={contact}
            apply={apply}
            attachment={attachment}
            site={site}
          />

          <hr className={styles.divider} />

          <ContentsDetailSection content={content} />
        </div>
      </div>
    </section>
  );
}
