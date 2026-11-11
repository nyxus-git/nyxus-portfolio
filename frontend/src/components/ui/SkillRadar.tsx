"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const RADAR_DATA = [
  { subject: "Machine Learning", score: 88 },
  { subject: "Deep Learning", score: 78 },
  { subject: "Data Engineering", score: 80 },
  { subject: "MLOps", score: 70 },
  { subject: "Backend Dev", score: 85 },
  { subject: "Frontend Dev", score: 78 },
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { subject: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b0a16]/95 backdrop-blur-xl border border-primary/30 rounded-xl px-4 py-2 text-sm shadow-xl">
        <p className="text-white font-semibold">{payload[0].payload.subject}</p>
        <p className="text-primary font-bold font-mono">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function SkillRadar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={visible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center h-full justify-between"
    >
      <div className="text-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-primary">
          Neural Profile
        </span>
        <h3 className="text-base font-bold text-white mt-1">
          Competency Radar
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid
            gridType="polygon"
            stroke="rgba(168,85,247,0.16)"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 500 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Proficiency"
            dataKey="score"
            stroke="rgba(168,85,247,0.9)"
            strokeWidth={2}
            fill="rgba(168,85,247,0.18)"
            dot={{
              fill: "rgba(192,132,252,1)",
              r: 4,
              strokeWidth: 0,
            }}
            activeDot={{
              fill: "rgba(236,72,153,1)",
              r: 5,
              strokeWidth: 0,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 w-full pt-3 border-t border-white/[0.06]">
        {RADAR_DATA.map((d) => (
          <div key={d.subject} className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: d.score >= 85 ? "rgba(168,85,247,1)" : "rgba(236,72,153,0.85)",
              }}
            />
            <span className="truncate">
              {d.subject.split(" ")[0]}:{" "}
              <span className="text-white font-semibold font-mono">{d.score}%</span>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
