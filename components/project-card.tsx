"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Folder, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  id: string;
  name: string;
  color: string;
  flashcardCount: number;
  createdAt?: string;
  onDelete: (id: string) => void;
}

export function ProjectCard({ id, name, color, flashcardCount, createdAt, onDelete }: ProjectCardProps) {
  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow group">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div
              className="p-2.5 sm:p-3 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Folder className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="text-base sm:text-lg break-words mb-2">{name}</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">No description provided.</p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex items-center justify-between gap-2">
            {formattedDate && (
              <p className="text-xs text-muted-foreground flex-1">{formattedDate}</p>
            )}
            <Link href={`/project/${id}`} className="flex-shrink-0">
              <Button size="sm">
                Open
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


