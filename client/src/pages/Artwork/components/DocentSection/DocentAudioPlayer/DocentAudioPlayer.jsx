import { useRef, useState, useEffect } from 'react';
import styles from './DocentAudioPlayer.module.css';

export default function DocentAudioPlayer({ script, playbackRate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [changedPlaybackRate, setChangedPlaybackRate] = useState(playbackRate);
  const audioRef = useRef(null);
  
  // get audio content when script changes
  useEffect(() => {
    let isMounted = true;
    setIsAudioReady(false);

    const fetchAudio = async () => {
      console.log('Fetching audio for script:', script.substr(0, 50) + '...');
      const audioContent = await callTTS();

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
  }, [script]);

  // update playback rate immediately when it changes
  useEffect(() => {
    setChangedPlaybackRate(playbackRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // call Google TTS API to get audio content
  const callTTS = async () => {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${import.meta.env.VITE_GCloud_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: script },
          voice: { languageCode: 'ko-KR', name: 'ko-KR-Chirp3-HD-Kore' }, //Aoede, Kore, Leda, Orus, Puck...
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    );

    const data = await response.json();
    const audioContent = data.audioContent;
    
    if (audioContent) return audioContent;
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
        {!isAudioReady ? '로딩 중...' : isPlaying ? '⏸' : '▶'}
      </button>
      <button
        className={styles.audioButton}
        onClick={handleStopClick}
        disabled={!isAudioReady}
        style={{ marginLeft: 8, minWidth: 40 }}
        aria-label="정지"
      >
        {!isAudioReady ? '' : '■'}
      </button>
    </div>
  );
}
