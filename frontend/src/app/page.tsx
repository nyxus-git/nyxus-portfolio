// frontend/src/app/page.tsx
"use client";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { BestProject } from "@/components/sections/BestProject";
import { Skills } from "@/components/sections/Skills";
import { AiPlayground } from "@/components/sections/AiPlayground";
import { ModelHub } from "@/components/sections/ModelHub";
import { Project } from "@/components/sections/Project";
import { GitHubActivity } from "@/components/sections/GitHubActivity";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Certification } from "@/components/sections/Certification";
import { Blog } from "@/components/sections/Blog";
import { ContactForm } from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-primary/30">
      <Hero />
      <BestProject />
      <About />
      <Skills />
      <AiPlayground />
      <ModelHub />
      <Project />
      <GitHubActivity />
      <Experience />
      <Education />
      <Certification />
      <Blog />
      <ContactForm />
    </main>
  );
}