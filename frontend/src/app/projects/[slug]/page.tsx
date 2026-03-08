"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  FolderOpen,
  Menu,
  Rocket,
  Terminal,
} from "lucide-react";

import { getProjects, Project } from "@/lib/contentfulApi";
import { getSiteConfig } from "@/lib/siteConfig";

const richTextOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderNode: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
      <p className="text-[#9da6b9] leading-relaxed text-lg mb-4">{children}</p>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [BLOCKS.UL_LIST]: (_node: any, children: any) => (
      <ul className="list-disc pl-5 text-[#9da6b9] space-y-2 mb-4">{children}</ul>
    ),
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeUrl, setResumeUrl] = useState("/Rohan_Resume.pdf");

  useEffect(() => {
    async function load() {
      const [projectData, config] = await Promise.all([
        getProjects(),
        getSiteConfig(),
      ]);
      setProjects(projectData);
      setResumeUrl(config.resumeUrl);
      setLoading(false);
    }
    void load();
  }, []);

  const project = useMemo(
    () => projects.find((p) => p.slug === slug) || null,
    [projects, slug],
  );

  const nextProject = useMemo(() => {
    if (!project || projects.length <= 1) return null;
    const idx = projects.findIndex((p) => p.slug === project.slug);
    const nextIdx = (idx + 1) % projects.length;
    return projects[nextIdx];
  }, [projects, project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101622] text-white flex items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-2 border-[#135bec] border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#101622] text-white flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-black mb-3">Project Not Found</h1>
        <p className="text-[#9da6b9] mb-8">No project found for slug: {slug}</p>
        <Link href="/#project" className="px-6 py-3 rounded-lg bg-[#135bec] font-semibold">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101622] text-white tech-grid-bg">
      <header className="sticky top-0 z-40 w-full border-b border-[#282e39] bg-[#111318]/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded bg-[#135bec]/20 text-[#135bec] flex items-center justify-center">
              <Terminal className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold tracking-wider">ROHAN_PORTFOLIO // OS</h2>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#home" className="text-[#9da6b9] text-sm hover:text-white">SYSTEM_HOME</Link>
            <Link href="/#project" className="text-sm border-b-2 border-[#135bec] pb-0.5">PROJECTS</Link>
            <Link href="/#contact" className="text-[#9da6b9] text-sm hover:text-white">CONTACT</Link>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-[#135bec] px-4 py-2 text-sm font-bold">
              <Download className="h-4 w-4" />
              RESUME
            </a>
          </div>
          <button className="md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 md:px-6 py-8 flex flex-col gap-8">
        <div className="flex items-center gap-2 text-sm">
          <FolderOpen className="h-4 w-4 text-[#9da6b9]" />
          <Link href="/" className="text-[#9da6b9] hover:text-[#135bec]">root</Link>
          <span className="text-[#9da6b9]">/</span>
          <Link href="/#project" className="text-[#9da6b9] hover:text-[#135bec]">projects</Link>
          <span className="text-[#9da6b9]">/</span>
          <span className="text-[#135bec] font-bold">{project.slug}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#282e39] pb-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded border border-[#135bec]/30 bg-[#135bec]/10 px-3 py-1">
              <span className="relative h-2 w-2 rounded-full bg-[#135bec]" />
              <p className="text-xs font-bold tracking-widest text-[#135bec]">STATUS: DEPLOYED</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
              {project.projectTitle}
            </h1>
            <p className="mt-4 text-[#9da6b9] text-lg md:text-xl font-light leading-relaxed">
              Interactive case study and technical breakdown of this project.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.sourceCodeLink ? (
              <a href={project.sourceCodeLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-[#282e39] bg-[#1e232e] px-5 py-3 text-sm font-bold hover:border-[#135bec]/50">
                <Code2 className="h-4 w-4" />
                VIEW_SOURCE
              </a>
            ) : null}
            {project.liveDemoLink ? (
              <a href={project.liveDemoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#101622]">
                <Rocket className="h-4 w-4" />
                LIVE_DEMO
              </a>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-[#282e39] bg-[#1e232e]">
              {project.coverImage ? (
                <Image src={project.coverImage} alt={project.projectTitle} fill className="object-cover opacity-80" />
              ) : (
                <div className="h-full w-full bg-[#1e232e]" />
              )}
            </div>

            <section>
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-sm text-[#135bec]">01 //</span>
                <h3 className="text-2xl font-bold uppercase">Project Overview</h3>
              </div>
              <div>{documentToReactComponents(project.description, richTextOptions)}</div>
            </section>

            <section>
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-sm text-[#135bec]">02 //</span>
                <h3 className="text-2xl font-bold uppercase">Implementation Notes</h3>
              </div>
              <p className="text-[#9da6b9] leading-relaxed text-lg">
                Built with a modular architecture so features can scale quickly while
                preserving performance and maintainability across releases.
              </p>
            </section>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="rounded-xl border border-[#282e39] bg-[#1e232e]/50 p-6">
              <h4 className="mb-4 border-b border-[#282e39] pb-3 font-bold tracking-wider">PROJECT_SPECS</h4>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-[90px_1fr] gap-3">
                  <p className="text-[#9da6b9] font-mono uppercase text-xs">Role</p>
                  <p>Full Stack Developer</p>
                </div>
                <div className="grid grid-cols-[90px_1fr] gap-3">
                  <p className="text-[#9da6b9] font-mono uppercase text-xs">Context</p>
                  <p>Portfolio Project</p>
                </div>
                <div className="grid grid-cols-[90px_1fr] gap-3">
                  <p className="text-[#9da6b9] font-mono uppercase text-xs">Repo</p>
                  <p className="break-all">
                    {project.sourceCodeLink ? (
                      <a href={project.sourceCodeLink} target="_blank" rel="noreferrer" className="text-[#135bec] hover:underline">
                        {project.sourceCodeLink}
                      </a>
                    ) : (
                      "Private"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#282e39] bg-[#1e232e]/50 p-6">
              <h4 className="mb-4 border-b border-[#282e39] pb-3 font-bold tracking-wider">TECHNOLOGIES</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech) => (
                  <span key={tech} className="rounded-md border border-[#282e39] bg-[#111318] px-3 py-1.5 text-xs font-mono text-[#9da6b9]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {nextProject ? (
          <Link href={`/projects/${nextProject.slug}`} className="group mt-6 rounded-xl border border-[#282e39] bg-[#1e232e] p-7 hover:border-[#135bec]/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-[#9da6b9] mb-1">NEXT_MISSION //</p>
                <h2 className="text-2xl font-bold uppercase">{nextProject.projectTitle}</h2>
              </div>
              <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                <span className="text-sm font-bold">INITIATE</span>
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ) : null}
      </main>

      <footer className="border-t border-[#282e39] bg-[#111318] py-8 mt-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#9da6b9]">© 2026 NYXUS Portfolio Systems.</p>
          <div className="flex items-center gap-3">
            <button className="size-8 rounded border border-[#282e39] text-[#9da6b9] flex items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="size-8 rounded border border-[#282e39] text-[#9da6b9] flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
