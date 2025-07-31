// frontend/src/components/sections/Skills.tsx
"use client";

import { motion } from "framer-motion";
import { Gauge, Code, Package } from 'lucide-react'; // Icons for categories

export function Skills() {
  const skillCategories = [
    {
      id: 1,
      name: "PROGRAMMING LANGUAGES",
      icon: Code,
      skills: [
        { name: "Python", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "Bash", level: 75 },
        { name: "HTML5", level: 95 },
        { name: "CSS3", level: 90 },
        { name: "Assembly", level: 70 },
        { name: "Linux", level: 80 }, // Assuming Linux as a skill within languages/OS context
      ],
    },
    {
      id: 2,
      name: "FRAMEWORKS & LIBRARIES",
      icon: Package,
      skills: [
        { name: "React.js", level: 80 },
        { name: "Vite.js", level: 75 },
        { name: "Svelte", level: 70 },
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 80 },
        { name: "Flask", level: 70 },
        { name: "Django", level: 65 },
      ],
    },
    {
      id: 3,
      name: "TOOLS & TECHNOLOGIES",
      icon: Gauge, // Using Gauge for tools/technologies
      skills: [
        { name: "Git", level: 90 },
        { name: "GitHub", level: 90 },
        { name: "Linux (Arch)", level: 85 },
        { name: "Bash scripting", level: 80 },
        { name: "NumPy", level: 88 },
        { name: "Pandas", level: 87 },
        { name: "Matplotlib", level: 85 },
        { name: "MongoDB", level: 75 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Skills
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-lime-600/30 rounded-full flex items-center justify-center mb-4 border border-lime-500/50">
                <category.icon className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-xl font-bold mb-6 text-lime-400 uppercase">{category.name}</h3>
              <div className="w-full space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex flex-col items-start w-full">
                    <span className="text-gray-200 text-lg mb-1">{skill.name}</span>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <motion.div
                        className="bg-lime-400 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 1, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}