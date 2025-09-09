"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getCertifications } from "@/lib/contentfulApi";

interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string[];
}

export function Certification() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        const fetchedCerts = await getCertifications();
        setCertifications(fetchedCerts);
      } catch (err) {
        console.error("Failed to fetch certifications:", err);
        setError("Failed to load certifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCertifications();
  }, []);

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

        {loading && (
          <div className="text-center text-gray-400">Loading certifications...</div>
        )}
        {error && (
          <div className="text-center text-red-400">{error}</div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex flex-col"
              >
                <h3 className="text-xl font-semibold text-lime-400 mb-2">{cert.name}</h3>
                <p className="text-gray-300 mb-1">{cert.issuingOrganization}</p>
                <p className="text-sm text-gray-400 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M11 12h.01M15 12h.01M17 12h.01M17 16h.01M11 16h.01M15 16h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {cert.issueDate}
                </p>
                {cert.credentialId && (
                  <p className="text-sm text-gray-400 mb-4">Credential ID: {cert.credentialId}</p>
                )}
                {/* Re-add the rendering of skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills && cert.skills.map((skill, skillIndex) => (
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
        )}
      </div>
    </section>
  );
}
