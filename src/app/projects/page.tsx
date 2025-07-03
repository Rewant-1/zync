interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  try {
    const { projectId } = await params;
    
    if (!projectId) {
      return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p>Project ID is missing.</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold">Project</h1>
        <p>Project ID: {projectId}</p>
      </div>
    );
  } catch {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Failed to load project. Please try again.</p>
      </div>
    );
  }
};

export default Page;