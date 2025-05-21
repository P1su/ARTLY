import styles from './DocentSection.module.css';

import DocentAudioPlayer from './DocentAudioPlayer/DocentAudioPlayer';
import BtnOption from './BtnOption/BtnOption';

export default function DocentSection() {
  return (
    <section className={styles.sectionContainer}>
      <DocentAudioPlayer />
      <div className={styles.controlsContainer}>
        <BtnOption
          label="음성 언어"
          options={[
            { id: 'ko', label: '한국어' },
            { id: 'en', label: '영어' },
          ]}
        />
        <BtnOption
          label="재생 속도"
          options={[
            { id: '1x', label: '1배속' },
            { id: '1.5x', label: '1.5배속' },
            { id: '2x', label: '2배속' },
          ]}
        />
      </div>
    </section>
  );
}
