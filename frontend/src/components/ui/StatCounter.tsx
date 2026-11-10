"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number; // ms
  formatValue?: (count: number) => string;
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

function formatMonthsAsYearMonth(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) {
    return `${months} ${months === 1 ? "Month" : "Months"}`;
  }
  const yearPart = `${years} ${years === 1 ? "Year" : "Years"}`;
  if (months === 0) {
    return yearPart;
  }
  return `${yearPart} ${months} ${months === 1 ? "Month" : "Months"}`;
}

function SingleStat({
  target,
  suffix = "+",
  prefix = "",
  label,
  duration = 1800,
  formatValue,
}: StatCounterProps) {
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
  const displayValue = formatValue ? formatValue(count) : `${prefix}${count}${suffix}`;

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 group">
      <div
        className={`min-h-[2.5rem] flex items-center justify-center text-center font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent ${
          formatValue
            ? "text-xl sm:text-2xl xl:text-[1.7rem] leading-tight"
            : "text-3xl md:text-4xl"
        }`}
      >
        {displayValue}
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
  {
    target: 17,
    suffix: "",
    label: "Total Experience",
    duration: 1200,
    formatValue: formatMonthsAsYearMonth,
  },
  { target: 6, suffix: "+", label: "Projects Built", duration: 1400 },
  { target: 1000, suffix: "+", label: "GitHub Contributions", duration: 1800 },
];

export function StatCounterRow({ stats = DEFAULT_STATS }: StatCounterRowProps) {
  return (
    <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {stats.map((s, i) => (
        <SingleStat key={i} {...s} />
      ))}
    </div>
  );
}
