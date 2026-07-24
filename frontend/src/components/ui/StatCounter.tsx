"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number; // ms
}

function useCountUp(target: number, duration: number, triggered: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let startTime: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startValue + (target - startValue) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, triggered]);

  return count;
}

function SingleStat({ target, suffix = "+", prefix = "", label, duration = 1800 }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(target, duration, triggered);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 group">
      <div className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
        {prefix}{count}{suffix}
      </div>
      <div className="text-xs md:text-sm text-gray-400 font-medium text-center uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

interface StatCounterRowProps {
  stats?: StatCounterProps[];
}

const DEFAULT_STATS: StatCounterProps[] = [
  { target: 3, suffix: "+", label: "Years in AI/ML", duration: 1200 },
  { target: 15, suffix: "+", label: "Projects Built", duration: 1400 },
  { target: 5, suffix: "K+", label: "GitHub Contributions", duration: 1800 },
  { target: 100, suffix: "K+", label: "Samples Trained", duration: 2000 },
];

export function StatCounterRow({ stats = DEFAULT_STATS }: StatCounterRowProps) {
  return (
    <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
      {stats.map((s, i) => (
        <SingleStat key={i} {...s} />
      ))}
    </div>
  );
}
