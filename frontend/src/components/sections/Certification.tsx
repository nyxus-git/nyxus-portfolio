"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getCertifications, type Certification } from "../../lib/api";
import { Badge } from "@/components/ui/badge";

export function Certification() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertifications().then((data) => {
      setCertifications(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-20 px-4 relative overflow-hidden">
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
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass glass-hover p-6 rounded-xl border border-white/5 text-white flex flex-col relative group"
            >
              <h3 className="text-xl font-bold text-lime-400 mb-2">{cert.name}</h3>
              <p className="text-gray-300 font-medium mb-1">{cert.issuing_organization}</p>
              <p className="text-sm text-gray-500 mb-6 font-mono">
                {new Date(cert.issue_date).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
              </p>

              {cert.credential_id && (
                <p className="text-xs text-gray-500 mb-4 font-mono break-all">ID: {cert.credential_id}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                {cert.skills?.map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-lime-500/30 text-lime-200">
                    {skill}
                  </Badge>
                ))}
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full text-center py-2 rounded-lg bg-white/5 hover:bg-lime-500/20 text-lime-400 hover:text-lime-300 transition-colors text-sm font-bold uppercase tracking-wider border border-white/5 hover:border-lime-500/50"
                >
                  View Credential
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
