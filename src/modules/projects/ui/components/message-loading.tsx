import Image from "next/image";
import { useState,useEffect } from "react";

const ShimmerMessages=()=>{
    const messages=[
        "Thinking...",
        "Loading...",
        "Generating ...",
        "Analyzing your request...",
        "Crafting a response...",
        "Fetching data...", 
        "Building website...",
        "Optimizing layouts...",
        "Final touches...",
    ];
const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000); // Change message every second
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="flex items-center gap-2">
           
            <span className="text-muted-foreground text-base animate-pulse">{messages[currentMessageIndex]}</span>
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