import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingExerciseProps {
  inhaleTime?: number;
  holdTime?: number;
  exhaleTime?: number;
  restTime?: number;
}

const BreathingExercise = ({
  inhaleTime = 4,
  holdTime = 4,
  exhaleTime = 4,
  restTime = 2,
}: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(inhaleTime);
  const [cycles, setCycles] = useState(0);

  const phaseConfig = {
    inhale: { duration: inhaleTime, next: 'hold' as BreathPhase, label: 'Breathe In', scale: 1.3 },
    hold: { duration: holdTime, next: 'exhale' as BreathPhase, label: 'Hold', scale: 1.3 },
    exhale: { duration: exhaleTime, next: 'rest' as BreathPhase, label: 'Breathe Out', scale: 1 },
    rest: { duration: restTime, next: 'inhale' as BreathPhase, label: 'Rest', scale: 1 },
  };

  const reset = useCallback(() => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(inhaleTime);
    setCycles(0);
  }, [inhaleTime]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const currentConfig = phaseConfig[phase];
          const nextPhase = currentConfig.next;
          setPhase(nextPhase);
          
          if (nextPhase === 'inhale') {
            setCycles((c) => c + 1);
          }
          
          return phaseConfig[nextPhase].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const currentConfig = phaseConfig[phase];

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
        {/* Outer glow rings */}
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border border-primary/10"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Main breathing circle */}
        <motion.div
          className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/10 backdrop-blur-sm border border-primary/30"
          animate={{
            scale: isActive ? currentConfig.scale : 1,
            boxShadow: isActive 
              ? '0 0 60px hsl(174 72% 56% / 0.4), inset 0 0 40px hsl(174 72% 56% / 0.1)'
              : '0 0 30px hsl(174 72% 56% / 0.2)',
          }}
          transition={{ duration: currentConfig.duration, ease: 'easeInOut' }}
          style={{ width: '70%', height: '70%' }}
        >
          {/* Inner content */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl md:text-3xl font-display font-semibold text-foreground"
              >
                {currentConfig.label}
              </motion.p>
            </AnimatePresence>
            <motion.p
              className="text-5xl md:text-6xl font-display font-bold gradient-text mt-2"
              key={countdown}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {countdown}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="hero"
          size="lg"
          onClick={() => setIsActive(!isActive)}
          className="min-w-[140px]"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start
            </>
          )}
        </Button>
        <Button variant="glass" size="lg" onClick={reset}>
          <RotateCcw className="w-5 h-5" />
          Reset
        </Button>
      </div>

      {/* Cycle counter */}
      <p className="text-muted-foreground">
        Completed cycles: <span className="text-primary font-semibold">{cycles}</span>
      </p>
    </div>
  );
};

export default BreathingExercise;
