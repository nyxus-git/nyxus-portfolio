export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#04040a] text-white min-h-screen relative z-50">
      {children}
    </div>
  );
}
