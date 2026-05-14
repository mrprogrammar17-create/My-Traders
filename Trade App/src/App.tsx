/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import DemoTrading from './components/DemoTrading';
import TradingChatbot from './components/TradingChatbot';
import AuthScreen from './components/AuthScreen';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [view, setView] = useState<'landing' | 'demo'>('landing');
  const [showAuth, setShowAuth] = useState(true);
  const { user, loading, login } = useAuth();

  const handleStartTrial = async () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setView('demo');
    }
  };

  const handleEnterDemo = () => {
    setShowAuth(false);
    setView('demo');
  };

  // If user is authenticated, we can hide the initial auth screen
  useEffect(() => {
    if (user) {
      setShowAuth(false);
      // Auto-jump to demo if they were on auth screen
      if (showAuth) {
        setView('demo');
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Initializing Secure Console...</p>
        </div>
      </div>
    );
  }

  if (showAuth && !user) {
    return <AuthScreen onEnterDemo={handleEnterDemo} />;
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'demo' ? (
          <DemoTrading onBack={() => setView('landing')} />
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Navbar onStartTrial={handleStartTrial} />
            <main>
              <Hero onStartTrial={handleStartTrial} />
              <Features />
              <HowItWorks />
              <Pricing onStartTrial={handleStartTrial} />
              <Testimonials />
              <FAQ />
              <FinalCTA onStartTrial={handleStartTrial} />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
      <TradingChatbot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

