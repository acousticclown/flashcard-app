"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardCardProps {
  id: string;
  question: string;
  answer: string;
  color: string;
  onDelete: (id: string) => void;
}

export function FlashcardCard({
  id,
  question,
  answer,
  color,
  onDelete,
}: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-[250px] sm:h-[280px] md:h-[300px] perspective-1000"
    >
      <Card className="h-full cursor-pointer group relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="h-8 w-8"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>

        <motion.div
          className="h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front side - Question */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ transform: "rotateY(0deg)" }}
          >
            <CardHeader
              className="h-full flex flex-col justify-center items-center p-6"
              style={{ backgroundColor: `${color}15` }}
            >
              <div
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
                style={{ color }}
              >
                Question
              </div>
              <p className="text-base sm:text-lg md:text-xl font-medium text-center px-2 break-words">{question}</p>
              <div className="mt-4 sm:mt-6 text-xs text-muted-foreground">
                Click to flip
              </div>
            </CardHeader>
          </div>

          {/* Back side - Answer */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            <CardContent
              className="h-full flex flex-col justify-center items-center p-6"
              style={{ backgroundColor: `${color}25` }}
            >
              <div
                className="text-sm font-semibold mb-4 uppercase tracking-wide"
                style={{ color }}
              >
                Answer
              </div>
              <p className="text-sm sm:text-base md:text-lg text-center px-2 break-words">{answer}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-6 gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Flip back
              </Button>
            </CardContent>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}


