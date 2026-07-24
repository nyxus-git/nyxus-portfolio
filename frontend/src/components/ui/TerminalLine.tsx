"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalLineProps {
  /** Lines to type out in sequence */
  lines?: string[];
  /** Delay before typing starts (ms) */
  startDelay?: number;
  /** Typing speed (ms per character) */
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

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Start delay
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  // Typewriter effect
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
      // Move to next line after brief pause
      timeoutRef.current = setTimeout(() => {
        setCurrentLineIndex((i) => i + 1);
        setCurrentCharIndex(0);
      }, 400);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [started, currentLineIndex, currentCharIndex, lines, speed]);

  const isTypingDone = currentLineIndex >= lines.length - 1 && currentCharIndex >= lines[lines.length - 1]?.length;

  return (
    <div
      className={`font-mono text-sm md:text-base text-left inline-flex flex-col gap-1 ${className}`}
      aria-label="Terminal output"
    >
      {lines.map((_, lineIdx) => {
        const text = displayedLines[lineIdx] ?? "";
        const isCurrentLine = lineIdx === currentLineIndex;
        const isFirstLine = lineIdx === 0;

        if (!text && !isCurrentLine) return null;

        return (
          <div key={lineIdx} className="flex items-center gap-0">
            <span
              className={
                isFirstLine
                  ? "text-primary/80"
                  : "text-cyan-400/90"
              }
            >
              {text}
            </span>
            {/* Blinking cursor only on the active line being typed, or at end */}
            {((isCurrentLine && !isTypingDone) || (isTypingDone && lineIdx === lines.length - 1)) && (
              <span
                className={`ml-0.5 inline-block w-[2px] h-[1em] align-middle transition-opacity duration-100 ${
                  showCursor ? "opacity-100" : "opacity-0"
                } ${isFirstLine ? "bg-primary" : "bg-cyan-400"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
