import styles from './NoticeDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import ContentsTitle from './components/ContentsTitle/ContentsTitle';
import ContentsCard from './components/ContentsCard/ContentsCard';
import ContentsInfoSection from './components/ContentsInfoSection/ContentsInfoSection';
import ContentsDetailSection from './components/ContentsDetailSection/ContentsDetailSection';

export default function NoticeDetail() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
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
    announcement_status: status,
    created_at: createdAt,
    views,
  } = notice;

  const formatDateRange = (start, end) => {
    const format = (dateStr) => dateStr?.split(' ')[0];
    return `${format(start)} ~ ${format(end)}`;
  };

  return (
    <section className={styles.noticeLayout}>
      <ContentsTitle title={title} status={status} category={category} />

      <hr className={styles.divider} />

      <div className={styles.contentsContainer}>
        <ContentsCard image={image} alt={title} />

        <div className={styles.infoWrapper}>
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

          <ContentsDetailSection content={content} />
        </div>
        <hr className={styles.divider} />

        <p className={styles.noticeText}>
          * 아트맵에 등록된 이미지와 글의 저작권은 각 작가와 필자에게 있습니다.
        </p>

        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          목록으로
        </button>
      </div>
    </section>
  );
}
