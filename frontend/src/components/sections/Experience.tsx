// frontend/src/components/sections/Experience.tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function Experience() {
  const experiences = [
    {
      id: 1,
      title: "Research and Development Intern",
      company: "DIAT-DRDO",
      location: "Pune, Maharashtra",
      duration: "Feb 2024 - Jul 2024",
      description: "Conducted cutting-edge research on boot-level secure hash computation using TPM technology, contributing to advanced cybersecurity solutions.",
      achievements: [
        "Conducted research on boot-level secure hash computation using TPM",
        "Developed a custom bootloader in assembly to enhance system security",
        "Published findings in an IEEE conference paper",
        "Strengthened expertise in hardware-level security and low-level programming",
      ],
      techStack: ["Assembly", "TPM", "Linux", "Hardware Security", "Low-level Programming"],
    },
    {
      id: 2,
      title: "Internship Trainee",
      company: "Kasnet Technologies",
      location: "Pune, Maharashtra",
      duration: "Aug 2021 - Sep 2021",
      description: "Developed comprehensive attendance management solutions using modern web technologies and gained valuable experience in full-cycle project development.",
      achievements: [
        "Developed an Attendance Management System using JavaScript and Python",
        "Gained hands-on experience in full-cycle project development",
        "Improved teamwork and communication skills",
        "Successfully delivered production-ready software solution",
      ],
      techStack: ["JavaScript", "Python", "Web Development", "Database Management"],
    },
  ];

  return (
    <section id="experience" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"> {/* Consistent background */}
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Work Experience
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <div className="relative pl-8 md:pl-20">
          <div className="absolute left-4 md:left-10 top-0 bottom-0 w-0.5 bg-gray-700"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="mb-12 last:mb-0 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute left-0 md:left-6 -top-1 w-4 h-4 bg-lime-400 rounded-full border-2 border-gray-900 z-10"></div>

              <div className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white ml-8 md:ml-12">
                <h3 className="text-2xl font-semibold text-lime-400 mb-1">{exp.title}</h3>
                <p className="text-xl text-gray-200 mb-2">{exp.company}</p>
                <p className="text-sm text-gray-400 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {exp.location}
                  <span className="ml-4 flex items-center">
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M11 12h.01M15 12h.01M17 12h.01M17 16h.01M11 16h.01M15 16h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {exp.duration}
                  </span>
                </p>
                <p className="mb-4 text-gray-300">{exp.description}</p>

                <h4 className="text-lg font-semibold text-lime-400 mb-2">KEY ACHIEVEMENTS:</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-300">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.techStack.map((tech, i) => (
                    <Badge
                      key={i}
                      className="bg-lime-600/30 text-lime-300 border border-lime-500/50 hover:bg-lime-600/50"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}