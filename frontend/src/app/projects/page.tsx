"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Code2,
  Copyright,
  Menu,
  RefreshCw,
  Search,
  Terminal,
} from "lucide-react";

import { getProjects, Project } from "@/lib/contentfulApi";

const FILTERS = ["All Systems", "AI/ML", "React", "Python", "Web3"];

function richTextToSummary(value: unknown): string {
  if (!value || typeof value !== "object") return "No description available.";
  const content = (value as { content?: unknown[] }).content;
  if (!Array.isArray(content)) return "No description available.";
  const chunks: string[] = [];
  for (const node of content) {
    if (!node || typeof node !== "object") continue;
    const inner = (node as { content?: unknown[] }).content;
    if (!Array.isArray(inner)) continue;
    for (const t of inner) {
      if (!t || typeof t !== "object") continue;
      const v = (t as { value?: unknown }).value;
      if (typeof v === "string" && v.trim()) chunks.push(v.trim());
    }
  }
  return chunks.join(" ").slice(0, 180) || "No description available.";
}

function projectMatchesFilter(project: Project, filter: string): boolean {
  if (filter === "All Systems") return true;
  const tags = (project.technologies || []).map((t) => t.toLowerCase());
  if (filter === "AI/ML") return tags.some((t) => /ai|ml|pytorch|tensorflow|llm/.test(t));
  if (filter === "React") return tags.some((t) => /react|next/.test(t));
  if (filter === "Python") return tags.some((t) => /python|fastapi|flask|django/.test(t));
  if (filter === "Web3") return tags.some((t) => /web3|solidity|ethereum|blockchain/.test(t));
  return true;
}

export default function ProjectsArchivePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Systems");

  useEffect(() => {
    async function load() {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    }
    void load();
  }, []);

  const visibleProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const inFilter = projectMatchesFilter(p, activeFilter);
      if (!inFilter) return false;
      if (!q) return true;
      return (
        p.projectTitle.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.technologies || []).join(" ").toLowerCase().includes(q)
      );
    });
  }, [projects, activeFilter, search]);

  return (
    <div className="min-h-screen bg-[#101622] text-white">
      <header className="sticky top-0 z-40 border-b border-[#282e39] bg-[#111318] px-4 py-3 md:px-10">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-5 w-5 text-[#135bec]" />
            <h2 className="text-lg font-bold tracking-tight">DEV_PORTFOLIO</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/projects" className="text-sm text-white">Projects</Link>
            <Link href="/#about" className="text-sm text-[#9da6b9] hover:text-white">About</Link>
            <Link href="/#contact" className="text-sm text-[#9da6b9] hover:text-white">Contact</Link>
            <Link href="/#contact" className="rounded-lg bg-[#135bec] px-4 py-2 text-sm font-bold shadow-[0_0_10px_rgba(19,91,236,0.5)]">Contact Me</Link>
          </div>
          <button className="md:hidden"><Menu className="h-5 w-5" /></button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-6 px-4 py-8 md:px-10">
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/" className="text-[#9da6b9] hover:text-[#135bec]">Home</Link>
          <span className="text-[#9da6b9]">/</span>
          <span className="font-medium">Projects</span>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
              Project_Archive <span className="animate-pulse text-[#135bec]">_</span>
            </h1>
            <p className="mt-2 max-w-2xl text-base text-[#9da6b9] md:text-lg">
              System modules: AI experiments, full-stack applications, and open-source contributions.
            </p>
          </div>
          <div className="w-full md:w-[320px]">
            <label className="flex h-12 items-center rounded-lg border border-[#282e39] bg-[#1a202c] px-3 focus-within:border-[#135bec]">
              <Search className="h-4 w-4 text-[#9da6b9]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH_MODULES..."
                className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-[#9da6b9]"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-[#282e39] pb-6">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h-9 items-center gap-2 rounded-lg px-4 text-sm ${
                activeFilter === filter
                  ? "bg-[#135bec] text-white shadow-[0_0_10px_rgba(19,91,236,0.3)]"
                  : "bg-[#282e39] text-[#9da6b9] hover:text-white"
              }`}
            >
              <Bot className="h-4 w-4" />
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#9da6b9]">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <article
                key={project.slug}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#282e39] bg-[#1a2230] transition-all hover:border-[#135bec] hover:shadow-[0_0_20px_-5px_rgba(19,91,236,0.3)]"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.projectTitle}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#0f131b]" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#135bec]/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="rounded-full bg-white p-3 text-[#135bec]"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold group-hover:text-[#135bec]">
                      {project.projectTitle}
                    </h3>
                    <Code2 className="mt-1 h-4 w-4 text-[#9da6b9] group-hover:text-[#135bec]" />
                  </div>
                  <p className="line-clamp-2 text-sm leading-relaxed text-[#9da6b9]">
                    {richTextToSummary(project.description)}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {(project.technologies || []).slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-[#384152] bg-[#282e39] px-2 py-1 text-xs font-mono text-[#9da6b9]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex justify-center py-8">
          <button className="group flex items-center gap-2 rounded-lg border border-[#282e39] bg-[#111318] px-6 py-3 text-[#9da6b9] hover:border-[#135bec] hover:text-[#135bec]">
            <span className="font-mono text-sm tracking-wide">LOAD_MORE_DATA()</span>
            <RefreshCw className="h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} />
          </button>
        </div>
      </main>

      <footer className="border-t border-[#282e39] bg-[#111318] py-8">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-10">
          <div className="flex items-center gap-2 text-[#9da6b9]">
            <Copyright className="h-4 w-4" />
            <span className="text-sm">2026 DEV_PORTFOLIO. All systems operational.</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/nyxus-git" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#9da6b9] hover:text-[#135bec] text-sm font-medium">
              GITHUB <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/nyxus-link/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#9da6b9] hover:text-[#135bec] text-sm font-medium">
              LINKEDIN <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="https://x.com/NyxusXplore" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#9da6b9] hover:text-[#135bec] text-sm font-medium">
              TWITTER <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
