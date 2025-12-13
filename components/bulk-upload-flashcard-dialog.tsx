"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

export function BulkUploadFlashcardDialog({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const parseFile = async (file: File): Promise<{ question: string; answer: string }[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const isCSV = file.name.endsWith(".csv");
          const workbook = XLSX.read(data, { 
            type: isCSV ? "string" : "binary",
            ...(isCSV && { FS: "," }) // CSV delimiter
          });
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length === 0) {
            reject(new Error("The file is empty"));
            return;
          }

          // Find header row (case-insensitive search for "question" and "answer")
          let headerRowIndex = -1;
          let questionColIndex = -1;
          let answerColIndex = -1;

          for (let i = 0; i < Math.min(10, jsonData.length); i++) {
            const row = jsonData[i];
            if (!row || !Array.isArray(row)) continue;

            for (let j = 0; j < row.length; j++) {
              const cell = String(row[j] || "").toLowerCase().trim();
              if (cell === "question" && questionColIndex === -1) {
                questionColIndex = j;
                headerRowIndex = i;
              }
              if (cell === "answer" && answerColIndex === -1) {
                answerColIndex = j;
                headerRowIndex = i;
              }
            }

            if (questionColIndex !== -1 && answerColIndex !== -1) {
              break;
            }
          }

          if (questionColIndex === -1 || answerColIndex === -1) {
            reject(
              new Error(
                'Could not find "question" and "answer" columns in the file. Please ensure your file has headers with these exact column names.'
              )
            );
            return;
          }

          // Extract data rows
          const flashcards: { question: string; answer: string }[] = [];
          for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || !Array.isArray(row)) continue;

            const question = String(row[questionColIndex] || "").trim();
            const answer = String(row[answerColIndex] || "").trim();

            // Skip empty rows
            if (!question && !answer) continue;

            if (!question || !answer) {
              reject(
                new Error(
                  `Row ${i + 1} is missing a question or answer. Please ensure all rows have both values.`
                )
              );
              return;
            }

            flashcards.push({ question, answer });
          }

          if (flashcards.length === 0) {
            reject(new Error("No valid flashcards found in the file"));
            return;
          }

          resolve(flashcards);
        } catch (err) {
          reject(
            err instanceof Error
              ? err
              : new Error("Failed to parse the file. Please ensure it's a valid Excel or CSV file.")
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      // XLSX can handle both binary (Excel) and text (CSV) files
      if (file.name.endsWith(".csv")) {
        reader.readAsText(file, "UTF-8");
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse the file
      const flashcards = await parseFile(file);

      // Upload to API
      const response = await fetch("/api/flashcards/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcards, projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload flashcards");
      }

      const result = await response.json();
      setSuccess(`Successfully uploaded ${result.count} flashcard${result.count === 1 ? "" : "s"}!`);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Close dialog and refresh after a short delay
      setTimeout(() => {
        setOpen(false);
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while uploading the file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1.5 sm:gap-2 text-sm sm:text-base">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Bulk Upload</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Bulk Upload Flashcards</DialogTitle>
            <DialogDescription className="text-sm">
              Upload an Excel or CSV file with "question" and "answer" columns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileSpreadsheet className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Excel (.xlsx, .xls) or CSV files
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
              </label>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
                {success}
              </div>
            )}

            <div className="p-3 text-xs text-muted-foreground bg-muted rounded-md">
              <p className="font-semibold mb-1">File format requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>First row should contain headers: "question" and "answer"</li>
                <li>Each subsequent row should contain one flashcard</li>
                <li>Column names are case-insensitive</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !file}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

