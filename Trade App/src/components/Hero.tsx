import { motion } from 'motion/react';
import { ChevronRight, Play, LineChart } from 'lucide-react';

interface HeroProps {
  onStartTrial: () => void;
}

export default function Hero({ onStartTrial }: HeroProps) {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-green-500/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              v4.2 Trading Engine is Live
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display tracking-tight text-white mb-6"
          >
            Master the markets with <br />
            <span className="gradient-text">Precision AI Trading</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-10"
          >
            Trade Stocks, Crypto, and Forex with institucional-grade signals. Join 50k+ traders using My Traders' advanced AI to find alpha in every market condition.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={onStartTrial}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center group"
            >
              Start Free Trial
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="https://youtu.be/Do0VwUcZcxc?si=xZ5C2lGj_rrBTn7y" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all flex items-center justify-center"
            >
              <Play className="mr-2 w-4 h-4 fill-current" />
              Watch Demo
            </a>
          </motion.div>
        </div>

        {/* Trading Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative px-4"
        >
          <div className="max-w-5xl mx-auto glass rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10">
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Market Open: NYSE
                </div>
              </div>
            </div>
            <div className="aspect-video bg-zinc-900 overflow-hidden relative">
              {/* Simulated Chart Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" className="stroke-emerald-500/50 stroke-1 fill-none">
                   <path d="M0 200 Q 100 150, 200 180 T 400 100 T 600 150 T 800 50 T 1000 120" />
                </svg>
              </div>

              <div className="p-8 w-full h-full grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse flex items-center px-4 gap-3">
                      <div className="w-8 h-8 rounded bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2 w-1/2 bg-white/5 rounded" />
                        <div className="h-2 w-3/4 bg-white/5 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-span-9 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group relative overflow-hidden">
                   <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="z-10 flex flex-col items-center text-center">
                     <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 backdrop-blur-sm mb-4">
                        <Play className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                     </div>
                     <p className="text-sm font-medium text-emerald-400">See AI Analysis in Action</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
