import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { configureRevenueCat, isProUser, purchaseSubscription } from '@/revenuecat';

interface SubscriptionContextValue {
  isPro: boolean;
  refresh: () => Promise<void>;
  purchase: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  isPro: false,
  refresh: async () => {},
  purchase: async () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);

  const refresh = async () => {
    const pro = await isProUser();
    setIsPro(pro);
  };

  useEffect(() => {
    configureRevenueCat();
    refresh();
  }, []);

  const purchase = async () => {
    await purchaseSubscription();
    refresh();
  };

  return (
    <SubscriptionContext.Provider value={{ isPro, refresh, purchase }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
