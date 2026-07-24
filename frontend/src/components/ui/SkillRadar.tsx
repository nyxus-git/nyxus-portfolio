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

// Custom tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { subject: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 backdrop-blur border border-white/10 rounded-xl px-4 py-2 text-sm">
        <p className="text-white font-semibold">{payload[0].payload.subject}</p>
        <p className="text-primary font-bold">{payload[0].value}%</p>
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={visible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-6 rounded-3xl flex flex-col items-center"
    >
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">
        Competency Radar
      </h3>
      <p className="text-xs text-gray-500 mb-4">Proficiency overview</p>

      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid
            gridType="polygon"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 500 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Proficiency"
            dataKey="score"
            stroke="rgba(163,230,53,0.8)"
            strokeWidth={2}
            fill="rgba(163,230,53,0.12)"
            dot={{
              fill: "rgba(163,230,53,1)",
              r: 4,
              strokeWidth: 0,
            }}
            activeDot={{
              fill: "rgba(34,211,238,1)",
              r: 5,
              strokeWidth: 0,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Score legend */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 justify-center">
        {RADAR_DATA.map((d) => (
          <div key={d.subject} className="flex items-center gap-1.5 text-xs text-gray-400">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: d.score >= 85 ? "rgba(163,230,53,1)" : "rgba(34,211,238,0.8)" }}
            />
            <span>{d.subject.split(" ")[0]}: <span className="text-white font-medium">{d.score}%</span></span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
