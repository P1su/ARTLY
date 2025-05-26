import React, { useEffect, useState } from 'react';
import styles from './TabLike.module.css';
import dummyImg from '../../../mock/dummyImg.png';
import SectionTitle from '../../SectionTitle/SectionTitle';
import SectionCardList from '../../SectionCardList/SectionCardList';
import SectionArtistCardList from '../../SectionArtistCardList/SectionArtistCardList';
import { instance } from '../../../../../apis/instance';

export default function TabLike() {
  const [liked, setLiked] = useState([]);
  const [followed, setFollowed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likeRes = await instance.get('/api/users/me/likes');
        setLiked(likeRes.data);
      } catch (err) {
        console.log('like fetch err : ', err);
      }

      try {
        const followRes = await instance.get('/api/users/me/likes');
        setFollowed(followRes.data);
      } catch (err) {
        console.log('follow fetch err : ', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section>
        <SectionTitle title='북마크 전시' />
        <SectionCardList items={liked} type='like' />
      </section>
      <section>
        <SectionTitle title='팔로우 중인 작가' />
        <SectionArtistCardList items={followed} />
      </section>
    </div>
  );
}
