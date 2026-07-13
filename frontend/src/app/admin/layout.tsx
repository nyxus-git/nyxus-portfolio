export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-950 text-white min-h-screen relative z-50">
      {children}
    </div>
  );
}
