// frontend/src/components/sections/Certifications.tsx
export function Certifications() {
  return (
    <section id="certifications" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">My Certifications</h2>
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
          <p className="mb-4">
            A list of relevant courses, certifications, and achievements will be added here.
          </p>
          <p>
            These demonstrate my commitment to continuous learning in AI, ML, and related technologies.
          </p>
        </div>
      </div>
    </section>
  );
}