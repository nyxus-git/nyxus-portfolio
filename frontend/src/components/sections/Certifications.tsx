// frontend/src/components/sections/Certifications.tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CalendarDays } from 'lucide-react';

export function Certifications() {
  const linkedInProfileUrl = "https://www.linkedin.com/in/nyxus-link/";

  const certifications = [
    {
      id: 1,
      title: "Python From Zero To Expert",
      issuer: "Udemy",
      issuedDate: "Feb 2025",
      credentialId: "UC-2928ee02-0617-4a0d-8361-79acc7ac8581",
      liveLink: "https://www.udemy.com/certificate/UC-2928ee02-0617-4a0d-8361-79acc7ac8581/",
      skills: ["Matplotlib", "NumPy", "Pandas", "SciPy", "Python (Programming Language)"],
      icon: (
        <svg className="w-8 h-8 text-lime-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.8c.883 0 1.6.717 1.6 1.6 0 .883-.717 1.6-1.6 1.6-.883 0-1.6-.717-1.6-1.6 0-.883.717-1.6 1.6-1.6zm-1.6 14.4V9.8h3.2v8.4H10.4zm-4-8.4h3.2V18h-3.2V9.8zm11.2 0h-3.2V18h3.2V9.8z"></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: "SSOC Season 2",
      issuer: "Social (Formerly Script Foundation)",
      issuedDate: "May 2023",
      credentialId: "68501f78-cfca-4da5-ae9b-4e7b2d8bc3ac",
      liveLink: "https://certificate.givemycertificate.com/c/68501f78-cfca-4da5-ae9b-4e7b2d8bc3ac",
      skills: ["GitHub", "TypeScript"],
      icon: (
        <svg className="w-8 h-8 text-lime-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-4H7v4H5v-6h6v6zM17 16h-4v-6h2v4h2v2z"></path>
        </svg>
      ),
    },
    {
      id: 3,
      title: "Full Stack Web Development",
      issuer: "Udemy",
      issuedDate: "Jan 2024",
      credentialId: "UC-766e7099-f491-4e3d-9f60-8ba7a7c1c135",
      liveLink: "https://www.udemy.com/certificate/UC-766e7099-f491-4e3d-9f60-8ba7a7c1c135/",
      skills: ["HTML5", "Express.js", "CSS 3", "Svelte", "Javascript", "Node.js", "React.js", "Vite.js", "MongoDB"],
      icon: (
        <svg className="w-8 h-8 text-lime-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.8c.883 0 1.6.717 1.6 1.6 0 .883-.717 1.6-1.6 1.6-.883 0-1.6-.717-1.6-1.6 0-.883.717-1.6 1.6-1.6zm-1.6 14.4V9.8h3.2v8.4H10.4zm-4-8.4h3.2V18h-3.2V9.8zm11.2 0h-3.2V18h3.2V9.8z"></path>
        </svg>
      ),
    },
    {
        id: 4,
        title: "Another Future Certification",
        issuer: "Upcoming Platform",
        issuedDate: "Future",
        credentialId: "N/A",
        liveLink: null,
        skills: ["Machine Learning", "Deep Learning"],
        icon: (
            <svg className="w-8 h-8 text-lime-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9l11 6 11-6-11-6zm0 10.9L3.5 9.7l8-4.3 8 4.3L12 13.9zm0 2.1L3.5 10.7v5.3l8.5 4.5 8.5-4.5v-5.3L12 16zm-7-2.3v-5.3l7 3.7v5.3l-7-3.7z"></path>
            </svg>
          ),
    }
  ];

  return (
    <section id="certifications" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Licenses & Certifications
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex items-start"
            >
              <div className="flex-shrink-0 mr-4 mt-1">
                {cert.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-white mb-1">{cert.title}</h3>
                <p className="text-gray-300 mb-1">{cert.issuer}</p>
                <p className="text-sm text-gray-400 flex items-center mb-2">
                  <CalendarDays className="w-4 h-4 mr-1 inline" />
                  Issued {cert.issuedDate}
                </p>
                {/* FIX: Corrected conditional rendering syntax */}
                {cert.credentialId && (
                    <p className="text-sm text-gray-400 mb-4">Credential ID: {cert.credentialId}</p>
                )}

                <div className="mt-auto">
                    <Link
                        href={cert.liveLink || linkedInProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300
                                    ${cert.liveLink
                                        ? "bg-lime-600/30 text-lime-300 border border-lime-500/50 hover:bg-lime-600/50"
                                        : "bg-gray-700/50 text-gray-400 border border-gray-600/50 cursor-not-allowed"
                                    }`}
                        aria-disabled={!cert.liveLink}
                        tabIndex={cert.liveLink ? 0 : -1}
                    >
                        {cert.liveLink ? "Show Credential" : "View on LinkedIn"}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </Link>
                </div>

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 text-sm">
                    <span className="text-gray-400 font-semibold mr-1">Skills:</span>
                    {cert.skills.map((skill, i) => (
                      <Badge
                        key={i}
                        className="bg-lime-600/30 text-lime-300 border border-lime-500/50 hover:bg-lime-600/50"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}