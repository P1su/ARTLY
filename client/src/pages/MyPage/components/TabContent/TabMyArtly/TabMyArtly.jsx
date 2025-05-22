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
      try {
        setLoading(true);
        const BASE_URL = import.meta.env.VITE_SERVER_URL;
        const headers = {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDc4NzYxMDMsImV4cCI6MTc0Nzg3OTcwMywidXNlcl9pZCI6IjEiLCJsb2dpbl9pZCI6InRlc3QxIn0.rXk6EI2KsV1pcH6xtbakUsSdRgU-4yjQomP33xzKI0Q`,
        };

        const reservationsRes = await axios.get(
          // `${BASE_URL}/api/users/me/exhibitions`,
          '/api/users/me/exhibitions',

          { headers },
        );
        setReservations(reservationsRes.data);
        console.log(reservationsRes.data);

        const viewedRes = await axios.get(
          //`${BASE_URL}/api/users/me/purchases`
          '/api/users/me/purchases',
        );
        setViewedExhibitions(viewedRes.data);
      } catch (err) {
        setError(err);
        console.error('마이페이지 데이터 가져오기 에러 :', err);
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
