import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  onStartTrial: () => void;
}

export default function Navbar({ onStartTrial }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 glass' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="#" className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
            My Traders
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-emerald-500" />
                  )}
                  <span className="text-xs font-medium text-white max-w-[100px] truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <button 
                  onClick={onStartTrial}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={login}
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Log in
                </button>
                <button 
                  onClick={login}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 group"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full glass border-t border-white/5 py-4 px-4 flex flex-col gap-4 shadow-2xl"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-zinc-400 hover:text-white transition-colors py-2"
            >
              {link.name}
            </a>
          ))}
          <hr className="border-white/5" />
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center">
                    <User className="text-emerald-500" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{user.displayName || 'User'}</p>
                  <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                </div>
                <button onClick={logout} className="p-2 text-zinc-500 hover:text-red-400">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={onStartTrial}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={login}
                className="text-left text-lg font-medium text-zinc-400 hover:text-white py-2"
              >
                Log in
              </button>
              <button 
                onClick={login}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl"
              >
                Get Started
              </button>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}
