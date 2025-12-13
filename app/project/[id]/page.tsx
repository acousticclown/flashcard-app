import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ProjectContent } from "@/components/project/project-content";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      _count: {
        select: { flashcards: true },
      },
    },
  });

  if (!project || project.userId !== session.user?.id) {
    redirect("/dashboard");
  }

  return <ProjectContent projectId={id} projectName={project.name} projectColor={project.color} />;
}

