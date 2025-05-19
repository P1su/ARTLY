import styles from './DocentAudioPlayer.module.css';

const DocentAudioPlayer = () => {
  return (
    <div className={styles.audioPlayer}>
      <audio controls>
        <source src="/audio/sample.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default DocentAudioPlayer;