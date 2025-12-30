import { motion, AnimatePresence } from 'framer-motion';
import { Music, ExternalLink, Shuffle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mood } from './MoodSelector';

interface MoodPlaylist {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
}

const moodPlaylists: Record<string, MoodPlaylist[]> = {
  energetic: [
    {
      id: 'power',
      name: 'Power Workout',
      description: 'High-energy beats to fuel your session',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP',
    },
    {
      id: 'energy',
      name: 'Energy Boost',
      description: 'Uplifting tracks to keep you going',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0',
    },
  ],
  focused: [
    {
      id: 'deepfocus',
      name: 'Deep Focus',
      description: 'Concentration-boosting instrumentals',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
    },
    {
      id: 'brainpower',
      name: 'Brain Power',
      description: 'Music for intense concentration',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXLeA8Omikj7',
    },
  ],
  calm: [
    {
      id: 'peaceful',
      name: 'Peaceful Piano',
      description: 'Soft piano melodies for relaxation',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO',
    },
    {
      id: 'ambient',
      name: 'Ambient Relaxation',
      description: 'Atmospheric sounds for peace',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY',
    },
  ],
  creative: [
    {
      id: 'lofi',
      name: 'Lo-Fi Beats',
      description: 'Chill beats for creative flow',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn',
    },
    {
      id: 'indie',
      name: 'Indie Focus',
      description: 'Indie instrumentals for inspiration',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX35X4JNyBWtb',
    },
  ],
  happy: [
    {
      id: 'feelgood',
      name: 'Feel Good Hits',
      description: 'Songs that make you smile',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0',
    },
    {
      id: 'positive',
      name: 'Positive Vibes',
      description: 'Upbeat music for happiness',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWVlYsZJXqdym',
    },
  ],
  sleepy: [
    {
      id: 'sleep',
      name: 'Sleep Sounds',
      description: 'Gentle sounds for rest',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp',
    },
    {
      id: 'night',
      name: 'Night Rain',
      description: 'Rain and nature for sleep',
      embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS',
    },
  ],
};

interface MoodBasedPlayerProps {
  mood: Mood;
  onChangeMood: () => void;
}

const MoodBasedPlayer = ({ mood, onChangeMood }: MoodBasedPlayerProps) => {
  const playlists = moodPlaylists[mood.id] || moodPlaylists.focused;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Current Mood Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${mood.color} mb-4`}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="font-display font-bold text-lg text-foreground">
            {mood.label} Mood
          </span>
        </motion.div>
        <p className="text-muted-foreground">
          Here are playlists perfect for your current vibe
        </p>
      </div>

      {/* Playlists Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              <div className={`p-6 bg-gradient-to-br ${mood.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-display font-semibold mb-1">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-foreground/70">{playlist.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-background/20 hover:bg-background/30 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <div className="p-4">
                <iframe
                  src={`${playlist.embedUrl}?theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                  title={playlist.name}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="glass" onClick={onChangeMood} className="gap-2">
            <Shuffle className="w-4 h-4" />
            Change Mood
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="glass" asChild>
            <a
              href="https://open.spotify.com/search"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              More on Spotify
            </a>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodBasedPlayer;
