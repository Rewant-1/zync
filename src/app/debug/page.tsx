"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from "@/trpc/routers/_app";
import superjson from 'superjson';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Fragment {
  id: string;
  sandboxUrl: string;
  title: string;
  files: Record<string, unknown>;
}

interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT";
  type: "RESULT" | "ERROR";
  createdAt: Date;
  projectId: string;
  fragment?: Fragment;
}

export default function DebugPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Create tRPC client
  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
      }),
    ],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [messagesData, projectsData] = await Promise.all([
        trpcClient.messages.getMany.query(),
        trpcClient.projects.getMany.query()
      ]);
      
      setMessages(messagesData as Message[] || []);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Debug Dashboard</h1>
        <Button onClick={fetchData}>Refresh</Button>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects ({projects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-gray-500">No projects found.</p>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="p-3 border rounded">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-500">ID: {project.id}</div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages ({messages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages found.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={message.role === "USER" ? "default" : "secondary"}>
                        {message.role}
                      </Badge>
                      <Badge variant={message.type === "ERROR" ? "destructive" : "outline"}>
                        {message.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Content:</div>
                      <div className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>

                    {message.fragment && (
                      <div className="mb-3 p-3 bg-blue-50 rounded">
                        <div className="text-sm font-medium mb-1">Fragment:</div>
                        <div className="text-sm">
                          <div>Title: {message.fragment.title}</div>
                          <div>Sandbox URL: 
                            <a 
                              href={message.fragment.sandboxUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline ml-1"
                            >
                              {message.fragment.sandboxUrl}
                            </a>
                          </div>
                          <div>Files: {Object.keys(message.fragment.files || {}).length}</div>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      <div>Message ID: {message.id}</div>
                      <div>Project ID: {message.projectId}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
