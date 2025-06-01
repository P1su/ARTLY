import { useEffect, useState } from 'react';
import styles from './TabLike.module.css';
import { instance } from '../../../../../apis/instance';
import SectionCard from '../../Sections/SectionCard/SectionCard';

export default function TabLike() {
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likeRes = await instance.get('/api/users/me/likes');
        setLiked(likeRes.data);
        console.log(likeRes.data);
      } catch (err) {
        console.log('like fetch err : ', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <section>
        <div className={styles.cardList}>
          {liked.map((item) => (
            <SectionCard key={item.id} item={item} type='like' />
          ))}
        </div>
      </section>
    </div>
  );
}
