"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalLineProps {
  lines?: string[];
  startDelay?: number;
  speed?: number;
  className?: string;
}

export function TerminalLine({
  lines = [
    "$ whoami",
    "> AI Engineer  |  ML Researcher  |  Open Source Contributor",
  ],
  startDelay = 1800,
  speed = 38,
  className = "",
}: TerminalLineProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [started, setStarted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLineIndex] = (updated[currentLineIndex] ?? "") + currentLine[currentCharIndex];
          return updated;
        });
        setCurrentCharIndex((i) => i + 1);
      }, speed);
    } else if (currentLineIndex < lines.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentLineIndex((i) => i + 1);
        setCurrentCharIndex(0);
      }, 400);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [started, currentLineIndex, currentCharIndex, lines, speed]);

  const isTypingDone =
    currentLineIndex >= lines.length - 1 &&
    currentCharIndex >= (lines[lines.length - 1]?.length ?? 0);

  return (
    <div
      className={`font-mono text-xs sm:text-sm text-left inline-flex flex-col gap-1 px-4 py-2.5 rounded-2xl bg-[#0b0a16]/75 border border-primary/20 backdrop-blur-md shadow-inner ${className}`}
      aria-label="Terminal output"
    >
      {lines.map((_, lineIdx) => {
        const text = displayedLines[lineIdx] ?? "";
        const isCurrentLine = lineIdx === currentLineIndex;
        const isFirstLine = lineIdx === 0;

        if (!text && !isCurrentLine) return null;

        return (
          <div key={lineIdx} className="flex items-center gap-0">
            <span className={isFirstLine ? "text-primary/90" : "text-accent/95"}>
              {text}
            </span>
            {((isCurrentLine && !isTypingDone) || (isTypingDone && lineIdx === lines.length - 1)) && (
              <span
                className={`ml-0.5 inline-block w-[2px] h-[1em] align-middle transition-opacity duration-100 ${
                  showCursor ? "opacity-100" : "opacity-0"
                } ${isFirstLine ? "bg-primary" : "bg-accent"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
