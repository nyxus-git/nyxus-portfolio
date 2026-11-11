"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Briefcase, Award, BookOpen,
  Cpu, User, LogOut, Menu, X, ChevronRight, Terminal, Images
} from "lucide-react";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { CertificationsManager } from "@/components/admin/CertificationsManager";
import { BlogsManager } from "@/components/admin/BlogsManager";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { AboutManager } from "@/components/admin/AboutManager";
import { MediaManager } from "@/components/admin/MediaManager";
import {
  getAllProjectsAdmin, getExperiences, getCertifications, getAllBlogs, getSkills, verifyAdminToken
} from "@/lib/api";

type Section = "dashboard" | "projects" | "experience" | "certifications" | "blogs" | "skills" | "about" | "media";

const NAV_ITEMS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "certifications", label: "Certifications", icon: Award },
  { key: "blogs", label: "Blog Posts", icon: BookOpen },
  { key: "skills", label: "Skills", icon: Cpu },
  { key: "about", label: "About & Links", icon: User },
  { key: "media", label: "Media Library", icon: Images },
];

export default function AdminPage() {
  const router = useRouter();
  const [active, setActive] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ projects: 0, experience: 0, certifications: 0, blogs: 0, skills: 0 });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }

    verifyAdminToken().then((valid) => {
      if (!valid) {
        router.replace("/admin/login?expired=1");
        return;
      }
      Promise.all([
        getAllProjectsAdmin(), getExperiences(), getCertifications(), getAllBlogs(), getSkills()
      ]).then(([p, e, c, b, s]) => {
        setStats({ projects: p.length, experience: e.length, certifications: c.length, blogs: b.length, skills: s.length });
      }).catch(() => {});
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
      case "media": return <MediaManager />;
    }
  };

  return (
    <div className="min-h-screen bg-[#04040a] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-30 lg:z-auto h-full lg:h-screen
        w-64 bg-[#090814] border-r border-white/[0.06] flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
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
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-4 h-4 ${active === item.key ? "text-primary" : "text-gray-500 group-hover:text-gray-300"}`} />
              {item.label}
              {active === item.key && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm font-medium"
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
        <header className="h-16 bg-[#090814]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-6 gap-4 sticky top-0 z-10">
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
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
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
    { key: "projects", label: "Projects", count: stats.projects, icon: FolderKanban, color: "violet", section: "projects" as Section },
    { key: "experience", label: "Experience", count: stats.experience, icon: Briefcase, color: "pink", section: "experience" as Section },
    { key: "certifications", label: "Certifications", count: stats.certifications, icon: Award, color: "purple", section: "certifications" as Section },
    { key: "blogs", label: "Blog Posts", count: stats.blogs, icon: BookOpen, color: "indigo", section: "blogs" as Section },
    { key: "skills", label: "Skills", count: stats.skills, icon: Cpu, color: "fuchsia", section: "skills" as Section },
  ];

  const colorMap: Record<string, string> = {
    violet: "bg-violet-500/20 border-violet-500/30 text-violet-400",
    pink: "bg-pink-500/20 border-pink-500/30 text-pink-400",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
    indigo: "bg-indigo-500/20 border-indigo-500/30 text-indigo-400",
    fuchsia: "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white mb-1">Welcome back!</h2>
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
            className="glass-card glass-card-hover rounded-2xl p-5 text-left group"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-white">{card.count}</p>
            <p className="text-gray-500 text-xs mt-1">{card.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {NAV_ITEMS.filter(n => n.key !== "dashboard").map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] hover:bg-primary/15 hover:border-primary/30 border border-white/[0.06] transition-all text-sm text-gray-300 hover:text-primary"
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
