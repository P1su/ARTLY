import { useEffect, useState } from 'react';
import styles from './TabLike.module.css';
import dummyImg from '../../../mock/dummyImg.png';
import SectionTitle from '../../SectionTitle/SectionTitle';
import { instance } from '../../../../../apis/instance';
import SectionCard from '../../Sections/SectionCard/SectionCard';
import SectionArtistCard from '../../Sections/SectionAtristCard/SectionArtistCard';

export default function TabLike() {
  const [liked, setLiked] = useState([]);
  const [followed, setFollowed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likeRes = await instance.get('/api/users/me/likes');
        setLiked(likeRes.data);
        // console.log(likeRes.data);
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
        <div className={styles.cardList}>
          {liked.map((item) => (
            <SectionCard key={item.id} item={item} type='like' />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title='팔로우 중인 작가' />
        <div className={styles.cardList}>
          {followed.map((item) => (
            <SectionArtistCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
