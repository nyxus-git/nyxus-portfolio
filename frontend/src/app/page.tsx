// frontend/src/app/page.tsx
"use client";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { BestProject } from "@/components/sections/BestProject";
import { Skills } from "@/components/sections/Skills";
import { Project } from "@/components/sections/Project";
import { Education } from "@/components/sections/Education";
import { Certification } from "@/components/sections/Certification";
import { Experience } from "@/components/sections/Experience";
import { ContactForm } from "@/components/sections/ContactForm";
import { Blog } from "@/components/sections/Blog";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-primary/30">
      {/* 21st.dev style animated ambient background could be placed here if AnimatedBackground isn't in layout */}
      <Hero />
      <BestProject />
      <About />
      <Skills />
      <Project />
      <Experience />
      <Education />
      <Certification />
      <Blog />
      <ContactForm />
    </main>
  );
}