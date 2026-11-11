"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Gauge, Code, Package, Terminal, Cloud, Cpu } from "lucide-react";
import { getSkills, type Skill } from "../../lib/api";
import { SkillRadar } from "@/components/ui/SkillRadar";
import { SectionHeader } from "@/components/ui/SectionHeader";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "PROGRAMMING LANGUAGES": Code,
  "FRAMEWORKS & LIBRARIES": Package,
  "TOOLS & TECHNOLOGIES": Terminal,
  "CLOUD & MLOPS": Cloud,
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
    <section id="skills" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-primary/10 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="03"
          badge="Capabilities"
          icon={Cpu}
          title="Technical Arsenal"
          subtitle="Core languages, deep learning frameworks, and cloud-native infrastructure."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Radar Chart Column */}
          <div className="lg:col-span-4">
            <SkillRadar />
          </div>

          {/* Skill Category Bento Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryList.map(([name, skillList], catIndex) => {
              const Icon = CATEGORY_ICONS[name.toUpperCase()] || Gauge;

              return (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.08 }}
                  className="glass-card glass-card-hover p-6 md:p-7 rounded-3xl flex flex-col"
                >
                  <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl border border-primary/25 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        {name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-gray-500">
                      {skillList.length} tools
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {skillList.map((skill, skillIndex) => (
                      <motion.div
                        key={skillIndex}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="group relative px-3.5 py-2 bg-white/[0.035] hover:bg-primary/15 border border-white/[0.08] hover:border-primary/50 hover:shadow-[0_0_18px_rgba(168,85,247,0.22)] rounded-xl transition-all cursor-default overflow-hidden"
                      >
                        <div
                          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                        <div className="relative z-10 flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500 group-hover:text-primary transition-colors">
                            {skill.level}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
