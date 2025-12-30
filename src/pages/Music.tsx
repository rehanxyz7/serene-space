import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';

const MusicPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(280_60%_65%/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(174_72%_56%/0.05),transparent_50%)]" />
      </div>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Focus <span className="gradient-text-accent">Music</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Carefully selected playlists to help you concentrate and flow
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MusicPage;
