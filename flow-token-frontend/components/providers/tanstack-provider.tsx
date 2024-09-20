"use client";

// app/layout.js or pages/_app.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface TanstackProviderProps {
  children: ReactNode;
}

export default function TanstackProvider({ children }: TanstackProviderProps) {
    const queryClient = new QueryClient();

    return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
