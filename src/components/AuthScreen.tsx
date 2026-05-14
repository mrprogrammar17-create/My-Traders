import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Play, ChevronRight, Mail, Lock, ShieldCheck, Globe, X, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthScreenProps {
  onEnterDemo: () => void;
}

export default function AuthScreen({ onEnterDemo }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);
    try {
      // Note: For this elite trading app, we're focusing on Google Auth for security.
      // Email/Pass would require more extensive verification flows.
      await login(); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsAuthenticating(true);
    try {
      await login();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <ShieldCheck className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-4 hover:scale-110 transition-transform">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl z-10">
        {/* Left Side: Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-emerald-600 to-emerald-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Globe className="w-full h-full scale-150" />
          </div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-emerald-600" />
                </div>
                <span className="text-2xl font-bold font-display tracking-tight">My Traders</span>
             </div>

             <h2 className="text-4xl font-bold font-display mb-6 leading-tight">
               Master the Markets with <span className="text-emerald-200">AI Intelligence.</span>
             </h2>
             <ul className="space-y-4 text-emerald-100">
               {[
                 '91% Accuracy on Elite Signals',
                 'Lightning-fast trade execution',
                 'Advanced Risk Management tools',
                 'Real-time Market Data & Analytics'
               ].map((text, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <ShieldCheck className="w-5 h-5 text-emerald-300" />
                   {text}
                 </li>
               ))}
             </ul>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10">
            <p className="text-emerald-100/60 text-sm italic">
              "The most intuitive trading platform I've ever used. The AI signals changed everything for my portfolio."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div>
                <p className="text-xs font-bold">Alex Rivera</p>
                <p className="text-[10px] text-emerald-200/60 uppercase font-bold tracking-widest">Senior Trader</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-bold font-display text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Elite'}
            </h3>
            <p className="text-zinc-500">Enter your credentials to access the console</p>
          </div>

          <form onSubmit={handleFirebaseLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-emerald-500 hover:text-emerald-400">
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />
              )}
              {isAuthenticating ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!isAuthenticating && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              )}
              {isAuthenticating ? 'Authenticating...' : 'Sign in with Google'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
            <button 
              onClick={onEnterDemo}
              disabled={isAuthenticating}
              className="w-full py-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold rounded-2xl border border-amber-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" />
              Try Demo Account Instantly
            </button>

            <p className="text-center text-sm text-zinc-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-emerald-500 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
