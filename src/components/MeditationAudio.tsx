import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface MeditationAudioProps {
  isPlaying: boolean;
  defaultVolume?: number;
}

const MeditationAudio = ({ isPlaying, defaultVolume = 0.4 }: MeditationAudioProps) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(defaultVolume);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<(OscillatorNode)[]>([]);

  const startChantingSound = () => {
    if (audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const masterGain = audioContext.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(audioContext.destination);
      gainNodeRef.current = masterGain;

      // OM frequency (cosmic frequency 136.1 Hz)
      const omFreq = 136.1;
      
      // Layer 1: Base OM tone
      const baseOsc = audioContext.createOscillator();
      baseOsc.type = 'sine';
      baseOsc.frequency.value = omFreq;
      
      const baseGain = audioContext.createGain();
      baseGain.gain.value = 0.25;
      
      baseOsc.connect(baseGain);
      baseGain.connect(masterGain);
      baseOsc.start();
      nodesRef.current.push(baseOsc);

      // Layer 2: Octave harmonics
      [2, 3].forEach((mult) => {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = omFreq * mult;
        
        const gain = audioContext.createGain();
        gain.gain.value = 0.12 / mult;
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        nodesRef.current.push(osc);
      });

      // Layer 3: Detuned voices for choir effect
      [-6, 6].forEach((detune) => {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = omFreq;
        osc.detune.value = detune;
        
        const gain = audioContext.createGain();
        gain.gain.value = 0.08;
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        nodesRef.current.push(osc);
      });

      // Layer 4: Sub-bass for warmth
      const subOsc = audioContext.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.value = omFreq / 2;
      
      const subGain = audioContext.createGain();
      subGain.gain.value = 0.15;
      
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start();
      nodesRef.current.push(subOsc);

      // Layer 5: Fifth harmony
      const fifthOsc = audioContext.createOscillator();
      fifthOsc.type = 'sine';
      fifthOsc.frequency.value = omFreq * 1.5;
      
      const fifthGain = audioContext.createGain();
      fifthGain.gain.value = 0.1;
      
      fifthOsc.connect(fifthGain);
      fifthGain.connect(masterGain);
      fifthOsc.start();
      nodesRef.current.push(fifthOsc);

      setIsAudioPlaying(true);
      console.log('OM chanting started');
    } catch (error) {
      console.error('Error starting chanting sound:', error);
    }
  };

  const stopChantingSound = () => {
    nodesRef.current.forEach(node => {
      try {
        node.stop();
      } catch (e) {}
    });
    nodesRef.current = [];

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    gainNodeRef.current = null;
    setIsAudioPlaying(false);
    console.log('OM chanting stopped');
  };

  // Handle play/stop based on meditation state and audio enabled
  useEffect(() => {
    const shouldPlay = isPlaying && audioEnabled;
    
    if (shouldPlay && !audioContextRef.current) {
      startChantingSound();
    } else if (!shouldPlay && audioContextRef.current) {
      stopChantingSound();
    }
  }, [isPlaying, audioEnabled]);

  // Handle volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopChantingSound();
    };
  }, []);

  const isActive = audioEnabled && isPlaying;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col sm:flex-row items-center gap-4 p-4 glass-card rounded-xl"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={isActive && isAudioPlaying ? { rotate: [0, 360] } : {}}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        >
          <Sparkles className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-muted-foreground'}`} />
        </motion.div>
        <span className="text-sm font-medium whitespace-nowrap">OM Chanting</span>
      </div>
      
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant={audioEnabled ? 'glow' : 'outline'}
          size="sm"
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="min-w-[80px]"
        >
          {audioEnabled ? (
            <>
              <Volume2 className="w-4 h-4" /> On
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" /> Off
            </>
          )}
        </Button>
      </motion.div>
      
      <div className="flex items-center gap-3">
        <Slider
          value={[volume * 100]}
          onValueChange={([val]) => setVolume(val / 100)}
          max={100}
          step={1}
          className="w-28"
        />
        <span className="text-xs text-muted-foreground w-10 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
      
      {isActive && isAudioPlaying && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-accent"
        >
          ♪ Playing
        </motion.span>
      )}
    </motion.div>
  );
};

export default MeditationAudio;
