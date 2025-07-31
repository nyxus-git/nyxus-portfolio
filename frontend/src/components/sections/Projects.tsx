"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component

export function Projects() {
  const projects = [
    {
      id: 1,
      title: "AI-Powered Chatbot",
      description: "Developed an intelligent chatbot capable of understanding natural language and providing relevant responses, built with Python and a custom NLP model.",
      image: "/chatbot.png", // Replace with your actual image path
      techStack: ["Python", "TensorFlow", "NLTK", "Flask", "Docker"],
      githubUrl: "https://github.com/your-username/ai-chatbot", // Replace with actual URL
      liveDemoUrl: "#", // Replace with actual URL or remove if not applicable
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description: "Built a full-stack e-commerce application with user authentication, product listings, shopping cart, and payment integration.",
      image: "/ecommerce.png", // Replace with your actual image path
      techStack: ["React", "Node.js", "Express.js", "MongoDB", "Stripe API"],
      githubUrl: "https://github.com/your-username/ecommerce-platform", // Replace with actual URL
      liveDemoUrl: "#", // Replace with actual URL or remove if not applicable
    },
    {
      id: 3,
      title: "Portfolio Website (This one!)",
      description: "Designed and developed this responsive and interactive personal portfolio website using Next.js and Tailwind CSS.",
      image: "/portfolio.png", // Replace with your actual image path
      techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      githubUrl: "https://github.com/your-username/portfolio-website", // Replace with actual URL
      liveDemoUrl: "#", // Replace with actual URL or remove if not applicable
    },
    {
      id: 4,
      title: "Zero-Connect Web Chat App",
      description: "ZeroConnect is a sleek and efficient real-time web chat application designed to facilitate seamless communication between users. Built with a focus on speed and responsiveness, the platform allows for instant message exchange, ensuring a fluid and interactive user experience. It features a modern, intuitive interface that prioritizes ease of use, making it ideal for casual conversations or collaborative discussions.",
      image: "/zero-connect.png", // Replace with your actual image path
      techStack: ["Next.js (React)", "FastAPI", "PostgreSQL", "Tailwind CSS", "Vercel"],
      githubUrl: "https://github.com/nyxus-git/Zero-connect.git",
      liveDemoUrl: "https://zero-connect.vercel.app/",
    },
    // Add more projects as needed
  ];

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center text-lime-400 uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Projects
          <div className="w-24 h-1 bg-lime-400 mx-auto mt-4 rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl border border-gray-700/50 text-white flex flex-col"
            >
              {project.image && (
                <div className="relative w-full h-48 rounded-t-lg mb-4 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-lime-400 mb-2">{project.title}</h3>
              <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, techIndex) => (
                  <span key={techIndex} className="bg-lime-600/30 text-lime-300 px-3 py-1 rounded-full text-xs font-medium border border-lime-500/50">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto">
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-300 hover:text-lime-400 transition-colors"
                  >
                    <Github className="w-5 h-5 mr-2" /> GitHub
                  </Link>
                )}
                {project.liveDemoUrl && (
                  <Link
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-300 hover:text-lime-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" /> Live Demo
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}