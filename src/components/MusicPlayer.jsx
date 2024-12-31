import GitHubIcon from '@mui/icons-material/GitHub';
import LoopIcon from '@mui/icons-material/Loop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import React, { useEffect, useRef, useState } from 'react';
import '../styles/styles.css';

// Importa los archivos de audio locales.
import audio1 from '../assets/music/1.mp3';
import audio2 from '../assets/music/2.mp3';
import audio3 from '../assets/music/3.mp3';
import audio4 from '../assets/music/4.mp3';

// Lista de canciones
const musics = [
  {
    url: audio1,
    title: 'David Goggins is Unstoppable',
    tags: ['motivation'],
    imagen: 'https://i1.sndcdn.com/artworks-kbX4ANxvPxXtxTnn-MbY3PA-t500x500.jpg'
  },
  {
    url: audio3,
    title: 'David Goggins 3AM MOTIVATION',
    tags: ['motivation'],
    imagen: 'https://i1.sndcdn.com/artworks-kbX4ANxvPxXtxTnn-MbY3PA-t500x500.jpg'
  },
  {
    url: audio2,
    title: 'David Goggins Motivation',
    tags: ['motivation'],
    imagen: 'https://i1.sndcdn.com/artworks-kbX4ANxvPxXtxTnn-MbY3PA-t500x500.jpg'
  },
  {
    url: 'https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3',
    title: 'Madza - Chords of Life',
    tags: ['house'],
    imagen: 'https://i1.sndcdn.com/artworks-kbX4ANxvPxXtxTnn-MbY3PA-t500x500.jpg',
  },
  {
    url: audio4,
    title: 'Go Fock Yourself - David Goggins Motivational Edit (4k)',
    tags: ['motivation'],
    imagen: 'https://i1.sndcdn.com/artworks-kbX4ANxvPxXtxTnn-MbY3PA-t500x500.jpg'
  },
  {
    url: 'https://audioplayer.madza.dev/Madza-Late_Night_Drive.mp3',
    title: 'Madza - Late Night Drive',
    tags: ['dnb'],
    imagen: '',
  },
  {
    url: 'https://audioplayer.madza.dev/Madza-Persistence.mp3',
    title: 'Madza - Persistence',
    tags: ['dubstep'],
    imagen: '',
  },
];

export default function MusicPlayer() {
  // Estados
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Referencias
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Actualiza progreso de la canción
  useEffect(() => {
    const updateProgress = () => {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      if (!isDragging) {
        setProgress((current / total) * 100);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, [isDragging]);

  // Formatea tiempo en minutos y segundos
  const formatTime = (time) => {
    if (isNaN(time)) return <span>0:00</span>;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return <span>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</span>;
  };

  // Maneja la reproducción y pausa
  const playPauseHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Maneja la siguiente canción
  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % musics.length);
    setProgress(0);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Maneja la canción anterior
  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + musics.length) % musics.length);
    setProgress(0);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Maneja el clic en la barra de progreso
  const onProgressBarClick = (event) => {
    const bar = progressRef.current;
    const rect = bar.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const newProgress = (clickPosition / rect.width) * 100;
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * duration;
  };

  // Maneja el  arrastre en la barra de progreso
  const onMouseDown = () => setIsDragging(true);

  const onMouseMove = (event) => {
    if (isDragging) {
      const bar = progressRef.current;
      const rect = bar.getBoundingClientRect();
      const offsetX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
      const newProgress = (offsetX / rect.width) * 100;
      setProgress(newProgress);
      setCurrentTime((newProgress / 100) * duration);
    }
  };

  const onMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      audioRef.current.currentTime = (progress / 100) * duration;
    }
  };

  // Carga la  nueva canción
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex]);

  // Alterna el loop
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
  };

  // Selecciona la canción
  const selectSongHandler = (index) => {
    setCurrentSongIndex(index);
    setProgress(0);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const defaultImage = 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg';

  return (
    <div className="music-player">
      {/* Enlace a GitHub */}
      <div className="github-link">
        <a href="https://github.com/repo" target="_blank" rel="noopener noreferrer">
          <GitHubIcon className="GitHubIcon" style={{ fontSize: '40px' }} />
        </a>
      </div>

      {/* Portada de la canción */}
      <div className="portada">
        <img src={musics[currentSongIndex].imagen || defaultImage} alt="Portada" id="portada" />
      </div>

      {/* Información de la canción */}
      <div className="song-info">
        <h2>{musics[currentSongIndex].title}</h2>
      </div>

      {/* Elemento de audio */}
      <audio ref={audioRef} src={musics[currentSongIndex].url} onEnded={nextSongHandler}></audio>

      {/* Barra de progreso */}
      <div className="progress-bar-container" onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseDown={onMouseDown}>
        <span className="time-music">{formatTime(currentTime)}</span>
        <div className="progress-bar" ref={progressRef} onClick={onProgressBarClick}>
          <div className="progress" style={{ width: `${progress}%` }}>
            <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
          </div>
        </div>
        <span className="time" style={{ opacity: '0.7' }}>{formatTime(duration)}</span>
      </div>

      {/* Controles de reproducción */}
      <div className="controls">
        <div className="content-Button-LoopIcon">
          <button className="Button-LoopIcon" onClick={toggleLoop}>
            <LoopIcon className="LoopIcon" style={{ transition: 'opacity 0.2s', opacity: isLooping ? 0.3 : 1 }} />
          </button>
        </div>
        <div className="controls-buttons">
          <button onClick={prevSongHandler}>
            <SkipPreviousIcon />
          </button>
          <button id="playPauseBtn" onClick={playPauseHandler} style={{ width: '60px', height: '60px' }}>
            <span id="icon" style={{ fontSize: '34px', transition: 'transform 0.2s ease', transform: isPlaying ? 'rotate(180deg)' : 'none' }}>
              {isPlaying ? '❚❚' : '▶'}
            </span>
          </button>
          <button onClick={nextSongHandler}>
            <SkipNextIcon />
          </button>
        </div>
      </div>

      {/* Lista de canciones */}
      <div className="song-list">
        {musics.map((music, index) => (
          <div key={index} className={`song-item ${index === currentSongIndex ? 'active' : ''}`} onClick={() => selectSongHandler(index)}>
            <img src={music.imagen || defaultImage} alt="Portada" className="song-item-image" />
            <div className="song-item-info">
              <h3>{music.title}</h3>
              <p className="song-tags">{music.tags.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
