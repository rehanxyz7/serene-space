import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GlobalBackgroundMusic = () => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const startMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/ambient-meditation.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // 50% volume
    }
    audioRef.current.play().catch(console.error);
  };

  const fadeOutAndStop = () => {
    if (!audioRef.current || audioRef.current.paused) return;

    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const fadeStep = 0.05;
    const fadeInterval = 50; // ms between steps

    fadeIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        if (audioRef.current.volume > fadeStep) {
          audioRef.current.volume -= fadeStep;
        } else {
          audioRef.current.volume = 0;
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        }
      }
    }, fadeInterval);
  };

  // Handle route changes
  useEffect(() => {
    const isHomePage = location.pathname === '/';

    if (isHomePage) {
      // Reset volume and play on home page
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
      }
      if (hasStartedRef.current) {
        startMusic();
      }
    } else {
      // Fade out on other pages
      fadeOutAndStop();
    }
  }, [location.pathname]);

  // Start on first user interaction (only on home page)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasStartedRef.current && location.pathname === '/') {
        hasStartedRef.current = true;
        startMusic();
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [location.pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default GlobalBackgroundMusic;
