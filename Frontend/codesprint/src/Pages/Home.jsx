import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice";

function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* HEADER */}
      

      {/* HERO SECTION */}
      <main className="flex-1 flex items-center justify-center relative pt-24 overflow-hidden">

        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-blue-900 opacity-40 animate-gradient"></div>

        {/* Floating grid glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_60%)]"></div>

        {/* Content */}
        <div className="text-center z-10 animate-fadeIn">

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
            Code<span className="text-purple-500">Sprint</span>
          </h1>

          <p className="mt-5 text-gray-400 text-lg tracking-wide">
            Sharpen your coding skills. Solve. Compete. Build.
          </p>

          <button
            onClick={() => navigate("/problems")}
            className="mt-10 px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/40 hover:scale-105"
          >
            Start Solving
          </button>
        </div>
      </main>

      {/* ANIMATION STYLES */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }

          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientMove 10s ease infinite;
          }
        `}
      </style>

    </div>
  );
}

export default Home;