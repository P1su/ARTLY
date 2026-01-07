import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiTrash } from 'react-icons/hi';
import LookUp from '../../components/LookUp/LookUp';
import CountList from '../../components/CountList/CountList';
import RegisterButton from '../../components/RegisterButton/RegisterButton';
import EmptyState from '../../components/EmptyState/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import useDebounceSearch from '../../hooks/useDebounceSearch';
import styles from './AnnouncementManagement.module.css';
import Img from '../../../../components/Img/Img.jsx';
import { useConfirm } from '../../../../store/ConfirmProvider.jsx';
import badgeStyles from '../../../../pages/Category/News/News/components/NewsCard/NewsCard.module.css';

export default function AnnouncementManagement({
  announcementList,
  onDelete,
  loadAnnouncements,
  isLoading,
  isSearching,
  error,
}) {
  const { showConfirm } = useConfirm();
  const navigate = useNavigate();

  const { searchValue, handleSearchChange } = useDebounceSearch({
    onSearch: loadAnnouncements,
    onEmptySearch: () => loadAnnouncements(''),
    minLength: 2,
    delay: 500,
  });

  const filteredList = Array.isArray(announcementList) ? announcementList : [];

  const handleDelete = async (id) => {
    const isConfirmed = await showConfirm(
      '정말로 이 공고를 삭제하시겠습니까?',
      true,
    );

    if (isConfirmed) {
      await onDelete(id, 'announcement');
      navigate('/console/main', {
        state: { activeTab: '공고관리' },
        replace: true,
      });
    }
  };

  const formatDate = (dateString) =>
    dateString?.split(' ')[0].replace(/-/g, '.');

  const formatStatus = (status) => {
    switch (status) {
      case 'ongoing': return '진행중';
      case 'scheduled': return '예정';
      case 'ended': return '종료';
      default: return '';
    }
  };

  return (
    <div className={styles.contentContainer}>
      <div className={styles.searchContainer}>
        <LookUp
          value={searchValue}
          onChange={handleSearchChange}
          placeholder='공고 검색'
          isInput
        />
      </div>

      <div className={styles.countAndButtonContainer}>
        <CountList count={filteredList.length} />
        <RegisterButton
          buttonText='+공고 등록'
          onButtonClick={() => navigate(`/console/announcements/edit/new`)}
        />
      </div>

      {isLoading ? (
        <div className={styles.contentContainer}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className={styles.contentContainer}>
          <div className={styles.errorMessage}>
            오류가 발생했습니다: {error}
          </div>
        </div>
      ) : filteredList.length > 0 ? (
        <section className={styles.contentContainer}>
          {filteredList.map((item) => (
            <div
            key={item.id}
            className={styles.card}
            onClick={() => navigate(`/console/announcements/${item.id}`)}
          >
            <div className={styles.cardContent}>
              <div className={styles.badgeContainer}>
                <span className={badgeStyles.badge}>{item.category}</span>
                <span className={`${badgeStyles.badge} ${badgeStyles[formatStatus(item.status)]}`}>
                  {formatStatus(item.status)}
                </span>
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardPeriod}>
                {`${formatDate(item.startDate)} ~ ${formatDate(item.endDate)}`}
              </p>
              <p className={styles.cardOrganizer}>{item.organizer}</p>
            </div>
            
            {item.image && (
              <div className={styles.cardImageWrapper}>
                <Img
                  src={item.image}
                  alt={item.title}
                  className={styles.cardImage}
                />
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className={styles.deleteButton}
            >
              <HiTrash size={18} />
            </button>
            </div>
          ))}
        </section>
      ) : (
        <section className={styles.emptyStateContainer}>
          <EmptyState
            message='등록된 공고가 없어요.'
            buttonText='+공고 등록'
          />
        </section>
      )}
    </div>
  );
}