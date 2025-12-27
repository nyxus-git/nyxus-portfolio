"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getCertifications, Certification as CertificationType } from "../../lib/contentfulApi";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function Certification() {
  const [certifications, setCertifications] = useState<CertificationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getCertifications();
      setCertifications(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null;

  return (
    <section id="certifications" className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-black mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          My Certifications
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass glass-hover p-6 rounded-xl border border-white/5 text-white flex flex-col relative group"
            >
              {cert.certificateImage && (
                <div className="absolute top-4 right-4 w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="relative w-full h-full rounded-full overflow-hidden border border-lime-500/30">
                    <Image src={cert.certificateImage} alt="Logo" fill className="object-cover" />
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold text-lime-400 mb-2 pr-12">{cert.name}</h3>
              <p className="text-gray-300 font-medium mb-1">{cert.issuingOrganization}</p>
              <p className="text-sm text-gray-500 mb-6 font-mono">
                {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
              </p>

              {cert.credentialId && (
                <p className="text-xs text-gray-500 mb-4 font-mono break-all">ID: {cert.credentialId}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                {cert.skills?.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="outline" className="text-xs border-lime-500/30 text-lime-200">
                    {skill}
                  </Badge>
                ))}
              </div>

              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full text-center py-2 rounded-lg bg-white/5 hover:bg-lime-500/20 text-lime-400 hover:text-lime-300 transition-colors text-sm font-bold uppercase tracking-wider border border-white/5 hover:border-lime-500/50"
              >
                View Credential
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

