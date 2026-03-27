import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Menu, X } from "lucide-react";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Bảng điều khiển", path: "/" },
    { label: "Khoản chi", path: "/expenses" },
    { label: "Ngân sách tháng", path: "/budget" },
    { label: "Sổ nợ", path: "/debts" },
    { label: "Mục tiêu tiết kiệm", path: "/goals" },
    { label: "Phân tích & Thống kê", path: "/analytics" },
    { label: "Tài khoản của tôi", path: "/profile" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans relative overflow-hidden">
      {/* Sidebar - Text focused, Minimalist */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Fina<span className="text-blue-600">.</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide uppercase">
              Quản lý tài chính
            </p>
          </div>
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout at bottom of sidebar */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Đang đăng nhập
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "Người dùng"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-left text-sm text-red-600 hover:text-red-700 font-medium transition-colors py-2"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top Navbar - Very clean */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-10 flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">
              {navItems.find((item) => item.path === location.pathname)?.label ||
                "Trang"}
            </h2>
          </div>
          
          <div className="lg:hidden">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Fina<span className="text-blue-600">.</span>
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
