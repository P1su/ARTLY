import React, { useEffect, useState, useMemo } from 'react';
import styles from './TabMyView.module.css';
import { userInstance } from '../../../../../../apis/instance';
import SectionCard from '../../SectionCard/SectionCard';
import DropdownContainer from '../../../../../Category/components/DropdownContainer/DropdownContainer';
import tabMyViewFilter from '../../../../../../utils/filters/tabMyViewFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import AttendanceModal from '../../AttendanceModal/AttendanceModal';

export default function TabMyView() {
  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState({
    dateSort: 'latest',
    statusFilter: 'reserved',
  });

  const navigate = useNavigate();

  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedExhibition, setSelectedExhibition] = useState({
    id: '',
    title: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (location.state?.successModal && location.state?.exhibitionInfo) {
      setSelectedExhibition(location.state.exhibitionInfo);
      setShowAttendanceModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await userInstance.get('/api/users/me/exhibitions');
        const { data } = res;

        setReservations(data);
      } catch (err) {
        console.error('데이터 가져오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  const filteredReservations = useMemo(() => {
    let result = reservations;
    if (filter.statusFilter !== 'all') {
      result = result.filter(
        (reservation) => reservation.reservation_status === filter.statusFilter,
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.reservation_datetime);
      const dateB = new Date(b.reservation_datetime);
      return filter.dateSort === 'latest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [reservations, filter]);

  console.log(filteredReservations);

  const handleCloseModal = () => {
    setShowAttendanceModal(false);
  };

  const handleStatusChange = async (id) => {
    const confirm = window.confirm('예약을 취소하시겠습니까?');
    if (!confirm) return;

    try {
      await userInstance.delete(`/api/reservations/${id}`);
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, reservation_status: 'canceled' } : res,
        ),
      );
    } catch (err) {
      console.error('예약 취소 실패:', err);
    }
  };

  const handleQR = (item) => {
    const exhibitionInfo = {
      id: item.exhibition_id,
      title: item.exhibition_title,
      imageUrl: item.exhibition_poster,
    };

    navigate(`/scan?itemId=${item.id}`, {
      state: { exhibitionInfo },
    });
  };

  return (
    <div>
      <div className={styles.header}>
        <p className={styles.countText}>
          예약한 전시회{' '}
          <span className={styles.count}>{filteredReservations.length}</span>
        </p>
        <div className={styles.filterSection}>
          <DropdownContainer
            filterList={tabMyViewFilter}
            onSetFilter={setFilter}
            shape='rect'
          />
        </div>
      </div>

      <section>
        <div className={styles.cardList}>
          {filteredReservations.length > 0 ? (
            filteredReservations.map((item) => (
              <SectionCard
                key={item.id}
                item={item}
                status={item.reservation_status === 'reserved'}
                onReservation={() => {
                  navigate(`/reservationconfirm/${item.id}`);
                }}
                onGoDetail={() =>
                  navigate(`/exhibitions/${item.exhibition_id}`)
                }
                onCancel={() => handleStatusChange(item.id)}
                onQR={() => handleQR(item)}
                type='reservation'
              />
            ))
          ) : (
            <p className={styles.emptyText}>예약한 전시가 없습니다.</p>
          )}
        </div>
      </section>

      {showAttendanceModal && (
        <AttendanceModal
          isOpen={showAttendanceModal}
          onClose={handleCloseModal}
          exhibitionTitle={selectedExhibition.title}
          imageUrl={selectedExhibition.imageUrl}
          visitDate={new Date().toLocaleDateString()}
          onViewExhibition={() => navigate('/exhibitions')}
        />
      )}
    </div>
  );
}
