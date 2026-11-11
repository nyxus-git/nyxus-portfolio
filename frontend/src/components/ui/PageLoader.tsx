"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "Initializing neural architecture...",
  "Mounting vector embeddings...",
  "Synchronizing model endpoints...",
  "System online.",
];

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("portfolio_loaded")) return;
    sessionStorage.setItem("portfolio_loaded", "1");
    setIsLoading(true);

    const lineTimings = [0, 280, 620, 940];
    const lineTimers = lineTimings.map((delay, i) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, BOOT_LINES[i]]);
      }, delay)
    );

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 3;
      });
    }, 38);

    const dismissTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(14px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#04040a] flex items-center justify-center overflow-hidden"
        >
          {/* Architectural grid */}
          <div className="absolute inset-0 bg-grid-white opacity-60" />

          {/* Ambient violet & magenta glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-violet-600/15 rounded-full blur-[130px] animate-pulse-glow pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-[340px] h-[340px] bg-fuchsia-600/12 rounded-full blur-[110px] animate-pulse-glow pointer-events-none" />

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-6 px-8"
          >
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-[11px] font-mono uppercase tracking-[0.22em] text-primary">
              NYXUS // STUDIO
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              <span className="text-white">Rohan </span>
              <span className="text-gradient-accent text-glow-primary">Mane</span>
            </h1>

            <div className="font-mono text-xs md:text-sm text-left w-full max-w-xs space-y-1.5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
              {visibleLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    i === visibleLines.length - 1 && line === "System online."
                      ? "text-primary font-semibold"
                      : "text-gray-400"
                  }
                >
                  <span className="text-accent mr-2">›</span>
                  {line}
                </motion.div>
              ))}
            </div>

            <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-primary to-accent rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
