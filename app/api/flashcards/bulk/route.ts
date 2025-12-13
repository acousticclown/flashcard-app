import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { flashcards, projectId } = body;

    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      return NextResponse.json(
        { error: "Flashcards array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Validate all flashcards have question and answer
    for (const flashcard of flashcards) {
      if (!flashcard.question || !flashcard.answer) {
        return NextResponse.json(
          { error: "All flashcards must have both question and answer" },
          { status: 400 }
        );
      }
    }

    // Create flashcards in bulk
    const createdFlashcards = await prisma.flashcard.createMany({
      data: flashcards.map((flashcard: { question: string; answer: string }) => ({
        question: flashcard.question,
        answer: flashcard.answer,
        projectId,
      })),
    });

    return NextResponse.json(
      { count: createdFlashcards.count, message: "Flashcards created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating flashcards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

