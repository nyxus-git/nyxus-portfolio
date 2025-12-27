"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBlogPostBySlug, BlogPost } from "../../../lib/contentfulApi";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Navbar } from "../../../components/sections/Navbar";

// Rich Text Rendering Options
const richTextOptions = {
    renderNode: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [BLOCKS.HEADING_2]: (_node: any, children: any) => (
            <h2 className="text-3xl font-bold text-lime-400 mt-8 mb-4">{children}</h2>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [BLOCKS.HEADING_3]: (_node: any, children: any) => (
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">{children}</h3>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">{children}</p>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [BLOCKS.UL_LIST]: (_node: any, children: any) => (
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">{children}</ul>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [BLOCKS.OL_LIST]: (_node: any, children: any) => (
            <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">{children}</ol>
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [BLOCKS.QUOTE]: (_node: any, children: any) => (
            <blockquote className="border-l-4 border-lime-400 pl-4 py-2 italic text-gray-400 my-6 bg-white/5 rounded-r-lg">
                {children}
            </blockquote>
        ),
        // Add more renderers for images/code blocks if needed
    },
    renderMark: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [MARKS.BOLD]: (text: any) => <span className="font-bold text-white">{text}</span>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [MARKS.CODE]: (text: any) => (
            <code className="bg-gray-800 text-lime-400 px-1 py-0.5 rounded font-mono text-sm">{text}</code>
        ),
    },
};

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            if (!slug) return;

            const data = await getBlogPostBySlug(slug);

            if (data) {
                setPost(data);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        }
        fetchPost();
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

    return (
        <>
            {/* Re-use Navbar, or maybe just a back button? Sticking to Navbar for consistency */}
            <Navbar />

            <article className="min-h-screen pt-32 pb-20 px-4 bg-gray-950 relative overflow-hidden">
                {/* Background Glow */}
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

                        <div className="flex items-center justify-center gap-6 text-sm md:text-base text-gray-400">
                            <span className="flex items-center gap-2">
                                <Calendar size={16} className="text-lime-400" />
                                {new Date(post.date).toLocaleDateString()}
                            </span>
                            {post.author && (
                                <span className="flex items-center gap-2">
                                    <User size={16} className="text-lime-400" />
                                    {post.author}
                                </span>
                            )}
                        </div>
                    </header>

                    {post.featuredImage && (
                        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl border border-white/10">
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="prose prose-lg prose-invert max-w-none bg-gray-900/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/5 shadow-inner">
                        {post.content && documentToReactComponents(post.content, richTextOptions)}
                    </div>
                </div>
            </article>
        </>
    );
}
