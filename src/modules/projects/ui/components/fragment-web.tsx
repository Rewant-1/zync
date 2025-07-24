import { Fragment } from "@/generated/prisma";
import {useState, useEffect} from "react";
import {ExternalLinkIcon,RefreshCcwIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { getIframeSandboxAttributes, shouldShowIframeWarning, fixMixedContentUrl, detectMixedContentIssue } from "@/lib/sandbox-utils";






interface Props{
    data: Fragment;
}
export function FragmentWeb({data}: Props) {
    const [copied, setCopied] = useState(false);
    const [FragmentKey, setFragmentKey] = useState(0);
    const [iframeError, setIframeError] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    
    // Fix mixed content issues by ensuring HTTPS URLs in production
    const safeSandboxUrl = fixMixedContentUrl(data.sandboxUrl);
    const hasMixedContentIssue = detectMixedContentIssue(data.sandboxUrl);
    
    const onRefresh=() => {
        setFragmentKey(prevKey => prevKey + 1);
        setIframeError(false);
        setIframeLoaded(false);
        setShowWarning(false);
    };
    
    const handleCopy=() => {
        navigator.clipboard.writeText(safeSandboxUrl );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Add timeout to detect if iframe fails to load
    useEffect(() => {
        if (!iframeLoaded && !iframeError) {
            const timeout = setTimeout(() => {
                if (shouldShowIframeWarning() || hasMixedContentIssue) {
                    setShowWarning(true);
                }
            }, 8000);

            return () => clearTimeout(timeout);
        }
    }, [FragmentKey, iframeLoaded, iframeError, hasMixedContentIssue, data.sandboxUrl, safeSandboxUrl]);

  

    return (
        <div className="flex-col flex w-full h-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">

<Hint text="Refresh the sandbox" side="bottom" align="start">
                
<Button size="sm" variant="outline" onClick={onRefresh}>
    <RefreshCcwIcon/>
</Button>
</Hint>
<Hint text="Click to copy" side="bottom" >
<Button size="sm" 
variant="outline"
 onClick={handleCopy}
 className="flex-1 justify-start text-start font-normal" 
 disabled={!data.sandboxUrl || copied}>
    <span className="truncate">
        {data.sandboxUrl}
    </span>
</Button>
</Hint>
<Hint text="Open in new tab" side="bottom" align="start">
<Button
    size ="sm"
    disabled={!data.sandboxUrl}
    variant="outline"
    onClick={() => {
        if(!data.sandboxUrl) return;
        window.open(data.sandboxUrl, "_blank");
    }}
    ><ExternalLinkIcon />
</Button>
</Hint>

            </div>
            {!iframeError ? (
                <div className="relative w-full h-full">
                    {!iframeLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Loading sandbox...</p>
                                {showWarning && (
                                    <p className="text-xs text-amber-600 mt-2 max-w-xs">
                                        {hasMixedContentIssue 
                                            ? "Mixed content detected. Try opening in a new tab" 
                                            : "If this takes too long, try opening in a new tab"
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    <iframe
                    key={FragmentKey}
                    className=" w-full h-full "
                    sandbox={getIframeSandboxAttributes()}
                    src={safeSandboxUrl}
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="fullscreen"
                    title="Sandbox Preview"
                    onLoad={(e) => {
                        setIframeLoaded(true);
                        // Handle iframe load errors
                        const iframe = e.target as HTMLIFrameElement;
                        try {
                            if (iframe.contentWindow) {
                                // Iframe loaded successfully
                            }
                        } catch {
                            // Iframe access restricted due to cross-origin policy
                        }
                    }}
                    onError={() => {
                        setIframeError(true);
                    }}/>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
                        <p className="text-muted-foreground mb-4">
                            {hasMixedContentIssue 
                                ? "The sandbox preview cannot be embedded due to mixed content restrictions (HTTP content on HTTPS page)."
                                : "The sandbox preview cannot be embedded. This is common when deploying due to security restrictions."
                            }
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            if(!data.sandboxUrl) return;
                            // Use original URL for new tab - browsers handle mixed content differently in new tabs
                            window.open(data.sandboxUrl, "_blank");
                        }}
                        disabled={!data.sandboxUrl}
                        className="mb-2"
                    >
                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                        Open in New Tab
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onRefresh}
                        size="sm"
                    >
                        <RefreshCcwIcon className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            )}
          
        </div>
    );
}
