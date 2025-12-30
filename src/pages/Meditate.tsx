import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BreathingExercise from '@/components/BreathingExercise';

const Meditate = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(174_72%_56%/0.08),transparent_60%)]" />
      </div>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Breathing <span className="gradient-text">Meditation</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Follow the circle. Breathe deeply. Find your center.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BreathingExercise />
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 glass-card p-8"
          >
            <h2 className="text-xl font-display font-semibold mb-4">Breathing Tips</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0 mt-0.5">1</span>
                Find a comfortable position and relax your shoulders
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0 mt-0.5">2</span>
                Breathe through your nose when inhaling
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0 mt-0.5">3</span>
                Let your exhale be slow and natural
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm shrink-0 mt-0.5">4</span>
                If your mind wanders, gently bring focus back to your breath
              </li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Meditate;
