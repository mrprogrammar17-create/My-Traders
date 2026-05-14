import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Explorer',
    description: 'Perfect for beginners learning the markets.',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      'Demo trading account',
      'Basic market charts',
      'Real-time price alerts',
      'Community chat access',
      'Daily market news',
    ],
    cta: 'Start Learning',
    popular: false,
  },
  {
    name: 'Pro Trader',
    description: 'Advanced tools for serious traders.',
    price: {
      monthly: 49,
      yearly: 39,
    },
    features: [
      'Institutional AI signals',
      '1 tick interval charts',
      'Priority slack support',
      'Level 2 Order Book',
      'Automated bot builder',
      'Multi-device sync',
    ],
    cta: 'Unlock Pro',
    popular: true,
  },
  {
    name: 'Whale',
    description: 'Custom setups for high-volume accounts.',
    price: {
      monthly: 499,
      yearly: 399,
    },
    features: [
      'Everything in Pro Trader',
      'Dedicated market analyst',
      'Institutional liquidity',
      'Unlimited bot instances',
      'Direct API execution',
      '0% platform fees',
    ],
    cta: 'Contact Wealth Desk',
    popular: false,
  },
];

interface PricingProps {
  onStartTrial: () => void;
}

export default function Pricing({ onStartTrial }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display text-white mb-4"
          >
            Transparent <span className="gradient-text">Pricing</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-zinc-400 mb-10"
          >
            Choose the plan that's right for your business. No hidden fees, ever.
          </motion.p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-2">
             <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
             <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-7 bg-white/10 rounded-full relative p-1 transition-colors hover:bg-white/20"
             >
                <div className={`w-5 h-5 bg-emerald-500 rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`} />
             </button>
             <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-500'}`}>Yearly <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`glass p-8 rounded-3xl relative flex flex-col ${plan.popular ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10 scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  RECOMMENDED
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}</span>
                  <span className="text-zinc-500">/mo</span>
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                   <p className="text-xs text-emerald-400 mt-1">Billed annually (${plan.price.yearly * 12}/yr)</p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={onStartTrial}
                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
