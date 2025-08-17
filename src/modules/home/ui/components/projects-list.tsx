"use client";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export const ProjectsList = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  if (!user) return null;
  return (
    <div className="w-full glass rounded-2xl p-8 border border-[rgba(251,191,36,0.12)] flex flex-col gap-y-8">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-[#fbbf24] to-[#00fff0] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">Z</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          {user?.firstName}&apos;s Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-[#fbbf24] to-[#00fff0] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">✨</span>
            </div>
            <p className="text-neutral-400 text-lg">
              No projects yet. Ready to build something amazing?
            </p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            asChild
            variant="outline"
            className="font-normal h-auto justify-start w-full text-start p-6 bg-[rgba(251,191,36,0.05)] border-[rgba(251,191,36,0.2)] text-white hover:bg-[rgba(251,191,36,0.1)] hover:border-[rgba(251,191,36,0.3)] transition-all duration-300 rounded-xl"
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4 w-full">
                <div className="w-10 h-10 bg-gradient-to-r from-[#fbbf24] to-[#00fff0] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="zync"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {project.name}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
