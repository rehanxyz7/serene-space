import { motion } from 'framer-motion';
import { Music, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaylistData {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  color: string;
}

const playlists: PlaylistData[] = [
  {
    id: 'focus',
    name: 'Deep Focus',
    description: 'Concentration-boosting instrumentals',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ',
    color: 'from-primary/20 to-cyan-600/20',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    description: 'Chill beats to study and relax',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'classical',
    name: 'Classical Focus',
    description: 'Timeless compositions for work',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'nature',
    name: 'Nature Sounds',
    description: 'Peaceful sounds from nature',
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4PP3DA4J0N8',
    color: 'from-green-500/20 to-emerald-500/20',
  },
];

const MusicPlayer = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-muted-foreground mb-4">
          <Music className="w-4 h-4" />
          Powered by Spotify
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Curated playlists to help you focus, relax, and boost productivity
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card overflow-hidden"
          >
            <div className={`p-6 bg-gradient-to-br ${playlist.color}`}>
              <h3 className="text-xl font-display font-semibold mb-1">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">{playlist.description}</p>
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
      </div>

      <div className="text-center">
        <Button variant="glass" asChild>
          <a 
            href="https://open.spotify.com/search/focus%20music" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
            Explore More on Spotify
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MusicPlayer;
