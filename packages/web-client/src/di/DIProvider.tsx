'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface DIProviderProps {
  children: ReactNode;
}

export function createDIProvider<TContainer>(factory: () => TContainer) {
  const Context = createContext<TContainer | null>(null);

  function DIProvider({ children }: DIProviderProps) {
    const container = useMemo(factory, []);
    return <Context.Provider value={container}>{children}</Context.Provider>;
  }

  function useDI(): TContainer {
    const container = useContext(Context);
    if (!container) throw new Error('useDI must be used within its DIProvider');
    return container;
  }

  return { DIProvider, useDI } as const;
}
