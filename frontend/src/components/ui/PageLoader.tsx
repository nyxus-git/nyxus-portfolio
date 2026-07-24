"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "Initializing AI systems...",
  "Loading neural networks...",
  "Calibrating models...",
  "Ready.",
];

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false); // start false, flip on mount
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show loader once per browser session
    if (sessionStorage.getItem("portfolio_loaded")) return;
    sessionStorage.setItem("portfolio_loaded", "1");
    setIsLoading(true);

    // Stagger the boot lines
    const lineTimings = [0, 300, 650, 950];
    const lineTimers = lineTimings.map((delay, i) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, BOOT_LINES[i]]);
      }, delay)
    );

    // Animate progress bar 0 → 100 over 1300ms
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 3;
      });
    }, 40);

    // Dismiss after all lines appear
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
          exit={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-gray-950 flex items-center justify-center overflow-hidden"
        >
          {/* Grid texture */}
          <div className="absolute inset-0 bg-grid-white/[0.025]" />

          {/* Ambient glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-6 px-8"
          >
            {/* Name */}
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              <span className="text-white">Rohan </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-glow-primary">
                Mane
              </span>
            </h1>

            {/* Terminal boot lines */}
            <div className="font-mono text-xs md:text-sm text-left w-full max-w-xs space-y-1">
              {visibleLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    i === visibleLines.length - 1 && line === "Ready."
                      ? "text-primary font-semibold"
                      : "text-gray-500"
                  }
                >
                  <span className="text-primary/50 mr-2">›</span>
                  {line}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
