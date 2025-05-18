import styles from './NoticeDetail.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import { mockNoticeDetail } from './mock/mockNoticeDetail';
import ContentsTitle from './components/ContentsTitle/ContentsTitle';
import ContentsCard from './components/ContentsCard/ContentsCard';
import ContentsInfoSection from './components/ContentsInfoSection/ContentsInfoSection';
import ContentsDetailSection from './components/ContentsDetailSection/ContentsDetailSection';

export default function NoticeDetail() {
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
  } = notice;

  return (
    <section className={styles.noticeLayout}>
      <ContentsTitle title={title} />

      <div className={styles.contentsContainer}>
        <ContentsCard image={image} alt={title} />

        <div className={styles.infoWrapper}>
          <ContentsInfoSection
            startDate={startDate}
            endDate={endDate}
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
