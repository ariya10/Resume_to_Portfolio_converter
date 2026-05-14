import { useState, useCallback, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { client } from "@/lib/api";

interface ResumeUploaderProps {
  onParsed: (parsedData: any, enhancedData: any, fileName: string) => void;
}

export default function ResumeUploader({ onParsed }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "parsing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileToDataUri = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleFile = useCallback(
    async (f: File) => {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(f.type) && !f.name.endsWith(".pdf") && !f.name.endsWith(".docx")) {
        setErrorMsg("Please upload a PDF or DOCX file");
        setStatus("error");
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setErrorMsg("File size must be under 10MB");
        setStatus("error");
        return;
      }

      setFile(f);
      setStatus("uploading");
      setProgress(20);
      setErrorMsg("");

      try {
        const dataUri = await fileToDataUri(f);
        setProgress(40);
        setStatus("parsing");

        setProgress(60);

        const response = await client.apiCall.invoke({
          url: "/api/v1/portfolio/parse",
          method: "POST",
          data: {
            pdf_data_uri: dataUri,
            file_type: f.name.endsWith(".docx") ? "docx" : "pdf",
          },
          options: { timeout: 600000 },
        });

        setProgress(100);
        setStatus("success");

        const result = response.data;
        onParsed(result.parsed_data, result.enhanced_data, f.name);
      } catch (err: any) {
        console.error("Parse error:", err);
        setErrorMsg(err?.data?.detail || err?.message || "Failed to parse resume. Please try again.");
        setStatus("error");
      }
    },
    [onParsed]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile]
  );

  const isProcessing = status === "uploading" || status === "parsing";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isProcessing && inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-violet-500 bg-violet-500/10 scale-[1.02]"
            : status === "error"
            ? "border-red-400/50 bg-red-500/5"
            : status === "success"
            ? "border-emerald-400/50 bg-emerald-500/5"
            : "border-white/15 bg-white/5 hover:border-violet-400/50 hover:bg-violet-500/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={onFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        {status === "idle" && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
              <Upload className="w-7 h-7 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Drop your resume here
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              or click to browse · PDF or DOCX · Max 10MB
            </p>
            <Button
              variant="outline"
              className="border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </>
        )}

        {isProcessing && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-violet-400 animate-spin" />
            <div>
              <p className="text-white font-medium">
                {status === "uploading" ? "Reading your resume..." : "AI is analyzing your resume..."}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {file?.name} · This may take a minute
              </p>
            </div>
            <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
            <p className="text-white font-medium">Resume parsed successfully!</p>
            <p className="text-sm text-slate-400">{file?.name}</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
            <p className="text-white font-medium">Something went wrong</p>
            <p className="text-sm text-red-300">{errorMsg}</p>
            <Button
              variant="outline"
              size="sm"
              className="border-red-400/30 text-red-300 hover:bg-red-500/10"
              onClick={(e) => {
                e.stopPropagation();
                setStatus("idle");
                setFile(null);
                setErrorMsg("");
              }}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}