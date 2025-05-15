import ContentsTitle from "./ContentsTitle/ContentsTitle";
import ContentsCard from "./ContentsCard/ContentsCard";
import ContentsInfoSection from "./ContentsInfoSection/ContentsInfoSection";
import ContentsDetailSection from "./ContentsDetailSection/ContentsDetailSection";
import styles from './NoticeContentsSection.module.css';

export default function NoticeContentsSection({ notice }) {
  return (
    <section className={styles.noticeLayout}>
      <ContentsTitle title={notice.title} />

      <div className={styles.contentsContainer}>
        <ContentsCard image={notice.image} alt={notice.title} />

        <div className={styles.infoWrapper}>
          <ContentsInfoSection
            period={notice.period}
            host={notice.host}
            contact={notice.contact}
            apply={notice.apply}
            attachment={notice.attachment}
            site={notice.site}
          />

          <hr className={styles.divider} />

          <ContentsDetailSection content={notice.content} />
        </div>
      </div>
    </section>
  );
}
