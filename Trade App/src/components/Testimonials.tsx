import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO at TechFlow',
    content: 'Aura has completely transformed how we handle our data pipelines. The AI-driven insights are a game changer for our engineering team.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Founder of Nexus',
    content: 'The scale we were able to achieve in just three months with Aura is unprecedented. The documentation and support are top-notch.',
    avatar: 'MR',
    rating: 5,
  },
  {
    name: 'Elena Kostic',
    role: 'Product Manager at Glovo',
    content: 'Intuitive, powerful, and beautiful. Aura is everything we wanted in an analytics platform and more. Highly recommended!',
    avatar: 'EK',
    rating: 5,
  },
  {
    name: 'David Obasi',
    role: 'Lead Architect at CloudScale',
    content: 'Security was our main concern, but Aura passed all our audits with flying colors. The encryption implementation is brilliant.',
    avatar: 'DO',
    rating: 5,
  },
  {
    name: 'Linda Yang',
    role: 'Director at Innovate',
    content: 'Aura simplified our complex workflows into a few clicks. Our productivity has increased by 40% since we switched.',
    avatar: 'LY',
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-display text-white mb-4"
          >
            Loved by <span className="gradient-text">thousands</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-zinc-400"
          >
            Don't just take our word for it. Hear what industry leaders have to say about Aura.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl w-full md:w-[350px] flex flex-col hover:border-white/20 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`} 
                  />
                ))}
              </div>
              <p className="text-zinc-300 mb-6 italic flex-1">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{testimonial.name}</h4>
                  <p className="text-xs text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
