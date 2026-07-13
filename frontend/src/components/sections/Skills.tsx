"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Gauge, Code, Package } from "lucide-react";
import { getSkills, Skill } from "../../lib/api";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "PROGRAMMING LANGUAGES": Code,
  "FRAMEWORKS & LIBRARIES": Package,
  "TOOLS & TECHNOLOGIES": Gauge,
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

  // Group by category
  const categories = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryList = Object.entries(categories);

  // Fallback static data while loading or if no API data
  const staticCategories = [
    {
      name: "PROGRAMMING LANGUAGES",
      icon: Code,
      skills: [
        { name: "Python", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "TypeScript", level: 78 },
        { name: "HTML5 & CSS3", level: 95 },
        { name: "Bash / Shell", level: 80 },
        { name: "SQL", level: 75 },
      ],
    },
    {
      name: "FRAMEWORKS & LIBRARIES",
      icon: Package,
      skills: [
        { name: "TensorFlow / Keras", level: 85 },
        { name: "scikit-learn", level: 90 },
        { name: "React.js / Next.js", level: 82 },
        { name: "FastAPI / Flask", level: 88 },
        { name: "Pandas / NumPy", level: 92 },
        { name: "OpenCV", level: 80 },
      ],
    },
    {
      name: "TOOLS & TECHNOLOGIES",
      icon: Gauge,
      skills: [
        { name: "Git & GitHub", level: 90 },
        { name: "Linux (Arch)", level: 88 },
        { name: "Docker", level: 72 },
        { name: "Jupyter Notebook", level: 95 },
        { name: "Matplotlib / Seaborn", level: 85 },
        { name: "MongoDB / SQLite", level: 78 },
      ],
    },
  ];

  const displayCategories =
    !loading && categoryList.length > 0
      ? categoryList.map(([name, skillList]) => ({
          name,
          icon: CATEGORY_ICONS[name] || Gauge,
          skills: skillList,
        }))
      : staticCategories;

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 overflow-hidden">
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
          {displayCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
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
                    <span className="text-gray-200 text-sm mb-1">{skill.name}</span>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-lime-400 h-2 rounded-full"
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