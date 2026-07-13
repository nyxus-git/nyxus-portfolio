"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogs, type BlogPost } from "../../lib/api";
import { Calendar, User, ArrowRight } from "lucide-react";

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
    <section id="blog" className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="flex items-end justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 tracking-tight">
              Latest Insights
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col group h-full"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {blog.featured_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="absolute inset-0 bg-grid-white/[0.05]" />
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-primary" />
                    {new Date(blog.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {blog.author && (
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-primary" />
                      {blog.author}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {blog.excerpt && (
                  <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                )}

                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  {blog.tags && (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.split(",").slice(0, 1).map((tag, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 text-gray-400 font-medium border border-white/10">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary opacity-80 hover:opacity-100 transition-opacity group/link"
                  >
                    Read
                    <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
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
