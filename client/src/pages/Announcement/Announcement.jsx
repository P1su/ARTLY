import React, { useState } from 'react';
import styles from './Announcement.module.css';
import { announcementData, FAQData } from './utils/announcementData';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const categoryList = ['공지사항', 'FAQ'];

export default function Announcement() {
  const [activeTab, setActiveTab] = useState('공지사항');
  const [openItems, setOpenItems] = useState({});

  const currentData = activeTab === '공지사항' ? announcementData : FAQData;

  const toggleItem = (index) => {
    const isOpen = openItems[index];

    if (isOpen) {
      setOpenItems((prev) => ({ ...prev, [index]: false }));
      return;
    }

    setOpenItems((prev) => ({ ...prev, [index]: true }));
  };

  // 탭 변경 시 열린 아이템들 초기화
  const handleTabChange = (category) => {
    setActiveTab(category);
    setOpenItems({});
  };
  return (
    <div className={styles.announcementLayout}>
      <h1 className={styles.heading}>공지사항&FAQ</h1>
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
        {currentData.map((item, index) => (
          <li
            key={item.id}
            className={styles.listItem}
            onClick={() => {
              toggleItem(index);
            }}
          >
            <div className={styles.buttonField}>
              {item.title}
              <span>
                {openItems[index] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            {openItems[index] && (
              <div className={styles.contentContainer}>
                {item.content.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < item.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
