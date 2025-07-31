"use client";

import { motion } from "framer-motion";
// Assuming you have a CertificationCard component or similar, if not,
// the direct rendering is handled below.

export function Certifications() {
  const certifications = [
    {
      id: 1,
      title: "Python From Zero To Expert",
      issuer: "Udemy",
      issuedDate: "Feb 2025",
      credentialId: "UC-2933ee02-0917-4a3d-930f-79aacc7ac831", // Example ID
      credentialUrl: "https://www.udemy.com/certificate/UC-2933ee02-0917-4a3d-930f-79aacc7ac831/",
      skills: ["Machine Learning", "NumPy", "Pandas", "SciPy", "Python (Programming Language)"],
    },
    {
      id: 2,
      title: "SSOC Season 2",
      issuer: "Social (Formerly Script Foundation)",
      issuedDate: "May 2023",
      credentialId: "G850W7B-cfca-4da5-ae9d-4e7b2d8d3bac", // Example ID
      credentialUrl: "https://www.social.com/certificate/G850W7B-cfca-4da5-ae9d-4e7b2d8d3bac/",
      skills: ["HTML5", "GitHub", "TypeScript"],
    },
    {
      id: 3,
      title: "Full Stack Web Development",
      issuer: "Udemy",
      issuedDate: "Jan 2024",
      credentialId: "UC-76e7f009-4d31-4a3d-9f5d-8ba87a7c7c35", // Example ID
      credentialUrl: "https://www.udemy.com/certificate/UC-76e7f009-4d31-4a3d-9f5d-8ba87a7c7c35/",
      skills: ["HTML5", "Express.js", "CSS3", "Svelte", "JavaScript", "Node.js", "React.js", "Vite.js", "MongoDB"],
    },
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
          My Certifications
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex flex-col"
            >
              <h3 className="text-xl font-semibold text-lime-400 mb-2">{cert.title}</h3>
              <p className="text-gray-300 mb-1">{cert.issuer}</p>
              <p className="text-sm text-gray-400 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M11 12h.01M15 12h.01M17 12h.01M17 16h.01M11 16h.01M15 16h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {cert.issuedDate}
              </p>

              {/* Corrected syntax for displaying credential ID */}
              {cert.credentialId && (
                <p className="text-sm text-gray-400 mb-4">Credential ID: {cert.credentialId}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {cert.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="bg-lime-600/30 text-lime-300 px-3 py-1 rounded-full text-xs font-medium border border-lime-500/50">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-lime-400 hover:text-lime-300 transition-colors font-medium"
                >
                  Show Credential
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0l-7 7m7-7V9"></path></svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}