"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getExperiences, type Experience as ExperienceType } from "../../lib/api";

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiences().then((data) => {
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Experience
          </h2>
        </motion.div>

        <div className="relative">
          {/* Glowing Timeline Line */}
          <div className="absolute left-4 md:left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent md:-translate-x-1/2"></div>

          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={exp.id}
                className={`mb-12 relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] -translate-x-1/2 mt-6 z-10 hidden md:block">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
                </div>

                <div className="w-full md:w-1/2 px-4 md:px-12 flex flex-col mt-2">
                  <div className={`glass-card p-8 rounded-3xl relative group ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-colors rounded-3xl" />
                    
                    <div className="relative z-10">
                      <div className={`flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'} mb-4`}>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{exp.job_title}</h3>
                        <p className="text-lg text-gray-400 font-medium">{exp.company_name}</p>
                        
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className="text-xs font-mono text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            {new Date(exp.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — {exp.end_date ? new Date(exp.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "Present"}
                          </span>
                          {exp.location && (
                            <span className="text-xs text-gray-500 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-gray-400 leading-relaxed text-sm text-left">{exp.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}