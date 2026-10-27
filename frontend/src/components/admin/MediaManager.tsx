"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Trash2, Copy, Check, X, ZoomIn, ChevronRight,
  Image as ImageIcon, Loader2, RefreshCw, CloudUpload,
  HardDrive, AlertCircle, ExternalLink
} from "lucide-react";
import { listUploads, uploadFile, deleteUpload, getImageUrl, UploadedImage } from "@/lib/api";
import Image from "next/image";

function formatBytes(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function MediaManager() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [source, setSource] = useState<"cloudinary" | "local" | "">("");
  const [error, setError] = useState<string | null>(null);

  // Upload
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox
  const [lightbox, setLightbox] = useState<UploadedImage | null>(null);

  // Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<UploadedImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  const load = useCallback(async (cursor?: string) => {
    if (!cursor) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const res = await listUploads(token, cursor);
      setImages((prev) => cursor ? [...prev, ...res.images] : res.images);
      setNextCursor(res.next_cursor);
      setSource(res.source as "cloudinary" | "local");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load images");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) await handleUploadFiles(files);
  };

  const handleUploadFiles = async (files: File[]) => {
    setUploading(true);
    setUploadProgress([]);
    const uploaded: UploadedImage[] = [];
    for (const file of files) {
      setUploadProgress((prev) => [...prev, `Uploading ${file.name}…`]);
      try {
        const result = await uploadFile(file, token);
        uploaded.push(result);
        setUploadProgress((prev) =>
          prev.map((p) => (p.includes(file.name) ? `✓ ${file.name}` : p))
        );
      } catch {
        setUploadProgress((prev) =>
          prev.map((p) => (p.includes(file.name) ? `✗ ${file.name} (failed)` : p))
        );
      }
    }
    setImages((prev) => [...uploaded.reverse(), ...prev]);
    setUploading(false);
    setTimeout(() => setUploadProgress([]), 3000);
  };

  const copyUrl = (img: UploadedImage) => {
    navigator.clipboard.writeText(img.url).then(() => {
      setCopiedId(img.public_id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUpload(deleteTarget.public_id, token);
      setImages((prev) => prev.filter((i) => i.public_id !== deleteTarget.public_id));
      setDeleteTarget(null);
    } catch (e) {
      alert("Delete failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-lime-400" />
            Media Library
            {source && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ml-1 ${
                source === "cloudinary"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}>
                {source === "cloudinary" ? (
                  <span className="flex items-center gap-1"><CloudUpload size={10} /> Cloudinary</span>
                ) : (
                  <span className="flex items-center gap-1"><HardDrive size={10} /> Local</span>
                )}
              </span>
            )}
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {images.length} image{images.length !== 1 ? "s" : ""} • Drag &amp; drop to upload
          </p>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${dragging
            ? "border-lime-400 bg-lime-500/10 scale-[1.01]"
            : "border-white/10 hover:border-lime-500/40 hover:bg-lime-500/5"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) handleUploadFiles(files);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
              <div className="text-center space-y-1">
                {uploadProgress.map((msg, i) => (
                  <p key={i} className={`text-xs font-mono ${
                    msg.startsWith("✓") ? "text-lime-400" :
                    msg.startsWith("✗") ? "text-red-400" : "text-gray-400"
                  }`}>{msg}</p>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all
                ${dragging ? "bg-lime-500/20 border-lime-500/40" : "bg-white/5 border-white/10"}`}>
                <Upload className={`w-6 h-6 ${dragging ? "text-lime-400" : "text-gray-500"}`} />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">
                  {dragging ? "Drop images here" : "Click or drag images to upload"}
                </p>
                <p className="text-gray-500 text-xs mt-1">PNG, JPG, WebP, GIF • Multiple files supported</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
          <button onClick={() => load()} className="ml-auto underline">Retry</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
          <p>No images yet. Upload your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {images.map((img, i) => (
              <motion.div
                key={img.public_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: Math.min(i * 0.02, 0.4) }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-lime-500/30 transition-all"
              >
                <Image
                  src={getImageUrl(img.url, 400) || img.url}
                  alt={img.filename}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/65 transition-all duration-200 flex flex-col justify-between p-2 opacity-0 group-hover:opacity-100">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => setLightbox(img)}
                      title="Preview"
                      className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur hover:bg-white/25 flex items-center justify-center transition-all"
                    >
                      <ZoomIn size={13} className="text-white" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(img)}
                      title="Delete"
                      className="w-7 h-7 rounded-lg bg-red-500/20 backdrop-blur hover:bg-red-500/50 flex items-center justify-center transition-all"
                    >
                      <Trash2 size={13} className="text-red-300" />
                    </button>
                  </div>

                  <button
                    onClick={() => copyUrl(img)}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${copiedId === img.public_id
                        ? "bg-lime-500/30 text-lime-300"
                        : "bg-white/10 backdrop-blur hover:bg-white/25 text-white"
                      }`}
                  >
                    {copiedId === img.public_id
                      ? <><Check size={11} /> Copied!</>
                      : <><Copy size={11} /> Copy URL</>
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More */}
      {nextCursor && (
        <div className="flex justify-center">
          <button
            onClick={() => load(nextCursor)}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-lime-500/10 hover:border-lime-500/20 text-gray-400 hover:text-lime-400 transition-all text-sm font-medium disabled:opacity-50"
          >
            {loadingMore ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
            Load more
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl"
            >
              <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={getImageUrl(lightbox.url, 1200) || lightbox.url}
                  alt={lightbox.filename}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Filename</p>
                    <p className="text-white font-mono truncate">{lightbox.filename}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-500 mb-1">Dimensions</p>
                    <p className="text-white">{lightbox.width && lightbox.height ? `${lightbox.width}×${lightbox.height}` : "—"}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-500 mb-1">File Size</p>
                    <p className="text-white">{formatBytes(lightbox.bytes)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-black/40 rounded-lg px-3 py-2 font-mono text-xs text-gray-400 truncate border border-white/5">
                    {lightbox.url}
                  </div>
                  <button
                    onClick={() => copyUrl(lightbox)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                      ${copiedId === lightbox.public_id
                        ? "bg-lime-500/20 text-lime-300 border border-lime-500/30"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300"
                      }`}
                  >
                    {copiedId === lightbox.public_id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy URL</>}
                  </button>
                  <a
                    href={lightbox.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 transition-all"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-red-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Delete Image?</h3>
              <p className="text-gray-400 text-sm mb-1">
                This will permanently delete the image from {source === "cloudinary" ? "Cloudinary" : "the server"}.
              </p>
              <p className="text-gray-600 text-xs font-mono mb-6 truncate">{deleteTarget.filename}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
