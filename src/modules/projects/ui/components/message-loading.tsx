import Image from "next/image";
import { useState, useEffect } from "react";

const LOADING_MESSAGES = [
    "Thinking...",
    "Loading...",
    "Generating ...",
    "Analyzing your request...",
    "Crafting a response...",
    "Fetching data...",
    "Building website...",
    "Optimizing layouts...",
    "Final touches...",
] as const;

const ShimmerMessages = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % LOADING_MESSAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []); // interval is independent of props/state

    return (
        <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-base animate-pulse">{LOADING_MESSAGES[currentMessageIndex]}</span>
        </div>
    );
};

export const MessageLoading = () => {
    return (
        <div className="flex flex-col group pb-4 px-2">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                    src="/logo.png"
                    alt="zync"
                    width={18}
                    height={18}
                    className="shrink-0"
                />
                <span className="text-sm font-medium">zync</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4"><ShimmerMessages /></div>
        </div>
    );
};