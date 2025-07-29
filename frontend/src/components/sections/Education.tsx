// frontend/src/components/sections/Education.tsx
export function Education() {
  return (
    <section id="education" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">My Education</h2>
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
          <p className="mb-2">
            <strong>B.E. in Artificial Intelligence and Machine Learning (AIML)</strong>
          </p>
          <p className="mb-2">Savitribai Phule Pune University</p>
          <p>Expected Graduation: 2025</p>
        </div>
      </div>
    </section>
  );
}