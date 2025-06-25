import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-ssa-dark to-gray-900">
      {/* Fixed Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30 shadow-lg shadow-black/30">
        <AdminSidebar />
      </div>
      
      {/* Main content with offset */}
      <div className="flex-1 md:ml-64 w-full">
        <div className="min-h-screen p-8">
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
