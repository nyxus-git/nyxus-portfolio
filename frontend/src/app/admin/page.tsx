"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Briefcase, Award, BookOpen,
  Cpu, User, LogOut, Menu, X, ChevronRight, Terminal
} from "lucide-react";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";
import { BlogsManager } from "@/components/admin/BlogsManager";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { AboutManager } from "@/components/admin/AboutManager";
import {
  getProjects, getExperiences, getCertifications, getBlogs, getSkills
} from "@/lib/api";

type Section = "dashboard" | "projects" | "experience" | "certifications" | "blogs" | "skills" | "about";

const NAV_ITEMS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "certifications", label: "Certifications", icon: Award },
  { key: "blogs", label: "Blog Posts", icon: BookOpen },
  { key: "skills", label: "Skills", icon: Cpu },
  { key: "about", label: "About & Links", icon: User },
];

export default function AdminPage() {
  const router = useRouter();
  const [active, setActive] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ projects: 0, experience: 0, certifications: 0, blogs: 0, skills: 0 });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }

    // Fetch stats
    Promise.all([
      getProjects(), getExperiences(), getCertifications(), getBlogs(), getSkills()
    ]).then(([p, e, c, b, s]) => {
      setStats({ projects: p.length, experience: e.length, certifications: c.length, blogs: b.length, skills: s.length });
    });
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <DashboardOverview stats={stats} onNavigate={setActive} />;
      case "projects": return <ProjectsManager />;
      case "experience": return <ExperienceManager />;
      case "certifications": return <CertificationsManager />;
      case "blogs": return <BlogsManager />;
      case "skills": return <SkillsManager />;
      case "about": return <AboutManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-30 lg:z-auto h-full lg:h-screen
        w-64 bg-gray-900 border-r border-white/5 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <p className="font-black text-white text-sm">Nyxus Admin</p>
              <p className="text-gray-500 text-xs font-mono">portfolio/cms</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              id={`admin-nav-${item.key}`}
              onClick={() => { setActive(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group ${
                active === item.key
                  ? "bg-lime-500/20 text-lime-400 border border-lime-500/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-4 h-4 ${active === item.key ? "text-lime-400" : "text-gray-500 group-hover:text-gray-300"}`} />
              {item.label}
              {active === item.key && <ChevronRight className="w-3 h-3 ml-auto text-lime-400" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <a
            href="/"
            target="_blank"
            className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all text-xs font-mono"
          >
            ↗ View Portfolio
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-gray-900/50 backdrop-blur border-b border-white/5 flex items-center px-6 gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-white capitalize">
              {NAV_ITEMS.find(n => n.key === active)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-xs text-gray-500 font-mono">admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────
function DashboardOverview({ stats, onNavigate }: { stats: Record<string, number>; onNavigate: (s: Section) => void }) {
  const cards = [
    { key: "projects", label: "Projects", count: stats.projects, icon: FolderKanban, color: "lime", section: "projects" as Section },
    { key: "experience", label: "Experience", count: stats.experience, icon: Briefcase, color: "cyan", section: "experience" as Section },
    { key: "certifications", label: "Certifications", count: stats.certifications, icon: Award, color: "purple", section: "certifications" as Section },
    { key: "blogs", label: "Blog Posts", count: stats.blogs, icon: BookOpen, color: "orange", section: "blogs" as Section },
    { key: "skills", label: "Skills", count: stats.skills, icon: Cpu, color: "emerald", section: "skills" as Section },
  ];

  const colorMap: Record<string, string> = {
    lime: "bg-lime-500/20 border-lime-500/30 text-lime-400",
    cyan: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
    orange: "bg-orange-500/20 border-orange-500/30 text-orange-400",
    emerald: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white mb-1">Welcome back! 👋</h2>
        <p className="text-gray-500 text-sm">Manage your portfolio content from here.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.button
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onNavigate(card.section)}
            className="bg-gray-900 border border-white/5 rounded-2xl p-5 text-left hover:border-white/15 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-white">{card.count}</p>
            <p className="text-gray-500 text-xs mt-1">{card.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {NAV_ITEMS.filter(n => n.key !== "dashboard").map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-lime-500/10 hover:border-lime-500/20 border border-white/5 transition-all text-sm text-gray-400 hover:text-lime-400"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
