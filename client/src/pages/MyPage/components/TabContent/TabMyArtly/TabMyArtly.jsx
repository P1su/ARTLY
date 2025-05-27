import { useEffect, useState } from 'react';
import styles from './TabMyArtly.module.css';
import SectionCalendar from '../../Sections/SectionCalendar/SectionCalendar';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { instance } from '../../../../../apis/instance';
import SectionCard from '../../Sections/SectionCard/SectionCard';

export default function TabMyArtly() {
  const [reservations, setReservations] = useState([]);
  const [viewedExhibitions, setViewedExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const allReservationsRes = await instance.get(
          '/api/users/me/exhibitions',
        );
        const allReservations = allReservationsRes.data;

        const currentAndUpcoming = allReservations.filter(
          (item) =>
            item.exhibition_status === 'scheduled' ||
            item.exhibition_status === 'exhibited',
        );
        const pastExhibitions = allReservations.filter(
          (item) => item.exhibition_status === 'closed',
        );

        setReservations(currentAndUpcoming);
        setViewedExhibitions(pastExhibitions);
      } catch (err) {
        setError(err);
        console.error('데이터 가져오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>데이터 로드 실패: {error.message}</div>;
  }

  return (
    <div>
      <section>
        <SectionTitle title='예약한 전시' />
        <div className={styles.cardList}>
          {reservations.map((item) => (
            <SectionCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title='관람한 전시' />
        <div className={styles.cardList}>
          {viewedExhibitions.map((item) => (
            <SectionCard key={item.id} item={item} type='closed' />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title='전시 캘린더' />
        <SectionCalendar items={reservations} />
      </section>
    </div>
  );
}
