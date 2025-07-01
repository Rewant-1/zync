import { trpc, getQueryClient } from "@/trpc/server";
import { HydrationBoundary,dehydrate } from "@tanstack/react-query";
import {Client} from "./client";
import { Suspense } from "react";
const Page = async () => {
const queryClient=getQueryClient();
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({text:"Rewant"}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading bruv..</p>}><Client />
      </Suspense>
    </HydrationBoundary>
  );
}

export default Page;