"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Sparkles, ExternalLink, RotateCcw, Cpu } from "lucide-react";
import { useState, useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Prediction {
  label: string;
  score: number;
}

const EXAMPLES = [
  "This AI project is absolutely amazing and innovative!",
  "I'm disappointed with the results, it didn't work as expected.",
  "Building neural networks is both challenging and rewarding.",
  "The training loss converged but accuracy on validation is poor.",
  "Open source contributions make the world a better place.",
];

const LABEL_CONFIG: Record<string, { color: string; bg: string; border: string; emoji: string }> = {
  POSITIVE: {
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/35",
    emoji: "✨",
  },
  NEGATIVE: {
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/35",
    emoji: "⚡",
  },
};

type Status = "idle" | "loading-model" | "ready" | "running" | "error";

export function AiPlayground() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Prediction[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classifierRef = useRef<any>(null);

  const loadModel = async () => {
    if (classifierRef.current) return classifierRef.current;

    setStatus("loading-model");
    setProgress(0);
    setErrorMsg(null);

    try {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.allowLocalModels = false;

      const classifier = await pipeline(
        "sentiment-analysis",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          progress_callback: (p: any) => {
            if (p.status === "downloading" && p.total) {
              setProgress(Math.round((p.loaded / p.total) * 100));
            }
          },
        }
      );

      classifierRef.current = classifier;
      setStatus("ready");
      return classifier;
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrorMsg("Failed to load model. Please refresh and try again.");
      return null;
    }
  };

  const analyze = async (input?: string) => {
    const query = (input ?? text).trim().slice(0, 512);
    if (!query) return;

    if (input) setText(input);
    setResults(null);
    setErrorMsg(null);
    setStatus(classifierRef.current ? "running" : "loading-model");

    const classifier = await loadModel();
    if (!classifier) return;

    setStatus("running");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const output: any = await classifier(query, { topk: 2 });
      const preds: Prediction[] = Array.isArray(output[0]) ? output[0] : output;
      setResults(preds.sort((a, b) => b.score - a.score));
      setStatus("ready");
    } catch {
      setStatus("error");
      setErrorMsg("Inference failed. Please try again.");
    }
  };

  const reset = () => {
    setResults(null);
    setText("");
    setErrorMsg(null);
    setStatus(classifierRef.current ? "ready" : "idle");
  };

  const isLoading = status === "loading-model" || status === "running";
  const topResult = results?.[0];

  return (
    <section id="ai-playground" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute top-1/2 left-0 w-[460px] h-[460px] bg-primary/10 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <SectionHeader
          number="04"
          badge="Live AI Demo"
          icon={Brain}
          title="AI Playground"
          subtitle="Sentiment inference executing directly in your browser via DistilBERT + WebAssembly — zero backend latency."
        />

        <motion.div
          className="glass-panel rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          {/* Console Top Bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.025]">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
            <span className="ml-3 text-[11px] text-gray-400 font-mono truncate">
              Xenova/distilbert-sst2 · ONNX WebAssembly · Client Inference
            </span>
            <a
              href="https://huggingface.co/nyxus-AI"
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-primary transition-colors flex-shrink-0"
            >
              <ExternalLink size={11} />
              <span>HuggingFace</span>
            </a>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {status === "loading-model" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-primary/10 border border-primary/25"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Cpu size={16} className="text-primary animate-pulse" />
                  <span className="text-sm text-primary font-medium">
                    {progress > 0 ? `Downloading model weights… ${progress}%` : "Initializing ONNX runtime…"}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 via-primary to-accent rounded-full"
                    initial={{ width: "5%" }}
                    animate={{ width: progress > 0 ? `${progress}%` : "30%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 font-mono">
                  ~28MB quantized ONNX model · cached locally after first run
                </p>
              </motion.div>
            )}

            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) analyze();
                }}
                placeholder="Type any sentence to run local transformer sentiment analysis…"
                rows={4}
                disabled={isLoading}
                className="w-full bg-[#070612]/70 border border-white/10 focus:border-primary/60 focus:ring-1 focus:ring-primary/40 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 resize-none outline-none transition-all text-sm md:text-base leading-relaxed disabled:opacity-60"
              />
              <span className="absolute bottom-3 right-4 text-xs text-gray-500 font-mono">
                {text.length}/512
              </span>
            </div>

            <div>
              <p className="text-[11px] font-mono text-gray-500 uppercase tracking-[0.18em] mb-2.5">
                Quick Prompts
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => analyze(ex)}
                    disabled={isLoading}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.035] border border-white/[0.08] text-gray-300 hover:text-white hover:border-primary/45 hover:bg-primary/15 transition-all disabled:opacity-40"
                  >
                    {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => analyze()}
                disabled={isLoading || !text.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {status === "loading-model" ? "Loading model…" : "Running inference…"}
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Analyze Sentiment</span>
                  </>
                )}
              </button>
              {(results || errorMsg) && (
                <button
                  onClick={reset}
                  className="px-5 py-3.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white hover:border-primary/40 transition-all"
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-sm"
              >
                {errorMsg}
              </motion.div>
            )}

            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4 pt-2"
                >
                  {topResult && (
                    <div
                      className={`flex items-center gap-4 p-4 rounded-2xl border ${
                        LABEL_CONFIG[topResult.label]?.bg ?? "bg-white/5"
                      } ${LABEL_CONFIG[topResult.label]?.border ?? "border-white/10"}`}
                    >
                      <span className="text-3xl">{LABEL_CONFIG[topResult.label]?.emoji ?? "🤖"}</span>
                      <div>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">
                          Predicted Sentiment
                        </p>
                        <p className={`text-xl font-black ${LABEL_CONFIG[topResult.label]?.color ?? "text-white"}`}>
                          {topResult.label}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.18em]">
                          Confidence
                        </p>
                        <p className="text-2xl font-black text-white font-mono">
                          {(topResult.score * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-[11px] font-mono text-gray-500 uppercase tracking-[0.18em] flex items-center gap-1.5">
                      <Sparkles size={11} className="text-primary" />
                      Score Distribution
                    </p>
                    {results.map((pred) => {
                      const cfg = LABEL_CONFIG[pred.label];
                      return (
                        <div key={pred.label} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className={`font-bold ${cfg?.color ?? "text-white"}`}>{pred.label}</span>
                            <span className="text-gray-300 font-mono text-xs">
                              {(pred.score * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.score * 100}%` }}
                              transition={{ duration: 0.75, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                pred.label === "POSITIVE"
                                  ? "bg-gradient-to-r from-violet-500 to-primary"
                                  : "bg-gradient-to-r from-pink-500 to-rose-500"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-gray-500 text-xs mt-6 font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          100% client-side · Powered by{" "}
          <a
            href="https://github.com/huggingface/transformers.js"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-accent transition-colors"
          >
            Transformers.js
          </a>{" "}
          + WebAssembly ·{" "}
          <a
            href="https://huggingface.co/Xenova/distilbert-base-uncased-finetuned-sst-2-english"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-accent transition-colors"
          >
            distilbert-sst2 (ONNX)
          </a>
        </motion.p>
      </div>
    </section>
  );
}
