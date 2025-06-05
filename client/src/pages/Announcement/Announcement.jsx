import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./Announcement.module.css";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const categoryList = ["공지사항", "FAQ"];

export default function Announcement() {
  const [activeTab, setActiveTab] = useState("공지사항");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openItems, setOpenItems] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/announcements", {
        params: { category: activeTab },
      });
      setItems(data);
    } catch (err) {
      console.error("목록 불러오기 실패:", err);
      setItems([]);
    } finally {
      setIsLoading(false);
      setOpenItems({});
      setExpandedItems({});
    }
  }, [activeTab]);

  const toggleItem = async (index, id) => {
    const isOpen = openItems[index];
    if (isOpen) {
      setOpenItems((prev) => ({ ...prev, [index]: false }));
      return;
    }

    if (!expandedItems[id]) {
      try {
        const { data } = await axios.get(`/api/announcements/${id}`);
        setExpandedItems((prev) => ({ ...prev, [id]: data }));
      } catch (err) {
        console.error("상세 불러오기 실패:", err);
      }
    }

    setOpenItems((prev) => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>공지사항&FAQ</h1>
      <div className={styles.tabWrapper}>
        {categoryList.map((category) => (
          <button
            key={category}
            className={`${styles.tab} ${activeTab === category ? styles.active : ""}`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className={styles.loading}>불러오는 중...</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={item.id} className={styles.card}>
              <button
                onClick={() => toggleItem(index, item.id)}
                className={styles.cardHeader}
              >
                <div className={styles.cardHeaderRow}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.right}>
                    <span className={styles.arrow}>
                      {openItems[index] ? <FaChevronUp />  : <FaChevronDown />}
                    </span>
                  </div>
                </div>
              </button>

              {openItems[index] && expandedItems[item.id] && (
                <div className={styles.cardBody}>
                  <p>제목: {expandedItems[item.id].announcement_title}</p>
                  <p>내용: {expandedItems[item.id].announcement_content}</p>
                  {expandedItems[item.id].announcement_organizer && (
                    <p>주최: {expandedItems[item.id].announcement_organizer}</p>
                  )}
                  {expandedItems[item.id].announcement_contact && (
                    <p>연락처: {expandedItems[item.id].announcement_contact}</p>
                  )}
                  {expandedItems[item.id].announcement_support_detail && (
                    <p>지원 내용: {expandedItems[item.id].announcement_support_detail}</p>
                  )}
                  {(expandedItems[item.id].announcement_start_datetime || expandedItems[item.id].announcement_end_datetime) && (
                    <p>
                      기간:{" "}
                      {expandedItems[item.id].announcement_start_datetime?.slice(0, 10)} ~{" "}
                      {expandedItems[item.id].announcement_end_datetime?.slice(0, 10)}
                    </p>
                  )}
                  {expandedItems[item.id].announcement_site_url && (
                    <p>
                      <a
                        href={expandedItems[item.id].announcement_site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        자세히 보기
                      </a>
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
