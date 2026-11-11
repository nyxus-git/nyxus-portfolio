"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBlogBySlug, getImageUrl, BlogPost } from "../../../lib/api";
import { ArrowLeft, Calendar, User, Tag, BookOpen } from "lucide-react";
import { Navbar } from "../../../components/sections/Navbar";
import { Footer } from "../../../components/sections/Footer";

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
      <div className="min-h-screen flex items-center justify-center bg-[#04040a]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-primary" />
          <p className="text-gray-400 font-mono text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#04040a] text-center px-4">
        <h1 className="text-4xl font-black text-white mb-4">404 - Post Not Found</h1>
        <p className="text-gray-400 mb-8">The article you are looking for does not exist.</p>
        <Link
          href="/"
          className="px-6 py-3 btn-primary font-bold rounded-full"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={i} className="text-3xl font-black text-white mt-8 mb-4 tracking-tight">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-2xl font-bold text-primary mt-8 mb-4 tracking-tight">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-xl font-semibold text-white mt-6 mb-3">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith("```")) {
        return (
          <div
            key={i}
            className="font-mono text-xs text-purple-200 bg-[#070612] border border-primary/20 px-4 py-2 rounded-xl my-2"
          >
            {line.slice(3)}
          </div>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="text-gray-300 ml-5 list-disc leading-relaxed mb-1.5">
            {line.slice(2)}
          </li>
        );
      }
      if (line === "") return <div key={i} className="h-3" />;
      return (
        <p key={i} className="text-gray-300 mb-4 leading-relaxed text-base md:text-lg">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#04040a] text-white selection:bg-primary/30 flex flex-col">
      <Navbar />

      <article className="flex-1 pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[130px] -z-10 pointer-events-none" />

        <div className="container mx-auto max-w-4xl">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-primary mb-10 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Articles</span>
          </Link>

          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-mono uppercase tracking-[0.18em] mb-5">
              <BookOpen size={12} />
              <span>Engineering Article</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gradient tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-xs sm:text-sm font-mono text-gray-400 flex-wrap">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {post.author && (
                <span className="flex items-center gap-2">
                  <User size={14} className="text-accent" />
                  {post.author}
                </span>
              )}
            </div>

            {post.tags && (
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {post.tags.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25"
                  >
                    <Tag size={10} />
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.featured_image && (
            <div className="relative w-full h-[280px] md:h-[440px] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-primary/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(post.featured_image) ?? post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {post.excerpt && (
            <div className="bg-primary/10 border border-primary/25 rounded-2xl p-6 mb-8 text-purple-100 italic text-base md:text-lg leading-relaxed">
              {post.excerpt}
            </div>
          )}

          <div className="glass-panel p-7 md:p-12 rounded-3xl">
            {post.content ? (
              <div className="text-gray-300 leading-relaxed">{renderContent(post.content)}</div>
            ) : (
              <p className="text-gray-500 text-center italic">No content yet.</p>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
