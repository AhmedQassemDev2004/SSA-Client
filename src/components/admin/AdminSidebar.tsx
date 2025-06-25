import { useNavigate, useLocation } from "react-router-dom";
import { LucideIcon, Users, Package, LayoutDashboard, BarChart3, Tag, Image, ArrowLeft, ArrowLeftCircleIcon, MessageSquare, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface SidebarLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

const links: SidebarLink[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/admin/orders",
  },
  {
    icon: Package,
    label: "Services",
    href: "/admin/services",
  },
  {
    icon: Image,
    label: "Portfolios",
    href: "/admin/portfolios",
  },
  {
    icon: Tag,
    label: "Categories",
    href: "/admin/categories",
  },
  {
    icon: MessageSquare,
    label: "Contacts",
    href: "/admin/contacts",
  },
  {
    icon: ArrowLeftCircleIcon,
    label: "Go to website",
    href: "/",
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {user} = useAuth();


  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-ssa-dark to-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold text-ssa-gold">Admin Panel</h2>
        <p className="text-sm text-gray-400">Manage your services</p>
      </div>
      
      <nav className="flex-1 space-y-1 px-4">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          
          return (
            <Button
              key={link.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 px-4 py-6 text-left transition-all duration-150",
                isActive
                  ? "bg-ssa-gold/20 text-ssa-gold"
                  : "text-gray-400 hover:bg-white/5 hover:text-ssa-gold"
              )}
              onClick={() => navigate(link.href)}
            >
              <link.icon className={cn("h-5 w-5", isActive && "text-ssa-gold")} />
              <span className="text-sm font-medium">{link.label}</span>
            </Button>
          );
        })}
      </nav>
      
      <div className="mt-auto border-t border-ssa-gold/20 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-ssa-gold to-ssa-gold/70" />
          <div>
            <p className="text-sm font-medium text-ssa-gold">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
