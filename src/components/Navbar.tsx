import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useScroll } from "@/contexts/ScrollContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavLinks } from "./nav/NavLinks";
import { MobileNavLinks } from "./nav/MobileNavLinks";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isScrolled } = useScroll();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 glass-effect py-4 transition-all duration-300 ${isScrolled ? 'bg-opacity-40 backdrop-blur-md' : ''}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-ssa-gold font-heading">SSA</h1>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks currentPath={location.pathname} />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 rounded-full border-2 border-ssa-gold">
                    <AvatarFallback className="bg-[#2a2a2a] text-ssa-gold">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Admin dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-5 py-2 rounded-md border border-ssa-gold text-ssa-gold hover:bg-ssa-gold/10 transition-colors font-semibold shadow-sm">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 rounded-md bg-ssa-gold text-[#131212] hover:bg-ssa-gold/80 transition-colors font-semibold shadow-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect py-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <MobileNavLinks setIsMenuOpen={setIsMenuOpen} currentPath={location.pathname} />
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-2 py-3">
                  <Avatar className="h-10 w-10 rounded-full border-2 border-ssa-gold">
                    <AvatarFallback className="bg-[#2a2a2a] text-ssa-gold">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{user?.name}</span>
                    <span className="text-xs text-gray-400">{user?.email}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-md border border-ssa-gold text-ssa-gold hover:bg-ssa-gold/10 transition-colors font-semibold shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-md bg-ssa-gold text-[#131212] hover:bg-ssa-gold/80 transition-colors font-semibold shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
