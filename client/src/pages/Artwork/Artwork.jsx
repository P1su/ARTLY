import styles from './Artwork.module.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { instance } from '../../apis/instance.js';
import DocentSection from './components/DocentSection/DocentSection';
import Img from '../../components/Img/Img.jsx';
import { useAlert } from '../../store/AlertProvider.jsx';

const paginateScript = (script, maxLength = 300) => {
  return Array.from({ length: Math.ceil(script?.length / maxLength) }, (_, i) =>
    script.slice(i * maxLength, (i + 1) * maxLength),
  );
};

export default function Artwork() {
  const [artwork, setArtwork] = useState({});
  const {
    art_image: image,
    art_title: title,
    art_description: info,
    art_docent: script,
    artist_name: artist,
  } = artwork;
  const { artId } = useParams();
  const { showAlert } = useAlert();
  const scriptPages = paginateScript(script);

  useEffect(() => {
    const getArtwork = async () => {
      //추후 userInstance 수정 논의
      try {
        const response = await instance.get(`/api/arts/${artId}`);
        setArtwork(response.data);
      } catch (error) {
        console.error(error);
        showAlert('데이터를 받아오는 중 오류가 발생했습니다.');
      }
    };
    getArtwork();
  }, []);

  return (
    <main className={styles.layout}>
      <h2 className={styles.title}>{title}</h2>

      <section className={styles.mainContent}>
        <Img src={image} alt={`${title} 이미지`} className={styles.infoImage} />
        <div className={styles.textContainer}>
          <div className={styles.textBox}>
            <strong>작가</strong>
            <span className={styles.text}>{artist}</span>
          </div>
        </div>
        <DocentSection script={script} />
      </section>
    </main>
  );
}
