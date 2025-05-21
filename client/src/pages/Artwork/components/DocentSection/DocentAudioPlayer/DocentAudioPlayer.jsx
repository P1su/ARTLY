import styles from './DocentAudioPlayer.module.css';
import mockAudio from '../../../mock/mockAudio.mp3';

export default function DocentAudioPlayer() {
  return (
    <div className={styles.audioPlayerWrapper}>
      <audio controls>
        <source src={mockAudio} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
