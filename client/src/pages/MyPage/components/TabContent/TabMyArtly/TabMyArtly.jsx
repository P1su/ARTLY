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

      try {
        const reservationsRes = await instance.get('/api/users/me/exhibitions');
        setReservations(reservationsRes.data);
      } catch (err) {
        setError(err);
      }

      try {
        const viewedRes = await instance.get('/api/users/me/purchases');
        setViewedExhibitions(viewedRes.data);
      } catch (err) {
        setError(err);
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
            <SectionCard key={item.id} item={item} type='reservation' />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title='관람한 전시' />
        <div className={styles.cardList}>
          {viewedExhibitions.map((item) => (
            <SectionCard key={item.id} item={item} type='viewed' />
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
