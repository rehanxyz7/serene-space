import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SoundData {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency?: number;
}

const sounds: SoundData[] = [
  { id: 'rain', name: 'Rain', icon: '🌧️', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'ocean', name: 'Ocean Waves', icon: '🌊', color: 'from-cyan-500/20 to-teal-500/20' },
  { id: 'forest', name: 'Forest', icon: '🌲', color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'fire', name: 'Fireplace', icon: '🔥', color: 'from-orange-500/20 to-red-500/20' },
  { id: 'wind', name: 'Wind', icon: '💨', color: 'from-gray-400/20 to-slate-500/20' },
  { id: 'thunder', name: 'Thunder', icon: '⛈️', color: 'from-purple-500/20 to-indigo-500/20' },
  { id: 'birds', name: 'Birds', icon: '🐦', color: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'cafe', name: 'Café', icon: '☕', color: 'from-amber-600/20 to-orange-500/20' },
];

// Generate white noise using Web Audio API
const createNoiseNode = (audioContext: AudioContext, type: string): AudioBufferSourceNode => {
  const bufferSize = audioContext.sampleRate * 2;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    switch (type) {
      case 'rain':
        data[i] = (Math.random() * 2 - 1) * 0.5;
        if (Math.random() > 0.999) data[i] *= 3;
        break;
      case 'ocean':
        data[i] = Math.sin(i / 100) * 0.3 + (Math.random() * 2 - 1) * 0.2;
        break;
      case 'wind':
        data[i] = (Math.random() * 2 - 1) * 0.3 * Math.sin(i / 500);
        break;
      default:
        data[i] = (Math.random() * 2 - 1) * 0.4;
    }
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
};

const AmbientSounds = () => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Map<string, { source: AudioBufferSourceNode; gain: GainNode }>>(new Map());
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      sourcesRef.current.forEach(({ source }) => source.stop());
      audioContextRef.current?.close();
    };
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = masterVolume;
    }
  };

  const toggleSound = (soundId: string) => {
    initAudio();
    
    if (activeSounds.has(soundId)) {
      // Stop sound
      const nodeInfo = sourcesRef.current.get(soundId);
      if (nodeInfo) {
        nodeInfo.source.stop();
        sourcesRef.current.delete(soundId);
      }
      setActiveSounds((prev) => {
        const next = new Set(prev);
        next.delete(soundId);
        return next;
      });
    } else {
      // Start sound
      if (audioContextRef.current && masterGainRef.current) {
        const source = createNoiseNode(audioContextRef.current, soundId);
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = volumes[soundId] ?? 0.5;
        
        source.connect(gainNode);
        gainNode.connect(masterGainRef.current);
        source.start();
        
        sourcesRef.current.set(soundId, { source, gain: gainNode });
        setActiveSounds((prev) => new Set(prev).add(soundId));
        setVolumes((prev) => ({ ...prev, [soundId]: prev[soundId] ?? 0.5 }));
      }
    }
  };

  const updateVolume = (soundId: string, value: number) => {
    setVolumes((prev) => ({ ...prev, [soundId]: value }));
    const nodeInfo = sourcesRef.current.get(soundId);
    if (nodeInfo) {
      nodeInfo.gain.gain.value = value;
    }
  };

  const updateMasterVolume = (value: number) => {
    setMasterVolume(value);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = isMuted ? 0 : value;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = isMuted ? masterVolume : 0;
    }
  };

  return (
    <div className="space-y-8">
      {/* Master Volume */}
      <div className="glass-card p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
        <div className="flex-1">
          <Slider
            value={[masterVolume]}
            onValueChange={([v]) => updateMasterVolume(v)}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>
        <span className="text-sm text-muted-foreground w-12 text-right">
          {Math.round(masterVolume * 100)}%
        </span>
      </div>

      {/* Sound Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sounds.map((sound) => {
          const isActive = activeSounds.has(sound.id);
          return (
            <motion.div
              key={sound.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                  isActive ? 'border-primary/50 shadow-[0_0_20px_hsl(174_72%_56%/0.2)]' : ''
                }`}
                onClick={() => toggleSound(sound.id)}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${sound.color} flex items-center justify-center text-3xl`}>
                  {sound.icon}
                </div>
                <h3 className="text-center font-medium mb-3">{sound.name}</h3>
                
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </div>
                </div>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Slider
                      value={[volumes[sound.id] ?? 0.5]}
                      onValueChange={([v]) => updateVolume(sound.id, v)}
                      max={1}
                      step={0.01}
                      className="w-full"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeSounds.size > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground"
        >
          {activeSounds.size} sound{activeSounds.size > 1 ? 's' : ''} playing
        </motion.p>
      )}
    </div>
  );
};

export default AmbientSounds;
