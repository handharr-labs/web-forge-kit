'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export interface QueryProviderConfig {
  staleTime?: number;
  queryRetry?: number | false;
  mutationRetry?: number | false;
}

const DEFAULTS: Required<QueryProviderConfig> = {
  staleTime: 60_000,
  queryRetry: 1,
  mutationRetry: 0,
};

export function QueryProvider({
  children,
  config,
}: {
  children: ReactNode;
  config?: QueryProviderConfig;
}) {
  const merged = { ...DEFAULTS, ...config };
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: merged.staleTime, retry: merged.queryRetry },
          mutations: { retry: merged.mutationRetry },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
