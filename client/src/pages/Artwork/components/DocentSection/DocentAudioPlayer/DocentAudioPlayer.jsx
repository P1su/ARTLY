import { useRef, useEffect, useState } from 'react';
import styles from './DocentAudioPlayer.module.css';

export default function DocentAudioPlayer({ artwork, playbackRate }) {
  const audioRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const hasAudio = Boolean(artwork?.docent_audio_path);
  const hasVideo = Boolean(artwork?.docent_video_path);
  const isAudioDocent = hasAudio && !hasVideo;
  const hasAnyDocent = hasAudio || hasVideo;

  // artwork 변경 시 초기화
  useEffect(() => {
    setIsAudioReady(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [artwork]);

  // 재생 속도 즉시 반영
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div className={styles.audioPlayerWrapper}>
      {!hasAnyDocent ? (
        <div className={styles.placeholder}>
          아직 도슨트가 생성되지 않았습니다.
        </div>
      ) : isAudioDocent ? (
        <audio
          ref={audioRef}
          className={styles.audioPlayer}
          controls
          preload='metadata'
          src={`${BASE_URL}/media/${artwork.docent_audio_path}`}
          onCanPlayThrough={() => setIsAudioReady(true)}
        />
      ) : (
        <video
          className={styles.videoPlayer}
          controls
          src={`${BASE_URL}/media/${artwork.docent_video_path}`}
        />
      )}
    </div>
  );
}
