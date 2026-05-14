import { motion } from 'motion/react';
import { Zap, Shield, Globe, BarChart3, Cpu, Layers } from 'lucide-react';

const features = [
  {
    title: 'Precision Signals',
    description: 'Institutional-grade AI signals generated in real-time with over 84% historical accuracy across markets.',
    icon: Zap,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    title: 'Ultra-Low Latency',
    description: 'Execute trades in milliseconds. Our fiber-optic cross-connects ensure you never miss a tick.',
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    title: 'Global Markets',
    description: 'Trade everything from New York to Tokyo. Stocks, Crypto, Forex, and Commodities on one platform.',
    icon: Globe,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    title: 'Advanced Charts',
    description: 'Pro-level charting with 100+ technical indicators, drawing tools, and real-time order flows.',
    icon: BarChart3,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    title: 'AI Trading Bots',
    description: 'Automate your strategy with our drag-and-drop bot builder. No coding required for professional results.',
    icon: Cpu,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    title: 'Smart Portfolio',
    description: 'AI-powered risk management and portfolio rebalancing suggested based on your risk profile.',
    icon: Layers,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display text-white mb-4"
          >
            Engineered for <span className="gradient-text">Profitable Edge</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-zinc-400"
          >
            Everything you need to analyze, execute, and scale your trading strategy with lightning speed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-2xl hover:border-white/20 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
