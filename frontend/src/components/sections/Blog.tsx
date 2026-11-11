"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogs, getImageUrl, type BlogPost } from "../../lib/api";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  if (loading || blogs.length === 0) return null;

  return (
    <section id="blog" className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="section-divider mb-24" />
      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="11"
          badge="Editorial Notes"
          icon={BookOpen}
          title="Latest Insights"
          subtitle="Deep dives on neural architectures, open-source tooling, and Linux workflows."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col group h-full"
            >
              <Link
                href={`/blog/${blog.slug}`}
                className="relative h-48 w-full overflow-hidden bg-[#070612] flex items-center justify-center border-b border-white/[0.06]"
              >
                {blog.featured_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageUrl(blog.featured_image) ?? blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                ) : (
                  <div className="absolute inset-0 bg-grid-white" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c1a] via-transparent to-transparent pointer-events-none" />
              </Link>

              <div className="p-7 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400 mb-3.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-primary" />
                    {new Date(blog.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {blog.author && (
                    <span className="flex items-center gap-1.5">
                      <User size={12} className="text-accent" />
                      {blog.author}
                    </span>
                  )}
                </div>

                <Link href={`/blog/${blog.slug}`} className="block">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                {blog.excerpt && (
                  <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  {blog.tags ? (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags
                        .split(",")
                        .slice(0, 1)
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/25"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <span />
                  )}

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-200 hover:text-primary transition-colors group/link"
                  >
                    <span>Read Article</span>
                    <ArrowRight
                      size={14}
                      className="text-primary transition-transform group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
