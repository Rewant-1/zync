"use client";
import { useState } from "react";
import Link from "next/link";
import { Fragment } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import {EyeIcon,CodeIcon, CrownIcon} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { FragmentWeb } from "../components/fragment-web";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense } from "react";
import { ProjectHeader } from "../components/project-header";
import { FileExplorer } from "@/components/file-explorer";
import { UserControl } from "@/components/user-control";
import { useAuth } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";
interface Props{
    projectId:string;
};

export const ProjectView=({projectId}:Props)=>{
    
        const {has} =useAuth();
        const hasProAccess = has?.({plan:"pro"});
const [activeFragment,setActiveFragment]=useState<Fragment | null>(null);

const [tabState, setTabState] = useState<"preview" | "code">("preview");

   
    return(
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={35}
                    minSize={20}
                    className="flex flex-col min-h-0"
                    >
                        <ErrorBoundary fallback={<p>Failed to load project header</p>}>
                        <Suspense fallback={<p>Loading project...</p>}>
                        <ProjectHeader projectId={projectId}  />
                        </Suspense>
                        </ErrorBoundary>
                        
                        <ErrorBoundary fallback={<p>Failed to load messages</p>}>
                        <Suspense fallback={<p>Loading messages...</p>}>
            <MessagesContainer 
            activeFragment={activeFragment}
            setActiveFragment={setActiveFragment}
            
            projectId={projectId} />
            </Suspense>
            </ErrorBoundary>
            </ResizablePanel>

            
            <ResizableHandle className="hover:bg-primary transition-colors"/>
            <ResizablePanel
                    defaultSize={65}
                    minSize={50}
                    
><Tabs
className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
            ><div className="w-full flex items-center p-2 border-b gap-x-2">
            <TabsList className="h-8 p-0 border rounded-md">
            <TabsTrigger value="preview" className="rounded-md">
                <EyeIcon/><span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon/><span>Code</span>
                </TabsTrigger>            
            </TabsList>
            <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
<Button asChild size="sm" variant="secondary">
    <Link href="/pricing">
    <CrownIcon className="w-4 h-4 mr-1" />Upgrade</Link>
</Button>)}
<UserControl />

            </div>
            </div>
<TabsContent value="preview" >{!!activeFragment && <FragmentWeb data ={activeFragment}/>}</TabsContent>
<TabsContent value="code"  className="min-h-0">
    {!!activeFragment ?.files &&(<FileExplorer files={activeFragment.files as {[path:string]:string}}/>)}
</TabsContent>

            
            </Tabs>
            </ResizablePanel>
            </ResizablePanelGroup>

            
            
        </div>
    );
}