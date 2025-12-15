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

  // get audio content when artwork changes
  useEffect(() => {
    let isMounted = true;
    setIsAudioReady(false);

    const fetchAudio = async () => {
      const audioContent = await fetchAudioFromServer();

      if (audioContent && isMounted) {
        console.log('Audio content fetched successfully');
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audio.playbackRate = playbackRate;
        audio.onended = () => setIsPlaying(false);
        audio.playbackRate = changedPlaybackRate;
        audioRef.current = audio;
        setIsAudioReady(true);
      }
    };

    fetchAudio();

    // cleanup
    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
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

  const fetchAudioFromServer = async () => {
    try {
      const response = await instance.get(`/media/${artwork.docent_audio_path}`);
      const data = response.data?.data ?? response.data ?? response;
      return data;
    } catch (error) {
      console.error('Error fetching audio from server:', error);
      return null;
    } 
  };

  const fetchViedoFromServer = async () => {
    try {
      const response = await instance.get(`/media/${artwork.docent_video_path}`);
      const data = response.data?.data ?? response.data ?? response;
      return data;
    } catch (error) {
      console.error('Error fetching video from server:', error);
      return null;
    }
  };

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
    </div>
  );
}
