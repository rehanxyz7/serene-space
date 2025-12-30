import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionTimerProps {
  onSessionComplete: () => void;
}

const presetTimes = [
  { label: '15 min', value: 15 },
  { label: '25 min', value: 25 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

const SessionTimer = ({ onSessionComplete }: SessionTimerProps) => {
  const [selectedTime, setSelectedTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(selectedTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress = 1 - timeLeft / (selectedTime * 60);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    setTimeLeft(selectedTime * 60);
    setIsComplete(false);
  }, [selectedTime]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          onSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onSessionComplete]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const toggleTimer = () => {
    if (isComplete) {
      setTimeLeft(selectedTime * 60);
      setIsComplete(false);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime * 60);
    setIsComplete(false);
  };

  return (
    <div className="space-y-8">
      {/* Time Presets */}
      <div className="flex flex-wrap justify-center gap-3">
        {presetTimes.map((preset) => (
          <motion.button
            key={preset.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!isRunning) {
                setSelectedTime(preset.value);
              }
            }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedTime === preset.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {preset.label}
          </motion.button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 mx-auto">
        {/* Background circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-secondary/30"
          />
          {/* Progress circle */}
          <motion.circle
            cx="144"
            cy="144"
            r="120"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(174 72% 56%)" />
              <stop offset="100%" stopColor="hsl(280 60% 65%)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glow effect */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-8 rounded-full bg-primary/10 blur-2xl"
            />
          )}
        </AnimatePresence>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-display font-bold text-foreground"
          >
            {formatTime(timeLeft)}
          </motion.span>
          <span className="text-muted-foreground text-sm mt-2 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {isComplete ? 'Session Complete!' : isRunning ? 'Focus Time' : 'Ready'}
          </span>
        </div>

        {/* Completion animation */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl"
              >
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="hero"
            size="xl"
            onClick={toggleTimer}
            className="min-w-[140px]"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> {isComplete ? 'Restart' : 'Start'}
              </>
            )}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="glass" size="xl" onClick={resetTimer}>
            <RotateCcw className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SessionTimer;
