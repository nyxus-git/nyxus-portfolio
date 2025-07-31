// frontend/src/components/sections/Certifications.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  issuedDate: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  pdfUrl?: string;
}

const dummyCertifications: Certification[] = [
  {
    id: 1,
    title: "Python From Zero To Expert",
    issuer: "Udemy",
    issuedDate: "Issued Feb 2025",
    credentialId: "UC-2832ee02-0917-4d30-83f0-79acc7ac8531",
    credentialUrl: "https://www.udemy.com/certificate/abcdef12345/",
    skills: ["Matplotlib", "Numpy", "Pandas", "Scipy", "Python (Programming Language)"],
  },
  {
    id: 2,
    title: "SSOC Season 2",
    issuer: "Social (Formerly Script Foundation)",
    issuedDate: "Issued May 2023",
    credentialId: "68501f78-cfca-4da5-ae9d-4e7b2d8bc3ac",
    credentialUrl: "https://verify.socialgoc.org/certificate/12345678",
    skills: ["GitHub", "TypeScript"],
  },
  {
    id: 3,
    title: "Full Stack Web Development",
    issuer: "Udemy",
    issuedDate: "Issued Jan 2024",
    credentialId: "UC-76be7009-1d31-4d3d-9f50-8ba1f7c1d35",
    credentialUrl: "https://www.udemy.com/certificate/789012345/",
    skills: ["HTML5", "Express.js", "CSS 3", "Svelte", "Javascript", "Node.js", "React.js", "Vite.js", "MongoDB"],
  },
];

export function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCertifications(dummyCertifications);
      } catch (err: unknown) {
        console.error("Error fetching certifications:", err);
        setError("Failed to load certifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []); // Added empty dependency array for useEffect

  return (
    <section id="certifications" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Licenses & Certifications
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl mb-12 text-center text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          My professional development journey.
        </motion.p>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-8 h-8 text-lime-400" />
            <span className="sr-only text-white">Loading certifications...</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64 bg-red-800/50 backdrop-filter backdrop-blur-lg p-4 rounded-lg border border-red-700/50 text-red-300">
            <p className="text-xl text-center">{error}</p>
          </div>
        )}

        {!loading && !error && certifications.length === 0 && (
          <div className="text-center py-10 text-gray-300">
            <p className="text-lg">No certifications available yet. Check back soon!</p>
          </div>
        )}

        {!loading && !error && certifications.length > 0 && (
          <div className="grid grid-cols-1 gap-8">
            {certifications.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,255,102,0.15)" }}
              >
                <Card className="flex flex-col md:flex-row items-start p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300
                                bg-gray-800/60 backdrop-filter backdrop-blur-lg border border-gray-700/50
                                text-white rounded-xl">
                  <div className="flex-shrink-0 mr-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-lime-600/30 border border-lime-500/50">
                      <span className="text-lime-400 text-2xl">🎓</span>
                    </div>
                  </div>

                  <CardContent className="flex-grow p-0">
                    <CardTitle className="text-xl font-semibold text-lime-400 mb-1">{cert.title}</CardTitle>
                    <p className="text-gray-300 text-base mb-2">{cert.issuer}</p>
                    <p className="text-gray-400 text-sm mb-4">{cert.issuedDate}</p>

                    {/* FIXED LINE: Removed extra parentheses around cert.credentialId */}
                    {cert.credentialId && (
                      <p className="text-sm text-gray-400 mb-4">
                        Credential ID: <span className="text-gray-300 font-medium">{cert.credentialId}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {cert.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-lime-600/30 text-lime-300 border border-lime-500/50 hover:bg-lime-600/50 text-xs px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium mt-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Show Credential
                      </a>
                    )}
                    {cert.pdfUrl && (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 transition-colors duration-200 font-medium mt-2 ml-4"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Download PDF
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}