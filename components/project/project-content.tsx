"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { FlashcardCard } from "@/components/flashcard-card";
import { CreateFlashcardDialog } from "@/components/create-flashcard-dialog";
import { BulkUploadFlashcardDialog } from "@/components/bulk-upload-flashcard-dialog";
import { AppLayout } from "@/components/layout/app-layout";
import { motion } from "framer-motion";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface ProjectContentProps {
  projectId: string;
  projectName: string;
  projectColor: string;
}

export function ProjectContent({ projectId, projectName, projectColor }: ProjectContentProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/flashcards?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setFlashcards(data);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [projectId]);

  const handleDeleteFlashcard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flashcard?")) return;

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFlashcards(flashcards.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      topBarContent={
        <div className="flex gap-2">
          <CreateFlashcardDialog projectId={projectId} onSuccess={fetchFlashcards} />
          <BulkUploadFlashcardDialog projectId={projectId} onSuccess={fetchFlashcards} />
        </div>
      }
    >
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 break-words"
            style={{ color: projectColor }}
          >
            {projectName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {flashcards.length} {flashcards.length === 1 ? "flashcard" : "flashcards"}
          </p>
        </div>

        {flashcards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${projectColor}20` }}
            >
              <Plus className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: projectColor }} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No flashcards yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">
              Create your first flashcard to get started
            </p>
            <CreateFlashcardDialog projectId={projectId} onSuccess={fetchFlashcards} />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {flashcards.map((flashcard, index) => (
              <motion.div
                key={flashcard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FlashcardCard
                  id={flashcard.id}
                  question={flashcard.question}
                  answer={flashcard.answer}
                  color={projectColor}
                  onDelete={handleDeleteFlashcard}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}


