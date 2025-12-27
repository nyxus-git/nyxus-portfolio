"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBlogs, BlogPost } from "../../lib/contentfulApi";
import { Calendar, User, ArrowRight } from "lucide-react";

export function Blog() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const data = await getBlogs();
            setBlogs(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return null;
    if (blogs.length === 0) return null; // Don't show section if no blogs

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
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass glass-hover rounded-2xl overflow-hidden flex flex-col group border border-white/5"
                        >
                            <div className="relative h-52 w-full overflow-hidden">
                                {blog.featuredImage ? (
                                    <Image
                                        src={blog.featuredImage}
                                        alt={blog.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                                        No Image
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

                                <Link
                                    href={`/blog/${blog.slug}`} // Assuming we'll have a dynamic route later, or just link to # for now
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
