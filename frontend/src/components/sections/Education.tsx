// frontend/src/components/sections/Education.tsx
"use client";

import { motion } from "framer-motion";
import { CalendarDays } from 'lucide-react';

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
    <section id="education" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"> {/* Consistent background */}
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Education
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 gap-8">
          {educationEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex items-start"
            >
              <div className="flex-shrink-0 mr-4 mt-1">
                <svg className="w-8 h-8 text-lime-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L1 9l11 6 11-6-11-6zm0 10.9L3.5 9.7l8-4.3 8 4.3L12 13.9zm0 2.1L3.5 10.7v5.3l8.5 4.5 8.5-4.5v-5.3L12 16zm-7-2.3v-5.3l7 3.7v5.3l-7-3.7z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{entry.degree}</h3>
                <p className="text-gray-300 mb-2">{entry.university}</p>
                <p className="text-sm text-gray-400 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1 inline" />
                  {entry.duration}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}