import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, MessageSquareWarning, Star,
  ShieldCheck, LogOut, GraduationCap, Menu, X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/complaints", icon: MessageSquareWarning, label: "Complaints" },
  { to: "/reviews", icon: Star, label: "Reviews" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const roleColor = {
    admin: "bg-rose-500/20 text-rose-300",
    staff: "bg-amber-500/20 text-amber-300",
    student: "bg-sky-500/20 text-sky-300",
  };

  return (
    <div className="min-h-screen flex bg-[#0d0f1a]" style={{ fontFamily: "'Syne', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-30 top-0 left-0 h-screen w-64 bg-[#12152b] border-r border-white/5 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">SCRMS</p>
              <p className="text-white/40 text-xs">College Portal</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-white/40 text-xs truncate mb-2">{user?.email}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleColor[user?.role] || "bg-gray-500/20 text-gray-300"}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}

          {(user?.role === "admin" || user?.role === "staff") && (
            <NavLink
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <ShieldCheck size={17} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#12152b]">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="text-white font-bold text-sm">SCRMS Portal</span>
          <div className="w-6" />
        </div>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
