'use client';
// ^-- to make sure we can mount the Provider from a server component
import superjson from 'superjson';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
let browserQueryClient: QueryClient;
function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
function getUrl() {
  const base =
    typeof window !== 'undefined'
      ? ''
      : process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return `${base}/api/trpc`;}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: superjson, 
          url: getUrl(),
        }),
      ],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}