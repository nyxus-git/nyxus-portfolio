"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getCertifications, type Certification } from "../../lib/api";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Certification() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertifications().then((data) => {
      setCertifications(data);
      setLoading(false);
    });
  }, []);

  if (loading || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="10"
          badge="Credentials"
          icon={Award}
          title="Certifications"
          subtitle="Verified specializations across deep learning, cloud infrastructure, and software engineering."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="glass-card glass-card-hover p-7 rounded-3xl text-white flex flex-col relative group overflow-hidden"
            >
              {/* Top Gradient Accent Bar */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary via-purple-400 to-accent opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {new Date(cert.issue_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-1.5 leading-snug">
                {cert.name}
              </h3>
              <p className="text-gray-400 text-sm font-medium mb-4">
                {cert.issuing_organization}
              </p>

              {cert.credential_id && (
                <p className="text-[11px] text-gray-500 mb-4 font-mono break-all bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/[0.06]">
                  ID: {cert.credential_id}
                </p>
              )}

              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                  {cert.skills.map((skill, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-[11px] font-mono border-primary/25 bg-primary/5 text-purple-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] hover:bg-primary text-primary hover:text-white transition-all text-xs font-bold uppercase tracking-wider border border-primary/30 hover:border-primary"
                >
                  <span>View Credential</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
