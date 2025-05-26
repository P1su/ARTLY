import React, { useEffect, useState } from 'react';
import styles from './TabMyArtly.module.css';
import axios from 'axios';
import SectionCalendar from '../../Sections/SectionCalendar/SectionCalendar';
import SectionTitle from '../../SectionTitle/SectionTitle';
import SectionCardList from '../../SectionCardList/SectionCardList';

export default function TabMyArtly() {
  const [reservations, setReservations] = useState([]);
  const [viewedExhibitions, setViewedExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const BASE_URL = import.meta.env.VITE_SERVER_URL;
      setLoading(true);

      try {
        const reservationsRes = await axios.get(
          `${BASE_URL}/api/users/me/exhibitions`,
        );
        setReservations(reservationsRes.data);
      } catch (err) {
        setError(err);
      }

      try {
        const viewedRes = await axios.get(`${BASE_URL}/api/users/me/purchases`);
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
        <SectionCardList items={reservations} type='reservation' />
      </section>
      <section>
        <SectionTitle title='관람한 전시' />
        <SectionCardList items={viewedExhibitions} type='viewed' />
      </section>
      <section>
        <SectionTitle title='전시 캘린더' />
        <SectionCalendar items={reservations} />
      </section>
    </div>
  );
}
