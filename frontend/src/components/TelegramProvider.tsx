'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramContextType {
  webApp: typeof WebApp | null;
  user: any | null;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
});

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const [webApp, setWebApp] = useState<typeof WebApp | null>(null);

  useEffect(() => {
    // WebApp should only be initialized on the client side
    if (typeof window !== 'undefined' && WebApp) {
      WebApp.ready();
      WebApp.expand();
      setWebApp(WebApp);
    }
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        user: webApp?.initDataUnsafe?.user || null,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
