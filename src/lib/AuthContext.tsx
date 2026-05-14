import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  balance: number;
  liveBalance: number;
  demoBalance: number;
  accountType: 'live' | 'demo';
  setAccountType: (type: 'live' | 'demo') => void;
  setBalance: (balance: number) => void;
  updateBalances: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoBalance, setDemoBalance] = useState(10000);
  const [liveBalance, setLiveBalance] = useState(0);
  const [accountType, setAccountType] = useState<'live' | 'demo'>('live');

  const updateBalances = async () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      setDemoBalance(data.demoBalance ?? 10000);
      setLiveBalance(data.liveBalance ?? 0);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const initialData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            demoBalance: 50000, // New demo users get 50k
            liveBalance: 0,
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, initialData);
          setDemoBalance(50000);
          setLiveBalance(0);
          setAccountType('demo'); // Default to demo for new users to practice
        } else {
          const data = userDoc.data();
          setDemoBalance(data.demoBalance ?? 50000);
          setLiveBalance(data.liveBalance ?? 0);
          setAccountType('live'); // Existing users go to live by default
        }
      } else {
        setUser(null);
        setAccountType('demo'); // Anonymous users are in demo mode
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const balance = accountType === 'live' ? liveBalance : demoBalance;

  const setBalance = async (newBalance: number) => {
    if (!user) {
      setDemoBalance(newBalance);
      return;
    }
    const userDocRef = doc(db, 'users', user.uid);
    if (accountType === 'live') {
      await updateDoc(userDocRef, { liveBalance: newBalance });
      setLiveBalance(newBalance);
    } else {
      await updateDoc(userDocRef, { demoBalance: newBalance });
      setDemoBalance(newBalance);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      balance, 
      liveBalance, 
      demoBalance, 
      accountType, 
      setAccountType, 
      setBalance,
      updateBalances
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
