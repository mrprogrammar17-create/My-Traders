import { motion, AnimatePresence } from 'motion/react';
import { LineChart, BarChart2, DollarSign, TrendingUp, Info, ArrowLeft, Send, Activity, Clock, Loader2, PieChart as PieChartIcon, TrendingDown, LogOut, Globe } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot, orderBy, writeBatch, limit } from 'firebase/firestore';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DemoTradingProps {
  onBack: () => void;
}

export default function DemoTrading({ onBack }: DemoTradingProps) {
  const { user, balance, setBalance, accountType, setAccountType, liveBalance, demoBalance, logout } = useAuth();
  const [positions, setPositions] = useState<any[]>([]);
  const [closedTrades, setClosedTrades] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(54230.50);
  const [showTip, setShowTip] = useState(true);
  const [step, setStep] = useState(0);
  const [tradeAmount, setTradeAmount] = useState(1000);
  const [timeframe, setTimeframe] = useState<'LIVE' | '1H'>('LIVE');
  const [isInvesting, setIsInvesting] = useState(false);
  const [showDepositAmount, setShowDepositAmount] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [activeTab, setActiveTab] = useState<'trading' | 'analysis'>('trading');

  const [globalTrades, setGlobalTrades] = useState<any[]>([]);

  const aiSignals = [
    { pair: 'BTC/USD', type: 'LONG', confidence: 94, target: 58400, status: 'Active', entry: 54100 },
    { pair: 'ETH/USD', type: 'SHORT', confidence: 88, target: 2950, status: 'Monitoring', entry: 3120 },
    { pair: 'SOL/USD', type: 'LONG', confidence: 91, target: 165.50, status: 'Pending', entry: 142.10 },
  ];

  // Global Trade Feed Simulation
  useEffect(() => {
    const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'LINK/USDT', 'ADA/USDT'];
    const types = ['LONG', 'SHORT'];
    const users = ['TradeWiz', 'CryptoKing', 'MoonHunter', 'AlphaOne', 'GhostTrader', 'QuantPro'];

    const generateTrade = () => ({
      id: Math.random().toString(36).substr(2, 9),
      user: users[Math.floor(Math.random() * users.length)],
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      type: types[Math.floor(Math.random() * types.length)],
      amount: Math.floor(Math.random() * 5000) + 100,
      timestamp: new Date(),
    });

    setGlobalTrades(Array.from({ length: 5 }, generateTrade));

    const interval = setInterval(() => {
      setGlobalTrades(prev => [generateTrade(), ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Fetch open positions
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'trades'),
      where('status', '==', 'open'),
      where('accountType', '==', accountType),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPositions(posData);
    });

    return unsubscribe;
  }, [user, accountType]);

  // Fetch closed trades for analysis
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'trades'),
      where('status', '==', 'closed'),
      where('accountType', '==', accountType),
      orderBy('closedAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClosedTrades(tradesData);
    });

    return unsubscribe;
  }, [user, accountType]);

  // Calculate Unrealized PnL
  const unrealizedPnL = positions.reduce((total, pos) => {
    const diff = pos.type === 'long' 
      ? currentPrice - pos.entryPrice 
      : pos.entryPrice - currentPrice;
    const pnl = (diff / pos.entryPrice) * pos.amount * pos.leverage;
    return total + pnl;
  }, 0);

  const equity = balance + unrealizedPnL;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() * 20 - 10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (type: 'long' | 'short') => {
    if (!user || tradeAmount > balance || tradeAmount <= 0) return;

    try {
      const batch = writeBatch(db);
      
      const tradeRef = doc(collection(db, 'users', user.uid, 'trades'));
      batch.set(tradeRef, {
        userId: user.uid,
        type,
        entryPrice: currentPrice,
        amount: tradeAmount,
        leverage: 10,
        status: 'open',
        accountType,
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, 'users', user.uid);
      const newBalance = balance - tradeAmount;
      if (accountType === 'live') {
        batch.update(userRef, { liveBalance: newBalance });
      } else {
        batch.update(userRef, { demoBalance: newBalance });
      }
      
      await batch.commit();
      setBalance(newBalance);
      // Auto switch back to trading tab if needed
      setActiveTab('trading');
    } catch (error) {
      console.error('Trade failed:', error);
    }
  };

  // Analytics Calculations
  const stats = useMemo(() => {
    if (closedTrades.length === 0) return null;

    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
    const lossTrades = closedTrades.filter(t => (t.pnl || 0) <= 0);
    const winRate = (winTrades.length / closedTrades.length) * 100;
    
    // Sort for chart - actual chronological order
    const chartData = [...closedTrades]
      .reverse()
      .map((t, index) => ({
        name: `Trade ${index + 1}`,
        pnl: t.pnl,
        equity: 10000 + closedTrades.slice(0, closedTrades.length - 1 - index).reduce((sum, prev) => sum + (prev.pnl || 0), 0)
      }));

    return { totalPnL, winRate, winCount: winTrades.length, lossCount: lossTrades.length, chartData };
  }, [closedTrades]);

  const closePosition = async (id: string) => {
    if (!user) return;
    const pos = positions.find(p => p.id === id);
    if (!pos) return;

    const diff = pos.type === 'long' 
      ? currentPrice - pos.entryPrice 
      : pos.entryPrice - currentPrice;
    const pnl = (diff / pos.entryPrice) * pos.amount * pos.leverage;
    
    try {
      const batch = writeBatch(db);
      
      const tradeRef = doc(db, 'users', user.uid, 'trades', id);
      batch.update(tradeRef, {
        status: 'closed',
        exitPrice: currentPrice,
        pnl: pnl,
        closedAt: serverTimestamp(),
      });

      const userRef = doc(db, 'users', user.uid);
      const returnAmount = pos.amount + pnl;
      const newBalance = balance + returnAmount;
      if (accountType === 'live') {
        batch.update(userRef, { liveBalance: newBalance });
      } else {
        batch.update(userRef, { demoBalance: newBalance });
      }

      await batch.commit();
      setBalance(newBalance);
    } catch (error) {
      console.error('Close position failed:', error);
    }
  };

  const simulateDeposit = async (amount: number) => {
    if (!user || amount <= 0) return;
    setIsInvesting(true);
    // Simulate payment process
    setTimeout(async () => {
      const newBalance = liveBalance + amount;
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { liveBalance: newBalance });
      setBalance(newBalance);
      setIsInvesting(false);
      setShowDepositAmount(false);
    }, 1500);
  };

  const tips = [
    {
      title: "Welcome to My Traders!",
      content: "This is your demo environment. We've credited you with $50,000 in virtual funds to learn with zero risk. Your goal is to grow this balance using AI signals.",
    },
    {
      title: "Live vs Demo",
      content: "Switch between 'Demo Account' for practice and 'Live Account' for real trading. Live accounts start at $0 and require an investment to begin.",
    },
    {
      title: "Understanding the Chart",
      content: "The emerald line shows Bitcoin's price. When it goes up, value increases. Use technical analysis or our 1% AI signals to predict the next move.",
    },
    {
      title: "Buy vs Sell",
      content: "Click 'Buy / Long' if you think the price will rise. Click 'Sell / Short' if you think it will fall. Profit is made on the difference!",
    },
  ];

  const handleNextTip = () => {
    if (step < tips.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setShowTip(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Landing
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center">
               <LineChart className="w-6 h-6 text-emerald-500" />
             </div>
             <div>
               <h1 className="text-2xl font-bold font-display">
                 My Traders <span className="text-emerald-500">Pro</span>
               </h1>
               <p className="text-zinc-500 text-sm">Real-time Trading Interface</p>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setActiveTab('trading')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'trading' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <LineChart className="w-4 h-4" />
                  Market
                </button>
                <button 
                  onClick={() => setActiveTab('analysis')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  <BarChart2 className="w-4 h-4" />
                  Analysis
                </button>
             </div>

             <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setAccountType('demo')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${accountType === 'demo' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  Demo Mode
                </button>
                <button 
                  onClick={() => setAccountType('live')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${accountType === 'live' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  Live Mode
                </button>
             </div>
             
             {user && (
               <button 
                 onClick={() => {
                   logout();
                   onBack();
                 }}
                 className="p-3 bg-white/5 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-2xl border border-white/5 transition-all group"
                 title="Logout"
               >
                 <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </button>
             )}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
                {accountType === 'live' ? 'Live Balance' : 'Virtual Balance'}
              </p>
              <p className="text-2xl font-bold font-mono">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            {accountType === 'live' && (
              <div className="relative">
                <AnimatePresence>
                  {showDepositAmount && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 p-4 glass rounded-2xl border border-emerald-500/30 w-[280px] z-50 shadow-2xl"
                    >
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3">Deposit Amount (Live)</p>
                      <div className="space-y-4">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input 
                            type="number"
                            autoFocus
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[100, 500, 1000, 5000].map(amt => (
                            <button
                              key={amt}
                              onClick={() => setDepositAmount(amt)}
                              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${depositAmount === amt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-500 border border-white/5 hover:text-white'}`}
                            >
                              ${amt}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-white/5">
                          <button 
                            onClick={() => setShowDepositAmount(false)}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-white/5 transition-all"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => simulateDeposit(depositAmount)}
                            disabled={isInvesting || depositAmount <= 0}
                            className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isInvesting && <Loader2 className="w-3 h-3 animate-spin" />}
                            Confirm
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={() => setShowDepositAmount(!showDepositAmount)}
                  disabled={isInvesting}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${showDepositAmount ? 'bg-zinc-800 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}
                >
                  {isInvesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                  Invest
                </button>
              </div>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Total Equity</p>
              <p className="text-2xl font-bold font-mono text-emerald-400">${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {activeTab === 'trading' ? (
            <>
              {/* Main Chart Area */}
              <div className="lg:col-span-8 glass rounded-3xl p-6 h-[500px] relative overflow-hidden flex flex-col">
             <div className="flex items-center justify-between mb-8 z-10">
               <div className="flex items-center gap-2">
                 <button 
                  onClick={() => setTimeframe('1H')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${timeframe === '1H' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                 >
                   1H
                 </button>
                 <button 
                  onClick={() => setTimeframe('LIVE')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${timeframe === 'LIVE' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
                 >
                   LIVE
                 </button>
               </div>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                   <Activity className="w-3 h-3 text-emerald-500" />
                   Volatility: High
                 </div>
                 <div className="text-2xl font-bold font-mono text-emerald-400">
                   ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </div>
               </div>
             </div>

             <div className="flex-1 relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <svg className="w-full h-full stroke-emerald-500 stroke-2 fill-none">
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ 
                        pathLength: 1,
                        y: positions.length > 0 ? [0, -10, 5, -5, 0] : 0 
                      }}
                      transition={{ 
                        pathLength: { duration: 2 },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      d="M 0,200 L 50,180 L 100,210 L 150,150 L 200,190 L 250,120 L 300,160 L 350,100 L 400,140 L 450,80 L 500,120 L 550,110 L 600,150 L 650,130 L 700,90 L 750,110 L 800,70"
                    />
                  </svg>
                  {positions.map((pos, idx) => (
                    <motion.div
                      key={pos.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      className={`absolute left-0 right-0 h-px ${pos.type === 'long' ? 'bg-emerald-500' : 'bg-red-500'} border-dashed`}
                      style={{ top: `${200 + (idx * 20)}px` }}
                    />
                  ))}
                </div>

                {timeframe === '1H' && (
                  <div className="absolute inset-0 h-full flex items-end gap-1 px-4 z-10 bg-zinc-950/80 backdrop-blur-xs">
                    {[40, 60, 45, 80, 55, 70, 90, 75, 65, 85, 100, 95].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="flex-1 bg-linear-to-t from-emerald-500/20 to-emerald-500 rounded-t-sm"
                      />
                    ))}
                  </div>
                )}

                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-0 opacity-5 pointer-events-none">
                  {[...Array(6)].map((_, i) => <div key={i} className="h-px bg-white" />)}
                </div>
             </div>
             
             <div className="mt-4 flex items-center justify-between z-10">
               <div className="flex items-center gap-6 text-[10px] text-zinc-500 font-bold uppercase overflow-x-auto no-scrollbar">
                 <div className="flex flex-col">
                   <span>24H High</span>
                   <span className="text-white font-mono">$56,120.00</span>
                 </div>
                 <div className="flex flex-col">
                   <span>24H Low</span>
                   <span className="text-white font-mono">$52,450.00</span>
                 </div>
                 <div className="flex flex-col">
                   <span>24H Vol</span>
                   <span className="text-white font-mono">1.2B USDT</span>
                 </div>
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                 <Clock className="w-4 h-4" />
                 Last Sync: Just now
               </div>
             </div>
          </div>

          {/* Trade Execution */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="glass rounded-3xl p-6">
               <h3 className="text-lg font-bold mb-6">Execute Trade</h3>
               <div className="space-y-6">
                 <div>
                   <div className="flex items-center justify-between mb-2">
                     <label className="text-xs text-zinc-500 uppercase font-bold">Amount (USDT)</label>
                     <span className="text-[10px] text-zinc-500 font-bold">Limit: ${balance.toLocaleString()}</span>
                   </div>
                   <div className="relative mb-4">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                     <input 
                       type="number" 
                       value={tradeAmount}
                       onChange={(e) => setTradeAmount(Number(e.target.value))}
                       className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white font-mono text-lg focus:outline-hidden focus:border-emerald-500 transition-colors"
                       max={balance}
                       min={0}
                     />
                   </div>

                   {/* Quick Select Percentages */}
                   <div className="grid grid-cols-4 gap-2 mb-4">
                     {[25, 50, 75, 100].map((pct) => (
                       <button
                         key={pct}
                         onClick={() => setTradeAmount(Math.floor(balance * (pct / 100)))}
                         className="py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white transition-all"
                       >
                         {pct}%
                       </button>
                     ))}
                   </div>

                   {/* Predefined Amounts */}
                   <div className="grid grid-cols-4 gap-2">
                     {[100, 500, 1000, 5000].map((amt) => (
                       <button
                         key={amt}
                         onClick={() => setTradeAmount(amt)}
                         className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${tradeAmount === amt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-500 border border-white/5 hover:text-white'}`}
                       >
                         ${amt}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-2">
                   <button 
                    onClick={() => handleTrade('long')}
                    className="bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
                   >
                     Buy / Long
                   </button>
                   <button 
                    onClick={() => handleTrade('short')}
                    className="bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
                   >
                     Sell / Short
                   </button>
                 </div>
                 <p className="text-xs text-zinc-500 text-center mt-4">
                   Leverage: 10x (Configurable in Pro)
                 </p>
               </div>
             </div>

             <div className="glass rounded-3xl p-6 flex-1">
               <h3 className="text-lg font-bold mb-4">Active Positions ({positions.length})</h3>
               <div className="space-y-3 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                 {positions.length === 0 ? (
                   <p className="text-sm text-zinc-600 text-center py-8">No open positions</p>
                 ) : (
                   positions.map((pos) => {
                     const diff = pos.type === 'long' 
                       ? currentPrice - pos.entryPrice 
                       : pos.entryPrice - currentPrice;
                     const pnl = (diff / pos.entryPrice) * pos.amount * pos.leverage;
                     const pnlPercent = (diff / pos.entryPrice) * pos.leverage * 100;

                     return (
                       <div key={pos.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group">
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${pos.type === 'long' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                               {pos.type} 10x
                             </span>
                             <span className="text-xs text-zinc-400 font-mono">${pos.entryPrice.toFixed(2)}</span>
                           </div>
                           <p className={`text-sm font-mono font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                             {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                           </p>
                         </div>
                         <button 
                           onClick={() => closePosition(pos.id)}
                           className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-xs font-bold transition-all"
                         >
                           Close
                         </button>
                       </div>
                     );
                   })
                 )}
               </div>
             </div>
          </div>
            </>
          ) : (
            <div className="lg:col-span-12 space-y-6">
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total PnL', value: `$${stats?.totalPnL.toFixed(2) || '0.00'}`, icon: DollarSign, color: (stats?.totalPnL || 0) >= 0 ? 'text-emerald-500' : 'text-red-500' },
                  { label: 'Win Rate', value: `${stats?.winRate.toFixed(1) || '0'}%`, icon: TrendingUp, color: 'text-blue-500' },
                  { label: 'Total Trades', value: closedTrades.length, icon: Activity, color: 'text-purple-500' },
                  { label: 'Avg Trade PnL', value: `$${(stats?.totalPnL / (closedTrades.length || 1)).toFixed(2)}`, icon: BarChart2, color: 'text-amber-500' },
                ].map((stat, i) => (
                  <div key={i} className="glass rounded-3xl p-6">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                    <div className="flex items-center justify-between">
                      <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                      <stat.icon className={`w-5 h-5 ${stat.color} opacity-40`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                  <div className="glass rounded-3xl p-8 min-h-[400px]">
                    <h3 className="text-lg font-bold mb-8 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        Performance History
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live Tracking</span>
                      </div>
                    </h3>
                    <div className="h-[300px] w-full">
                      {stats?.chartData && stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.chartData}>
                            <defs>
                              <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              stroke="#52525b" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                            />
                            <YAxis 
                              stroke="#52525b" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                              tickFormatter={(value) => `$${value}`}
                            />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                              itemStyle={{ color: '#10b981' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="pnl" 
                              stroke="#10b981" 
                              fillOpacity={1} 
                              fill="url(#colorPnL)" 
                              strokeWidth={3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                          <BarChart2 className="w-12 h-12 mb-4 opacity-20" />
                          <p>No historical data to visualize yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* New: Live AI Signal Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass rounded-3xl p-8">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-3">
                          <Activity className="w-5 h-5 text-emerald-500" />
                          Live AI Signals
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Scanning Markets</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {aiSignals.map((signal, idx) => (
                          <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-0.5">{signal.pair}</p>
                                <div className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${signal.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {signal.type} @ ${signal.entry.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">{signal.confidence}%</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Accuracy Index</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] uppercase font-bold">
                                <span className="text-zinc-500">Target</span>
                                <span className="text-emerald-400">${signal.target.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${signal.confidence}%` }}
                                  className={`h-full ${signal.type === 'LONG' ? 'bg-emerald-500' : 'bg-red-500'}`}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] uppercase font-bold">
                                <span className="text-zinc-500">Status</span>
                                <span className={`flex items-center gap-1 ${signal.status === 'Active' ? 'text-blue-400' : 'text-zinc-400'}`}>
                                  <span className={`w-1 h-1 rounded-full ${signal.status === 'Active' ? 'bg-blue-400 animate-pulse' : 'bg-zinc-400'}`} />
                                  {signal.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass rounded-3xl p-8">
                       <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-3 text-zinc-400">
                          <Globe className="w-5 h-5 text-zinc-500" />
                          Global Live Feed
                        </h3>
                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-500 uppercase">
                          Real-time
                        </div>
                      </div>

                      <div className="space-y-3 relative">
                        <AnimatePresence mode="popLayout">
                          {globalTrades.map((trade) => (
                            <motion.div
                              key={trade.id}
                              initial={{ opacity: 0, x: -20, height: 0 }}
                              animate={{ opacity: 1, x: 0, height: 'auto' }}
                              exit={{ opacity: 0, x: 20, height: 0 }}
                              transition={{ duration: 0.4 }}
                              className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${trade.type === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {trade.type[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{trade.user}</p>
                                  <p className="text-[10px] text-zinc-500 font-mono">{trade.pair} • ${trade.amount.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-xs font-bold ${trade.type === 'LONG' ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {trade.type}
                                </p>
                                <p className="text-[10px] text-zinc-600">Just now</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="glass rounded-3xl p-8">
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                      <PieChartIcon className="w-5 h-5 text-emerald-500" />
                      Trade Distribution
                    </h3>
                    <div className="h-[250px]">
                      {stats && closedTrades.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Wins', value: stats.winCount },
                                { name: 'Losses', value: stats.lossCount },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                            </Pie>
                            <RechartsTooltip 
                               contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600">
                          <PieChartIcon className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className="text-sm">Profit Trades</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">{stats?.winCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="text-sm">Loss Trades</span>
                        </div>
                        <span className="font-mono font-bold text-red-400">{stats?.lossCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Market Sentiment Card */}
                  <div className="glass rounded-3xl p-8 bg-linear-to-br from-emerald-600/10 to-transparent">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Market Sentiment</h3>
                    <div className="flex flex-col items-center py-4">
                       <div className="text-5xl font-bold font-display text-emerald-500 mb-2">BULLISH</div>
                       <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">AI Aggregate Score: 8.4/10</p>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '84%' }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span>BEARISH</span>
                        <span>BULLISH</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Trade History Table */}
              <div className="glass rounded-3xl p-8 overflow-hidden">
                <h3 className="text-lg font-bold mb-6">Recent Trade Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest border-b border-white/5">
                        <th className="pb-4">Type</th>
                        <th className="pb-4">Entry</th>
                        <th className="pb-4">Exit</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4">PnL</th>
                        <th className="pb-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {closedTrades.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-zinc-600">No trades recorded in this account yet</td>
                        </tr>
                      ) : (
                        closedTrades.map((trade) => (
                          <tr key={trade.id} className="group hover:bg-white/5 transition-colors">
                            <td className="py-4">
                              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${trade.type === 'long' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {trade.type}
                              </span>
                            </td>
                            <td className="py-4 font-mono text-sm">${trade.entryPrice.toFixed(2)}</td>
                            <td className="py-4 font-mono text-sm">${trade.exitPrice?.toFixed(2) || '-'}</td>
                            <td className="py-4 font-mono text-sm">${trade.amount.toFixed(2)}</td>
                            <td className={`py-4 font-mono font-bold text-sm ${(trade.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {(trade.pnl || 0) >= 0 ? '+' : ''}${trade.pnl?.toFixed(2)}
                            </td>
                            <td className="py-4 text-right text-zinc-500 text-xs">
                              {trade.closedAt?.toDate().toLocaleDateString() || 'Just now'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Tooltip */}
      <AnimatePresence>
        {showTip && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-10 right-10 z-50 w-[400px] overflow-hidden"
          >
            <div className="glass rounded-3xl p-8 border-emerald-500/30 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Info className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">{tips[step].title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {tips[step].content}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-1.5">
                  {tips.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === step ? 'bg-emerald-500' : 'bg-white/10'}`} />
                  ))}
                </div>
                <button 
                  onClick={handleNextTip}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                >
                  {step === tips.length - 1 ? 'Get Started' : 'Next Tip'}
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
