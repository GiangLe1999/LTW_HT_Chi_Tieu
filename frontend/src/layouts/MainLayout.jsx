import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans">
      {/* Sidebar - Text focused, Minimalist */}
      <aside className="w-72 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col">
        <div className="p-8 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fina<span className="text-blue-600">.</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide uppercase">
            Quản lý tài chính
          </p>
        </div>

        <nav className="mt-6 px-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar - Very clean */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 h-20 flex items-center justify-between px-10 flex-shrink-0 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-slate-800">
            {navItems.find((item) => item.path === location.pathname)?.label ||
              "Trang"}
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
