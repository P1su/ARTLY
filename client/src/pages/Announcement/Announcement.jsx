import React, { useState, useEffect } from 'react';
import styles from './Announcement.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsPinFill } from 'react-icons/bs';
import { useUser } from '../../store/UserProvider';
import { userInstance } from '../../apis/instance';
import AnnouncementModal from './AnnouncementModal';

const categoryList = ['공지사항', 'FAQ'];

export default function Announcement() {
  const { user } = useUser();
  const isAdmin = Number(user?.platform_admin_flag) === 1;

  const [activeTab, setActiveTab] = useState('공지사항');
  const [openItems, setOpenItems] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const [noticeRes, faqRes] = await Promise.all([
        userInstance.get('/api/announcements?category=공지사항'),
        userInstance.get('/api/announcements?category=FAQ'),
      ]);
      const notices = Array.isArray(noticeRes.data) ? noticeRes.data : (noticeRes.data?.data ?? []);
      const faqs = Array.isArray(faqRes.data) ? faqRes.data : (faqRes.data?.data ?? []);
      setAnnouncements([...notices, ...faqs]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const currentData = announcements
    .filter((item) =>
      activeTab === '공지사항'
        ? item.announcement_category !== 'FAQ'
        : item.announcement_category === 'FAQ'
    )
    .sort((a, b) => {
      // 핀 고정 먼저
      const aPinned = Number(a.announcement_pinned) === 1;
      const bPinned = Number(b.announcement_pinned) === 1;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      // 그 다음 최신순
      return Number(b.id) - Number(a.id);
    });

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabChange = (category) => {
    setActiveTab(category);
    setOpenItems({});
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await userInstance.delete(`/api/announcements/${id}`);
      await fetchAnnouncements();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (item, e) => {
    e.stopPropagation();
    setEditItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditItem(null);
    setShowModal(true);
  };

  return (
    <div className={styles.announcementLayout}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>공지사항&FAQ</h1>
        {isAdmin && (
          <button className={styles.writeBtn} onClick={handleCreate}>
            글쓰기
          </button>
        )}
      </div>

      <div className={styles.tabWrapper}>
        {categoryList.map((category) => (
          <button
            key={category}
            className={`${styles.tab} ${activeTab === category ? styles.active : ''}`}
            onClick={() => handleTabChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <ul>
        {currentData.map((item) => {
          const isPinned = Number(item.announcement_pinned) === 1;
          return (
            <li
              key={item.id}
              className={styles.listItem}
              onClick={() => toggleItem(item.id)}
            >
              <div className={styles.buttonField}>
                <span className={styles.titleArea}>
                  {isPinned && <BsPinFill className={styles.pinIcon} />}
                  {item.announcement_title || '(제목 없음)'}
                </span>
                <span>
                  {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {openItems[item.id] && (
                <div className={styles.contentContainer}>
                  {item.announcement_content || '내용이 없습니다.'}

                  {isAdmin && (
                    <div className={styles.adminActions}>
                      <button onClick={(e) => handleEdit(item, e)}>수정</button>
                      <button onClick={(e) => handleDelete(item.id, e)}>삭제</button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {showModal && (
        <AnnouncementModal
          item={editItem}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            await fetchAnnouncements();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}