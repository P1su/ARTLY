import styles from './DocentAudioPlayer.module.css';

export default function DocentAudioPlayer() {
  return (
    <div className={styles.audioPlayerWrapper}>
      <audio controls>
        <source src="/audio/sample.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
