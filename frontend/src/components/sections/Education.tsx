"use client";

import { motion } from "framer-motion";
import { CalendarDays, GraduationCap } from 'lucide-react';

export function Education() {
  const educationEntries = [
    {
      id: 1,
      degree: "Bachelor of Engineering - BE, Artificial Intelligence & Machine Learning",
      university: "Savitribai Phule Pune University",
      duration: "Nov 2022 - Jun 2025",
    },
    {
      id: 2,
      degree: "Diploma, Information Technology",
      university: "Shivnagar Vidya Prasarak Mandal's College Of Engineering",
      duration: "Jul 2019 - Oct 2022",
    },
  ];

  return (
    <section id="education" className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Education
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {educationEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card glass-card-hover p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{entry.degree}</h3>
                <p className="text-gray-400 font-medium">{entry.university}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs font-mono text-gray-400 px-4 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {entry.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}