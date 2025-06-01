import { useEffect, useState, useMemo } from 'react';
import styles from './TabMyView.module.css';
import { instance } from '../../../../../apis/instance';
import SectionCard from '../../Sections/SectionCard/SectionCard';
import DropdownContainer from '../../../../../components/List/DropdownContainer/DropdownContainer';
import tabMyViewFilter from '../../../../../utils/filters/tabMyViewFilter';
import { useNavigate } from 'react-router-dom';

export default function TabMyView() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState({
    dateSort: 'latest',
    statusFilter: 'all',
  });

  const navigate = useNavigate();

  const filteredReservations = useMemo(() => {
    return reservations
      .filter((reservation) =>
        filter.statusFilter === 'all'
          ? true
          : reservation.exhibition_status === filter.statusFilter,
      )
      .sort((a, b) => {
        const dateA = new Date(a.reservation_datetime);
        const dateB = new Date(b.reservation_datetime);
        return filter.dateSort === 'latest' ? dateB - dateA : dateA - dateB;
      });
  }, [reservations, filter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await instance.get('/api/users/me/exhibitions');
        const { data } = res;

        const currentAndUpcoming = data.filter((item) =>
          ['scheduled', 'exhibited'].includes(item.exhibition_status),
        );

        setReservations(currentAndUpcoming);
      } catch (err) {
        console.error('데이터 가져오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === '취소') {
      const confirm = window.confirm('예약을 취소하시겠습니까?');
      if (!confirm) return;

      try {
        await instance.delete(`/api/reservations/${id}`);
        setReservations((prev) => prev.filter((res) => res.id !== id));
      } catch (err) {
        console.error('예약 취소 실패:', err);
      }
    }
  };

  const handleGoDetail = (id) => {
    navigate(`/exhibitions/${id}`);
  };

  const handleQR = () => {
    navigate('/scan');
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
                status={item.exhibition_status === '관람신청'}
                onGoDetail={() => handleGoDetail(item.id)}
                onCancel={() => handleStatusChange(item.id, '취소')}
                onQR={handleQR}
                type='reservation'
              />
            ))
          ) : (
            <p className={styles.emptyText}>예약한 전시가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
