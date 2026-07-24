import { useState, useRef } from "react";
import { Upload, Loader2, Check } from "lucide-react";
import { uploadFile } from "@/lib/api";

interface FileUploadButtonProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  accept?: string;
}

export function FileUploadButton({ onUploadSuccess, label = "Upload", accept = "*" }: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("Not authenticated");
      
      const result = await uploadFile(file, token);
      onUploadSuccess(result.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-gray-300 transition-all disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin text-primary" />
        ) : success ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Upload size={14} />
        )}
        {uploading ? "Uploading..." : success ? "Uploaded!" : label}
      </button>
    </div>
  );
}
