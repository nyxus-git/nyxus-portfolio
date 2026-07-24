"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ExternalLink, Download, Heart, Layers } from "lucide-react";

interface HFModel {
  id: string;
  modelId: string;
  pipeline_tag?: string;
  downloads?: number;
  likes?: number;
  lastModified?: string;
}

const TASK_COLORS: Record<string, string> = {
  "text-classification": "text-primary border-primary/40 bg-primary/10",
  "token-classification": "text-cyan-400 border-cyan-400/40 bg-cyan-400/10",
  "image-classification": "text-violet-400 border-violet-400/40 bg-violet-400/10",
  "object-detection": "text-orange-400 border-orange-400/40 bg-orange-400/10",
  "text-generation": "text-pink-400 border-pink-400/40 bg-pink-400/10",
  "fill-mask": "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  "feature-extraction": "text-blue-400 border-blue-400/40 bg-blue-400/10",
  "question-answering": "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
};

const TASK_LABELS: Record<string, string> = {
  "text-classification": "Text Classification",
  "token-classification": "NER",
  "image-classification": "Image Classification",
  "object-detection": "Object Detection",
  "text-generation": "Text Generation",
  "fill-mask": "Fill Mask",
  "feature-extraction": "Embeddings",
  "question-answering": "QA",
};

function formatNumber(n: number | undefined): string {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function ModelHub() {
  const [models, setModels] = useState<HFModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://huggingface.co/api/models?author=nyxus-AI&sort=downloads&direction=-1&limit=6")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data: HFModel[]) => {
        setModels(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (!loading && !error && models.length === 0) return null;

  return (
    <section id="model-hub" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium mb-4">
            <Layers size={16} className="text-primary" />
            <span>HuggingFace</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Model Hub
          </h2>
          <p className="text-gray-400 mt-3 text-lg">My published AI models — open source and free to use.</p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 h-44 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-gray-500">
            <Layers size={48} className="mx-auto mb-4 opacity-30" />
            <p>Models will appear here once published on{" "}
              <a href="https://huggingface.co/nyxus-AI" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                HuggingFace
              </a>.
            </p>
          </div>
        )}

        {!loading && !error && models.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, i) => {
              const taskKey = model.pipeline_tag ?? "";
              const taskColor = TASK_COLORS[taskKey] ?? "text-gray-400 border-gray-400/30 bg-gray-400/10";
              const taskLabel = TASK_LABELS[taskKey] ?? taskKey ?? "Model";
              const shortId = model.modelId?.replace("nyxus-AI/", "") ?? model.id;

              return (
                <motion.a
                  key={model.id}
                  href={`https://huggingface.co/${model.modelId ?? model.id}`}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-4 group cursor-pointer"
                >
                  {/* Task badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${taskColor}`}>
                      {taskLabel}
                    </span>
                    <ExternalLink size={14} className="text-gray-500 group-hover:text-primary transition-colors" />
                  </div>

                  {/* Model name */}
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {shortId}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 font-mono">nyxus-AI/{shortId}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-auto">
                    <span className="flex items-center gap-1">
                      <Download size={13} className="text-primary/70" />
                      {formatNumber(model.downloads)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={13} className="text-pink-400/70" />
                      {formatNumber(model.likes)}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="https://huggingface.co/nyxus-AI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold hover:bg-primary/20 transition-colors"
          >
            <Layers size={16} />
            View all models on HuggingFace
          </a>
        </motion.div>
      </div>
    </section>
  );
}
