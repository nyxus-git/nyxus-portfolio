"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getExperiences, Experience as ExperienceType } from "../../lib/api";

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
    <section id="experience" className="py-20 px-4 relative bg-gray-950">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 via-gray-950 to-black -z-20"></div>

      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-black mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work Experience
        </motion.h2>

        <div className="relative pl-8 md:pl-20">
          <div className="absolute left-4 md:left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-lime-500/50 to-transparent"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="mb-12 last:mb-0 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute left-0 md:left-6 -top-1 w-4 h-4 bg-lime-400 rounded-full border-4 border-gray-900 z-10 shadow-[0_0_15px_rgba(132,204,22,0.6)]"></div>

              <div className="glass glass-hover p-8 rounded-2xl ml-8 md:ml-12 border-l-4 border-l-lime-500/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{exp.job_title}</h3>
                    <p className="text-xl text-lime-400 font-medium">{exp.company_name}</p>
                    {exp.location && <p className="text-sm text-gray-500 mt-1">{exp.location}</p>}
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="text-sm font-mono text-gray-400 px-3 py-1 bg-white/5 rounded-full inline-block">
                      {new Date(exp.start_date).getFullYear()} — {exp.end_date ? new Date(exp.end_date).getFullYear() : "Present"}
                    </p>
                  </div>
                </div>

                {exp.description && (
                  <p className="text-gray-300 leading-relaxed text-sm">{exp.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}