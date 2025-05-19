import styles from './DocentSection.module.css';

import DocentAudioPlayer from './DocentAudioPlayer/DocentAudioPlayer';
import BtnOption from './BtnOption/BtnOption';

const DocentSection = () => {
  return (
    <div className={styles.section}>
      <DocentAudioPlayer />
      <div className={styles.controls}>
        <BtnOption label="음성 언어" options={['한국어', '영어']} />
        <BtnOption label="재생 속도" options={['1x', '1.5x', '2x']} />
      </div>
    </div>
  );
};

export default DocentSection;
