'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Loading from '@/app/loading';

type SessionContextType = {
  user: User | null;
  isSubscribed: boolean; // Placeholder for subscription status
  loading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Placeholder for subscription logic. In a real app, you'd fetch this from your database.
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // For demo purposes, we'll consider any logged-in user as subscribed.
      // In a real app, you would check your database for an active subscription.
      // e.g., checkSubscriptionStatus(user?.uid).then(setIsSubscribed);
      if (user) {
        setIsSubscribed(true); // SIMULATING A SUBSCRIBED USER
      } else {
        setIsSubscribed(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <SessionContext.Provider value={{ user, isSubscribed, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
