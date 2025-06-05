import { useState } from 'react';
import styles from './DocentSection.module.css';

import DocentAudioPlayer from './DocentAudioPlayer/DocentAudioPlayer';
import BtnOption from './BtnOption/BtnOption';

export default function DocentSection({ script }) {
  const [playbackRate, setPlaybackRate] = useState(1);

  const handleSpeedChange = (id) => {
    setPlaybackRate(parseFloat(id.replace('x', '')));
  };

  return (
    <section className={styles.sectionContainer}>
      <DocentAudioPlayer script={script} playbackRate={playbackRate} />
      <div className={styles.controlsContainer}>
        <BtnOption
          label="음성 언어"
          options={[
            { id: 'ko', label: '한국어' },
            { id: 'en', label: '영어' },
          ]}
          onChange={() => alert('음성 언어 변경 기능은 현재 준비중입니다.')}
        />
        <BtnOption
          label="재생 속도"
          options={[
            { id: '1x', label: '1배속' },
            { id: '1.5x', label: '1.5배속' },
            { id: '2x', label: '2배속' },
          ]}
          onChange={handleSpeedChange}
          selectedId={`${playbackRate}x`}
        />
      </div>
    </section>
  );
}
