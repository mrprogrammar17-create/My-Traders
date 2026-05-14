import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: Date;
}

export default function TradingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: "Hello! I'm your My Traders Assistant. How can I help you with your trading today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview',
        contents: `You are a professional AI trading assistant for "My Traders". 
      The platform features:
      1. 1% Elite AI Signals: Proprietary signals with 91%+ historical accuracy.
      2. Automated Execution: Lightning-fast bot execution.
      3. Global Connectivity: Connection to top exchanges.
      4. Risk Management: Advanced tools to protect capital.
      
      Your goal is to help users with:
      - Understanding trading strategies (Long vs Short, Leverage, PnL).
      - Explaining market conditions.
      - Teaching them how to use the "My Traders" dashboard.
      - providing educational tips on risk management.
      
      Guidelines:
      - Tone: Professional, clear, and slightly technical but accessible.
      - DISCLAIMER: Always include a brief mention that trading involves high risk at the end of financial advice.
      - Be concise. Use bullet points for steps.
      - If they ask about "1% AI Signals", emphasize accuracy and speed.
      
      User message: ${input}`
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: text,
        time: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!",
        time: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] glass rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-emerald-500/20"
          >
            {/* Header */}
            <div className="p-4 bg-emerald-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">My Traders Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-[10px] text-emerald-100 uppercase font-bold tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-zinc-300 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                    <div className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-emerald-200' : 'text-zinc-500'}`}>
                      {m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-zinc-500 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Assistant is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about trading..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-zinc-800 rotate-90' : 'bg-emerald-600 hover:bg-emerald-500'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[10px] font-bold text-white">
            1
          </span>
        )}
      </button>
    </div>
  );
}
