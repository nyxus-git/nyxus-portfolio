// frontend/src/app/page.tsx
"use client";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Project } from "@/components/sections/Project";
import { Education } from "@/components/sections/Education";
import { Certification } from "@/components/sections/Certification";
import { Experience } from "@/components/sections/Experience";
import { ContactForm } from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <About />
      <Skills />
      <Project />
      <Education />
      <Certification />
      <Experience />
      <ContactForm />
    </main>
  );
}