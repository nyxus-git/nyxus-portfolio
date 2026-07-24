"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Sparkles, ExternalLink, RotateCcw, Cpu } from "lucide-react";
import { useState, useRef } from "react";

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
    border: "border-primary/30",
    emoji: "😊",
  },
  NEGATIVE: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    emoji: "😞",
  },
};

type Status = "idle" | "loading-model" | "ready" | "running" | "error";

export function AiPlayground() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Prediction[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep classifier in a ref so it persists across renders without re-loading
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classifierRef = useRef<any>(null);

  const loadModel = async () => {
    if (classifierRef.current) return classifierRef.current;

    setStatus("loading-model");
    setProgress(0);
    setErrorMsg(null);

    try {
      // Dynamic import — tree-shaken at build time
      const { pipeline, env } = await import("@huggingface/transformers");

      // Use cached ONNX quantized model (~28MB, downloaded once)
      env.allowLocalModels = false;

      const classifier = await pipeline(
        "sentiment-analysis",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
        {
          // Show download progress
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
      // Output is [{label, score}, ...]
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
    <section id="ai-playground" className="py-24 px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Brain size={16} />
            <span>Live AI Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight mb-4">
            AI Playground
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sentiment analysis running <strong className="text-white">directly in your browser</strong> using DistilBERT + WebAssembly. No server. No API key.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="glass-panel rounded-3xl overflow-hidden border border-white/[0.08]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Terminal bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-gray-500 font-mono">
              Xenova/distilbert-sst2 · ONNX WebAssembly · In-Browser Inference
            </span>
            <a
              href="https://huggingface.co/nyxus-AI"
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
            >
              <ExternalLink size={11} />
              HuggingFace
            </a>
          </div>

          <div className="p-6 md:p-8 space-y-5">
            {/* Model loading progress */}
            {status === "loading-model" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-primary/5 border border-primary/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Cpu size={16} className="text-primary animate-pulse" />
                  <span className="text-sm text-primary font-medium">
                    {progress > 0 ? `Downloading model… ${progress}%` : "Loading model weights…"}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: "5%" }}
                    animate={{ width: progress > 0 ? `${progress}%` : "30%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  ~28MB quantized ONNX model · cached after first download
                </p>
              </motion.div>
            )}

            {/* Text input */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) analyze();
                }}
                placeholder="Type any text here… (e.g. 'This machine learning project is incredible!')"
                rows={4}
                disabled={isLoading}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 resize-none outline-none transition-all text-[15px] leading-relaxed disabled:opacity-60"
              />
              <span className="absolute bottom-3 right-4 text-xs text-gray-600 font-mono">
                {text.length}/512
              </span>
            </div>

            {/* Example pills */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => analyze(ex)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-40"
                  >
                    {ex.length > 38 ? ex.slice(0, 38) + "…" : ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => analyze()}
                disabled={isLoading || !text.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-primary text-black font-bold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    {status === "loading-model" ? "Loading model…" : "Analyzing…"}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Analyze Sentiment
                  </>
                )}
              </button>
              {(results || errorMsg) && (
                <button
                  onClick={reset}
                  className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>

            {/* Error */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  {/* Top prediction banner */}
                  {topResult && (
                    <div
                      className={`flex items-center gap-3 p-4 rounded-2xl border ${
                        LABEL_CONFIG[topResult.label]?.bg ?? "bg-white/5"
                      } ${LABEL_CONFIG[topResult.label]?.border ?? "border-white/10"}`}
                    >
                      <span className="text-3xl">{LABEL_CONFIG[topResult.label]?.emoji ?? "🤖"}</span>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Prediction</p>
                        <p className={`text-xl font-black ${LABEL_CONFIG[topResult.label]?.color ?? "text-white"}`}>
                          {topResult.label}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-xs text-gray-500">Confidence</p>
                        <p className="text-2xl font-black text-white">
                          {(topResult.score * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Score bars */}
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={10} className="text-primary" />
                      All scores
                    </p>
                    {results.map((pred) => {
                      const cfg = LABEL_CONFIG[pred.label];
                      return (
                        <div key={pred.label} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className={`font-bold ${cfg?.color ?? "text-white"}`}>{pred.label}</span>
                            <span className="text-gray-400 font-mono text-xs">
                              {(pred.score * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.score * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                pred.label === "POSITIVE"
                                  ? "bg-gradient-to-r from-primary to-accent"
                                  : "bg-gradient-to-r from-red-500 to-orange-400"
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

        {/* Footer note */}
        <motion.p
          className="text-center text-gray-600 text-xs mt-6 font-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          100% client-side · Powered by{" "}
          <a
            href="https://github.com/huggingface/transformers.js"
            target="_blank"
            rel="noreferrer"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            Transformers.js
          </a>{" "}
          + WebAssembly · Model:{" "}
          <a
            href="https://huggingface.co/Xenova/distilbert-base-uncased-finetuned-sst-2-english"
            target="_blank"
            rel="noreferrer"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            distilbert-sst2 (ONNX)
          </a>
        </motion.p>
      </div>
    </section>
  );
}
