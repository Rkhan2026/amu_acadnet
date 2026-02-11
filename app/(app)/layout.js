import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
