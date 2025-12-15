import { useState } from 'react';
import styles from './DocentSection.module.css';

import DocentAudioPlayer from './DocentAudioPlayer/DocentAudioPlayer';
import BtnOption from './BtnOption/BtnOption';
import useModal from '../../../../hooks/useModal';
import { useAlert } from '../../../../store/AlertProvider';

export default function DocentSection({ artwork }) {
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const { isOpen, handleOpenModal } = useModal();

  const speedOptions = [0.5, 1.0, 1.25, 1.5, 2.0];
  const { showAlert } = useAlert();
  return (
    <section className={styles.sectionContainer}>
      <DocentAudioPlayer artwork={artwork} playbackRate={playbackRate} />
      <div className={styles.controlsContainer}>
        {isOpen && (
          <div className={styles.speedContainer}>
            {speedOptions.map((speed) => (
              <button
                key={speed}
                className={`${styles.speedButton} ${speed === playbackRate && styles.clickedSpeedButton}`}
                onClick={() => {
                  setPlaybackRate(speed);
                  handleOpenModal();
                }}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
        <div className={styles.buttonField}>
          <span className={styles.optionSpan}>재생속도</span>
          <button className={styles.optionButton} onClick={handleOpenModal}>
            {playbackRate}x
          </button>
        </div>
        <div className={styles.buttonField}>
          <span className={styles.optionSpan}>언어 선택</span>
          <button
            className={styles.optionButton}
            onClick={() => {
              showAlert('음성 언어 변경 기능은 현재 준비중입니다.');
            }}
          >
            한국어
          </button>
        </div>
        
      </div>
    </section>
  );
}
