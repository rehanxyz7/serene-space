import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AmbientSounds from '@/components/AmbientSounds';

const Sounds = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(174_72%_56%/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(120_50%_40%/0.05),transparent_50%)]" />
      </div>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Ambient <span className="gradient-text">Sounds</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Mix and match sounds to create your perfect focus environment
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AmbientSounds />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Sounds;
