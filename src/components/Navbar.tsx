import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Music, Headphones, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { path: '/', label: 'Home', icon: Wind },
  { path: '/meditate', label: 'Meditate', icon: Headphones },
  { path: '/sounds', label: 'Sounds', icon: Wind },
  { path: '/music', label: 'Music', icon: Music },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wind className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl hidden sm:block group-hover:text-primary transition-colors">
              Serenity
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'glow' : 'ghost'}
                    size="sm"
                    className="relative"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/30 -z-10"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle & Auth */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="hero" size="sm">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 glass-card p-4 space-y-2"
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive ? 'glow' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="hero" className="w-full mt-2">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
