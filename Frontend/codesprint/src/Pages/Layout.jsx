import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../authSlice";
import { Settings } from "lucide-react";


function Layout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navItems = [
  { name: "Home", path: "/" },
  { name: "Problems", path: "/problems" },
  { name: "Quiz", path: "/quiz" },
  { name: "Assistant", path: "/assistant" },
  { name: "About", path: "/about" },
];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* NAVBAR (ONLY ONCE HERE) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 border-b border-gray-800 bg-black/40 backdrop-blur-md">

        {/* LOGO */}
        <div className="text-xl font-bold">
          Code<span className="text-purple-500">Sprint</span>
        </div>

        {/* NAV LINKS */}
        <nav className="flex gap-8 text-sm text-gray-300 relative">
  {navItems.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `relative px-2 py-1 transition-all duration-200 ${
          isActive ? "text-white" : "text-gray-400 hover:text-white"
        }`
      }
    >
      {item.name}

      {/* 🔥 ACTIVE BAR */}
      <span
        className={`
          absolute left-0 -bottom-1 h-[2px] bg-purple-500 rounded-full
          transition-all duration-300
          ${location.pathname === item.path ? "w-full" : "w-0"}
        `}
      />
    </NavLink>
  ))}
</nav>

        {/* SETTINGS */}
        <div className="relative">

          <div
  onClick={() => setOpen(!open)}
  className="cursor-pointer p-2 rounded-full border-2 border-black/40 hover:border-purple-800 transition"
>
  <Settings size={18} className="text-gray-300 hover:text-white" />
</div>

          {open && (
            <div className="absolute right-0 mt-3 w-52 bg-black/90 border border-gray-700 rounded-sm shadow-lg">

              <div className="p-3 border-b border-gray-700">
  <p className="text-sm font-semibold text-white">
    {user?.firstName} {user?.lastName}
  </p>

  <p className="text-xs text-gray-400 truncate pt-2">
    {user?.emailId}
  </p>
</div>

              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-purple-400
                  "
                >
                  Admin Panel
                </button>
              )}

              

              <button
  onClick={() => setShowLogoutModal(true)}
  className="w-full text-left px-3 py-2 hover:bg-gray-800 text-red-400"
>
  Logout
</button>

            </div>
          )}

        </div>

      </header>

     {showLogoutModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">

    <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-purple-900/40 bg-[#0a0a0a] shadow-[0_0_40px_rgba(168,85,247,0.15)]">

      {/* GLOW EFFECT */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative p-8 text-center">

        {/* ICON */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10">
          <Settings className="text-purple-400" size={28} />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Confirm Logout
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Are you sure you want to logout from{" "}
          <span className="text-purple-400 font-medium">
            CodeSprint
          </span>
          ?
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">

          <button
            onClick={() => setShowLogoutModal(false)}
            className="px-5 py-2.5 rounded-2xl border border-gray-700 bg-[#111111] text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 font-bold"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              dispatch(logoutUser());
              setShowLogoutModal(false);
              setOpen(false);
            }}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/30 transition-all duration-200 font-bold"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  </div>
)}
      

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;