"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getExperience,
  Experience as ExperienceType,
} from "../../lib/contentfulApi";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

import { ExpandableContent } from "../ui/ExpandableContent";

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch from Contentful
      const data = await getExperience();
      // Fallback to static data if no content found (prevents empty section during migration)
      if (data.length === 0) {
        // Keep hardcoded data as a fallback for now if user hasn't populated Experience yet
        // Or render empty. Given the user asked for "contentful not fetching",
        // I should prioritize showing that connection, but fallback is safer for UI.
        // Let's rely on data being there or show empty state to indicate "fill your contentful".
        setExperiences([]);
      } else {
        setExperiences(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return null;

  // Static fallback if API returns empty, just so the section looks populated in preview
  // until user adds real data.
  const displayExperiences =
    experiences.length > 0
      ? experiences
      : [
          {
            companyName: "Your Company Here",
            jobTitle: "Your Role Here",
            startDate: "2024-01-01",
            endDate: undefined,
            description: undefined,
            location: "Remote",
          },
        ];

  return (
    <section
      id="experience"
      className="py-16 sm:py-20 px-4 relative bg-gray-950"
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900 via-gray-950 to-black -z-20"></div>

      <div className="container mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-black mb-12 sm:mb-16 text-center text-blue-500 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work Experience
        </motion.h2>

        <div className="relative pl-6 sm:pl-8 md:pl-20">
          <div className="absolute left-4 md:left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent"></div>

          {displayExperiences.map((exp, index) => (
            <motion.div
              key={index}
              className="mb-12 last:mb-0 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute left-0 md:left-6 -top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10 shadow-[0_0_15px_rgba(132,204,22,0.6)]"></div>

              <div className="glass glass-hover p-4 sm:p-6 md:p-8 rounded-2xl ml-5 sm:ml-8 md:ml-12 border-l-4 border-l-blue-500/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {exp.jobTitle}
                    </h3>
                    <p className="text-lg sm:text-xl text-blue-500 font-medium">
                      {exp.companyName}
                    </p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="text-sm font-mono text-gray-400 px-3 py-1 bg-white/5 rounded-full inline-block">
                      {new Date(exp.startDate).getFullYear()} -{" "}
                      {exp.endDate
                        ? new Date(exp.endDate).getFullYear()
                        : "Present"}
                    </p>
                  </div>
                </div>

                <div className="text-gray-300 mb-6 leading-relaxed contentful-rich-text">
                  <ExpandableContent maxHeight={100}>
                    {exp.description &&
                      documentToReactComponents(exp.description)}
                    {!exp.description && <p>No description available.</p>}
                  </ExpandableContent>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
