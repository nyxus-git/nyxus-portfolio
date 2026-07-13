"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBlogBySlug, BlogPost } from "../../../lib/api";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Navbar } from "../../../components/sections/Navbar";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getBlogBySlug(slug).then((data) => {
      if (data) {
        setPost(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Post Not Found</h1>
        <p className="text-gray-400 mb-8">The article you are looking for does not exist.</p>
        <Link href="/" className="px-6 py-3 bg-lime-400 text-black font-bold rounded-full hover:bg-lime-300 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  // Simple markdown-like rendering for plain text content
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-black text-white mt-8 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-lime-400 mt-8 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith("```")) return <div key={i} className="font-mono text-xs text-lime-300 bg-gray-800 px-4 py-1 rounded">{line.slice(3)}</div>;
      if (line.startsWith("- ")) return <li key={i} className="text-gray-300 ml-4 list-disc">{line.slice(2)}</li>;
      if (line === "") return <br key={i} />;
      return <p key={i} className="text-gray-300 mb-4 leading-relaxed">{line}</p>;
    });
  };

  return (
    <>
      <Navbar />
      <article className="min-h-screen pt-32 pb-20 px-4 bg-gray-950 relative overflow-hidden">
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

        <div className="container mx-auto max-w-4xl">
          <Link href="/#blog" className="inline-flex items-center text-gray-400 hover:text-lime-400 mb-8 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-sm md:text-base text-gray-400 flex-wrap">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-lime-400" />
                {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </span>
              {post.author && (
                <span className="flex items-center gap-2">
                  <User size={16} className="text-lime-400" />
                  {post.author}
                </span>
              )}
            </div>

            {post.tags && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {post.tags.split(",").map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                    <Tag size={10} />
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.featured_image && (
            <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-12 shadow-2xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {post.excerpt && (
            <div className="bg-lime-500/5 border border-lime-500/20 rounded-xl p-6 mb-8 text-gray-300 italic text-lg leading-relaxed">
              {post.excerpt}
            </div>
          )}

          <div className="bg-gray-900/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/5 shadow-inner">
            {post.content ? (
              <div className="text-gray-300 leading-relaxed">
                {renderContent(post.content)}
              </div>
            ) : (
              <p className="text-gray-500 text-center italic">No content yet.</p>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
