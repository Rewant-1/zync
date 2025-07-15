import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import Image from "next/image";

const DashboardPage = () => {
  return (
    <div className="flex flex-col max-w-6xl mx-auto w-full">
      {/* Hero Section */}
      <section 
        className="space-y-8 py-16"
      >
        <div className="flex flex-col items-center space-y-6">
          <div
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="zync"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient">
              zync
            </span>
          </div>
          
          <div
            className="text-center space-y-4"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Build Something{" "}
              <span className="bg-gradient-to-r from-[#b96aff] via-[#00fff0] to-[#fff] bg-clip-text text-transparent animate-gradient">
                Amazing
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Create apps and websites by chatting with AI. Turn your ideas into reality.
            </p>
          </div>
        </div>

        {/* Project Form */}
        <div
          className="max-w-4xl mx-auto w-full"
        >
          <ProjectForm />
        </div>
      </section>

      {/* Projects List */}
      <div
        className="pb-16"
      >
        <ProjectsList />
      </div>
    </div>
  );
};

export default DashboardPage;
