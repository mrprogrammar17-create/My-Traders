import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface FinalCTAProps {
  onStartTrial: () => void;
}

export default function FinalCTA({ onStartTrial }: FinalCTAProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-96 bg-linear-to-t from-indigo-600/20 to-transparent pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="glass p-12 md:p-20 rounded-[2.5rem] text-center relative overflow-hidden group"
        >
          {/* Decorative elements */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-700" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
              Start trading like <span className="gradient-text">the 1%</span> today.
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl mb-10 leading-relaxed">
              Don't leave your financial future to chance. Join 50,000+ traders using My Traders' institutional intelligence to gain an edge.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStartTrial}
              className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 group"
            >
              Get Your Free Account
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all">
              Talk to a Specialist
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
