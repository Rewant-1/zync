import 'server-only';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);

export const createCaller = cache(async () => {
  const context = await createTRPCContext();
  return appRouter.createCaller(context);
});
