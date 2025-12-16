import { useRef, useState, useEffect } from 'react';
import styles from './DocentAudioPlayer.module.css';
import { FaPlay, FaStop, FaPause } from 'react-icons/fa';
import LoadingSpinner from '../../../../../components/LoadingSpinner/LoadingSpinner';
import { instance } from '../../../../../apis/instance';

export default function DocentAudioPlayer({ artwork, playbackRate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [changedPlaybackRate, setChangedPlaybackRate] = useState(playbackRate);
  const audioRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const hasAudio = Boolean(artwork?.docent_audio_path);
  const hasVideo = Boolean(artwork?.docent_video_path);
  const isAudioDocent = hasAudio && !hasVideo;
  const hasAnyDocent = hasAudio || hasVideo;

  // get audio content when artwork changes
  useEffect(() => {
    setIsAudioReady(false);

    const createAudio = async () => {
        const audio = new Audio(`${BASE_URL}/media/${artwork.docent_audio_path}`);
        audio.playbackRate = playbackRate;
        audio.onended = () => setIsPlaying(false);
        audio.playbackRate = changedPlaybackRate;
        audioRef.current = audio;
        setIsAudioReady(true);
    };

    if (isAudioDocent) createAudio();

    // cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [artwork]);

  // update playback rate immediately when it changes
  useEffect(() => {
    setChangedPlaybackRate(playbackRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // handle play/pause button click
  const handlePlayPauseClick = () => {
    if (!isAudioReady) return;
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // handle stop button click
  const handleStopClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles.audioPlayerWrapper}>
      {!hasAnyDocent ? (
        <div className={styles.placeholder} role="status">
          아직 도슨트가 생성되지 않았습니다.
        </div>
      ) : isAudioDocent ? (
        <>
          <button
            className={styles.audioButton}
            onClick={handlePlayPauseClick}
            disabled={!isAudioReady}
          >
            {!isAudioReady ? <LoadingSpinner /> : isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            className={styles.audioButton}
            onClick={handleStopClick}
            disabled={!isAudioReady}
            aria-label='정지'
          >
            {!isAudioReady ? '' : <FaStop />}
          </button>
        </>
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
