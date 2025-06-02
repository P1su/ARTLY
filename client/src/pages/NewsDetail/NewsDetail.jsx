import styles from './NewsDetail.module.css';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import ContentsInfoSection from './components/ContentsInfoSection/ContentsInfoSection.jsx';

export default function NewsDetail() {
  const { noticeId } = useParams();
  const [notice, setNotice] = useState({});

  const getNoticeDetail = async () => {
    try {
      const response = await instance.get(`/api/announcements/${noticeId}`);
      setNotice(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getNoticeDetail();
  }, []);

  if (!notice) {
    return <p>해당 공지가 존재하지 않습니다.</p>;
  }

  const {
    announcement_title: title,
    announcement_poster: image,
    announcement_start_datetime: startDate,
    announcement_end_datetime: endDate,
    announcement_organizer: host,
    announcement_contact: contact,
    announcement_support_detail: apply,
    announcement_attachment_url: attachment,
    announcement_site_url: site,
    announcement_content: content,
    announcement_category: category,
    created_at: createdAt,
    views,
  } = notice;

  const formatDateRange = (start, end) => {
    const format = (dateStr) => dateStr?.split(' ')[0];
    return `${format(start)} ~ ${format(end)}`;
  };

  return (
    <section className={styles.noticeLayout}>
      <span className={styles.categorySpan}>{category}</span>
      <h1 className={styles.newsTitle}>{title}</h1>
      <hr className={styles.divider} />

      <div className={styles.contentsContainer}>
        <img
          className={styles.newsImage}
          src={image}
          alt={`${title} 대표 이미지`}
        />

        <ContentsInfoSection
          startDate={formatDateRange(startDate, endDate)}
          host={host}
          contact={contact}
          apply={apply}
          attachment={attachment}
          site={site}
          createdAt={createdAt}
          views={views}
        />

        <p className={styles.contentParagraph}>{content}</p>
        <hr className={styles.divider} />

        <p className={styles.noticeText}>
          * 아트맵에 등록된 이미지와 글의 저작권은 각 작가와 필자에게 있습니다.
        </p>

        <Link className={styles.backButton} to='/notices'>
          목록으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
