// frontend/src/components/sections/About.tsx
export function About() {
  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">About Me</h2>
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
          <p className="mb-4">
            Hi, I&apos;m Nyxus (Rohan Mane), a final-year student pursuing Artificial Intelligence and Machine Learning.
            I&apos;m passionate about building intelligent systems and innovative tech solutions.
          </p>
          <p>
            Outside of coding, I enjoy exploring AI, cybersecurity, cloud technologies, and deep learning.
            Let&apos;s connect and build something amazing together!
          </p>
        </div>
      </div>
    </section>
  );
}
