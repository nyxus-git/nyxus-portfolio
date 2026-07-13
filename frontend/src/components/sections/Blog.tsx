"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogs, BlogPost } from "../../lib/api";
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

  if (loading) return null;
  if (blogs.length === 0) return null;

  return (
    <section id="blog" className="py-20 px-4 relative">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-black mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Latest Articles
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass glass-hover rounded-2xl overflow-hidden flex flex-col group border border-white/5"
            >
              {/* Featured image or placeholder */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {blog.featured_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/20 flex items-center justify-center mb-2">
                      <span className="text-xl font-black text-cyan-400">✍</span>
                    </div>
                    {blog.tags && (
                      <p className="text-xs text-gray-600 font-mono">{blog.tags.split(",")[0]}</p>
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-lime-400 mb-3 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(blog.date).toLocaleDateString()}
                  </span>
                  {blog.author && (
                    <span className="flex items-center gap-1 text-gray-400">
                      <User size={12} />
                      {blog.author}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-lime-400 transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {blog.excerpt && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                )}

                {blog.tags && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.split(",").slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/blog/${blog.slug}`}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors group/link"
                >
                  Read More
                  <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1 text-lime-400" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
