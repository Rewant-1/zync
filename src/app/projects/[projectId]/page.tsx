import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { getQueryClient } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";


interface Props{
    params: Promise<{
        projectId: string;
    }>
};

const Page =async({params}:Props)=>{
    const {projectId}=await params;

    const queryClient= getQueryClient();
    
    // Note: We're not prefetching protected routes on the server side
    // because the auth context is only available in the actual request scope.
    // The client-side components will handle data fetching with proper authentication.
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={<p>Error!!</p>}>
            <Suspense fallback={<p>Loading...</p>}>
<ProjectView projectId={projectId} />
</Suspense>
</ErrorBoundary>
        </HydrationBoundary>
    )
}
export default Page;