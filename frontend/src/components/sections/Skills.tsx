"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Gauge, Code, Package, Terminal } from "lucide-react";
import { getSkills, type Skill } from "../../lib/api";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "PROGRAMMING LANGUAGES": Code,
  "FRAMEWORKS & LIBRARIES": Package,
  "TOOLS & TECHNOLOGIES": Terminal,
};

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills().then((data) => {
      setSkills(data);
      setLoading(false);
    });
  }, []);

  const categories = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryList = Object.entries(categories);

  if (loading || categoryList.length === 0) return null;

  return (
    <section id="skills" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
            Technical Arsenal
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categoryList.map(([name, skillList], catIndex) => {
            const Icon = CATEGORY_ICONS[name.toUpperCase()] || Gauge;
            
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: catIndex * 0.1 }}
                className="glass-card p-8 rounded-3xl flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{name}</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {skillList.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative px-4 py-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 rounded-xl transition-all cursor-default overflow-hidden"
                    >
                      <div className="absolute bottom-0 left-0 h-[2px] bg-primary/50 transition-all duration-500" style={{ width: `${skill.level}%` }} />
                      <span className="relative z-10 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}