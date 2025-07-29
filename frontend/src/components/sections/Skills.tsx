// frontend/src/components/sections/Skills.tsx
export function Skills() {
  return (
    <section id="skills" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">My Skills</h2>
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
          <ul className="list-disc pl-6">
            <li>Artificial Intelligence & Machine Learning</li>
            <li>Full Stack Development</li>
            <li>Cloud Technologies</li>
            <li>Cybersecurity</li>
            <li>Deep Learning</li>
            <li>Linux</li>
          </ul>
        </div>
      </div>
    </section>
  );
}