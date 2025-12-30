import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{
          y: theme === 'dark' ? 0 : -30,
          opacity: theme === 'dark' ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute"
      >
        <Moon className="w-5 h-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          y: theme === 'light' ? 0 : 30,
          opacity: theme === 'light' ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute"
      >
        <Sun className="w-5 h-5" />
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
