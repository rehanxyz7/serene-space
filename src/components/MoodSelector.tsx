import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  playlists: string[];
}

const moods: Mood[] = [
  {
    id: 'energetic',
    emoji: '⚡',
    label: 'Energetic',
    color: 'from-yellow-400 to-orange-500',
    playlists: ['Power Workout', 'Energy Boost', 'Morning Motivation'],
  },
  {
    id: 'focused',
    emoji: '🎯',
    label: 'Focused',
    color: 'from-blue-400 to-cyan-500',
    playlists: ['Deep Focus', 'Concentration', 'Study Session'],
  },
  {
    id: 'calm',
    emoji: '🧘',
    label: 'Calm',
    color: 'from-teal-400 to-green-500',
    playlists: ['Peaceful Piano', 'Ambient Chill', 'Nature Sounds'],
  },
  {
    id: 'creative',
    emoji: '🎨',
    label: 'Creative',
    color: 'from-purple-400 to-pink-500',
    playlists: ['Lo-Fi Beats', 'Creative Flow', 'Indie Focus'],
  },
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    color: 'from-pink-400 to-rose-500',
    playlists: ['Feel Good', 'Happy Hits', 'Positive Vibes'],
  },
  {
    id: 'sleepy',
    emoji: '😴',
    label: 'Sleepy',
    color: 'from-indigo-400 to-purple-600',
    playlists: ['Sleep Sounds', 'Night Rain', 'Dreamscape'],
  },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void;
  selectedMood: Mood | null;
}

const MoodSelector = ({ onMoodSelect, selectedMood }: MoodSelectorProps) => {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          How are you feeling?
        </h2>
        <p className="text-muted-foreground">
          Select your mood to get personalized music recommendations
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHoveredMood(mood.id)}
            onHoverEnd={() => setHoveredMood(null)}
            onClick={() => onMoodSelect(mood)}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
              selectedMood?.id === mood.id
                ? 'border-primary bg-primary/10'
                : 'border-border/50 bg-card/30 hover:border-primary/50'
            }`}
          >
            {/* Glow effect on hover/select */}
            <AnimatePresence>
              {(hoveredMood === mood.id || selectedMood?.id === mood.id) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.color} opacity-20 blur-xl -z-10`}
                />
              )}
            </AnimatePresence>

            <motion.span
              className="text-5xl md:text-6xl block mb-3"
              animate={{
                scale: hoveredMood === mood.id ? 1.2 : 1,
                rotate: hoveredMood === mood.id ? [0, -10, 10, 0] : 0,
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {mood.emoji}
            </motion.span>
            <span className="font-medium text-foreground">{mood.label}</span>

            {selectedMood?.id === mood.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <span className="text-primary-foreground text-sm">✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export { MoodSelector, moods };
export type { Mood };
