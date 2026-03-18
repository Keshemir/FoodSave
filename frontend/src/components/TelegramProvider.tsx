'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// We just use the globally injected Telegram script instead of the npm package
// to avoid "window is not defined" during Next.js SSR.

interface TelegramContextType {
  webApp: any | null;
  user: any | null;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
});

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const [webApp, setWebApp] = useState<any | null>(null);

  useEffect(() => {
    // WebApp should only be initialized on the client side
    const app = (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) || null;
    if (app) {
      app.ready();
      app.expand();
      setWebApp(app);
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
