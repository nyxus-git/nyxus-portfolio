"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ExternalLink, Download, Heart, Layers } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
  "token-classification": "text-purple-300 border-purple-400/40 bg-purple-400/10",
  "image-classification": "text-violet-300 border-violet-400/40 bg-violet-400/10",
  "object-detection": "text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-400/10",
  "text-generation": "text-accent border-accent/40 bg-accent/10",
  "fill-mask": "text-indigo-300 border-indigo-400/40 bg-indigo-400/10",
  "feature-extraction": "text-pink-300 border-pink-400/40 bg-pink-400/10",
  "question-answering": "text-purple-200 border-purple-300/40 bg-purple-300/10",
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
    <section id="model-hub" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute top-1/2 right-1/4 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="05"
          badge="HuggingFace"
          icon={Layers}
          title="Model Hub"
          subtitle="Published open-source checkpoints and fine-tuned models ready for inference."
        />

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6 h-44 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="glass-card rounded-3xl text-center py-16 text-gray-400">
            <Layers size={44} className="mx-auto mb-4 text-primary/40" />
            <p>
              Models will appear here once published on{" "}
              <a
                href="https://huggingface.co/nyxus-AI"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-accent underline"
              >
                HuggingFace
              </a>
              .
            </p>
          </div>
        )}

        {!loading && !error && models.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, i) => {
              const taskKey = model.pipeline_tag ?? "";
              const taskColor =
                TASK_COLORS[taskKey] ?? "text-gray-300 border-white/15 bg-white/5";
              const taskLabel = TASK_LABELS[taskKey] ?? (taskKey || "Model");
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
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col gap-4 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${taskColor}`}>
                      {taskLabel}
                    </span>
                    <ExternalLink
                      size={15}
                      className="text-gray-500 group-hover:text-primary transition-colors"
                    />
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {shortId}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 font-mono">nyxus-AI/{shortId}</p>
                  </div>

                  <div className="flex items-center gap-5 text-xs font-mono text-gray-400 mt-auto pt-4 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1.5">
                      <Download size={13} className="text-primary" />
                      {formatNumber(model.downloads)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart size={13} className="text-accent" />
                      {formatNumber(model.likes)}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <a
            href="https://huggingface.co/nyxus-AI"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary/10 border border-primary/30 hover:border-primary/60 text-primary hover:text-white hover:bg-primary/20 font-semibold text-sm transition-all"
          >
            <Layers size={15} />
            <span>View All Models on HuggingFace</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
