import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useRef, useEffect } from "react";
import { Fragment } from "@/generated/prisma";
import { MessageLoading } from "./message-loading";

interface Props {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
    const trpc = useTRPC();
    const bottomRef = useRef<HTMLDivElement>(null);

    const { data: messages } = useSuspenseQuery(
        trpc.messages.getMany.queryOptions(
            { projectId },
            { refetchInterval: 2000, refetchIntervalInBackground: false }
        )
    );

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Auto-activate latest assistant fragment (final result) to show preview without clicking
    const lastAssistantMessageIdRef = useRef<string | null>(null);
    useEffect(() => {
        const lastAssistantWithFragment = [...messages]
            .reverse()
            .find((m) => m.role === "ASSISTANT" && m.fragment && m.type === "RESULT");

        if (
            lastAssistantWithFragment?.id &&
            lastAssistantWithFragment.id !== lastAssistantMessageIdRef.current &&
            lastAssistantWithFragment.fragment &&
            (activeFragment?.id !== lastAssistantWithFragment.fragment.id)
        ) {
            lastAssistantMessageIdRef.current = lastAssistantWithFragment.id;
            setActiveFragment(lastAssistantWithFragment.fragment);
        }
    }, [messages, activeFragment, setActiveFragment]);

    // Show loader while waiting for an assistant RESULT after the latest user message
    const lastUserIndex = [...messages]
        .map((m, i) => ({ m, i }))
        .reverse()
        .find(({ m }) => m.role === "USER")?.i ?? -1;
    const hasAssistantResultAfterLastUser = messages.some((m, i) => i > lastUserIndex && m.role === "ASSISTANT" && m.type === "RESULT");
    const showLoader = lastUserIndex !== -1 && !hasAssistantResultAfterLastUser;

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1">
                    {messages.map((message) => (
                        <MessageCard 
                            key={message.id}
                            content={message.content}
                            role={message.role}
                            fragment={message.fragment}
                            createdAt={message.createdAt}
                            isActiveFragment={activeFragment?.id === message.fragment?.id}
                            onFragmentClick={() => setActiveFragment(message.fragment)}
                            type={message.type}
                        />
                    ))}

                    {showLoader && <MessageLoading />}
                    <div ref={bottomRef} />
                </div>
            </div>
            
            <div className="relative p-3 pt-1">
                <div className="absolute top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" /> 
                <MessageForm projectId={projectId} />
            </div>
        </div>
    );
};