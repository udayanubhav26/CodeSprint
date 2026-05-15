import ChatAi from "../components/ChatAi";
import { Sparkles } from "lucide-react";

function Assistant() {

  // Dummy problem data so AI component works
  const dummyProblem = {
    title: "General Coding Assistant",
    description:
      "You are helping users with coding, debugging, DSA, web development, and programming concepts.",
    visibleTestCases: [],
    startCode: []
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-6">

        <div className="flex items-center gap-3">

          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30">
            <Sparkles className="text-purple-400" size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              CodeSprint AI
            </h1>

            <p className="text-gray-400 mt-1">
              Your personal AI coding assistant
            </p>
          </div>

        </div>

      </div>

      {/* AI CHAT */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-180px)]">

        <ChatAi problem={dummyProblem} />

      </div>

    </div>
  );
}

export default Assistant;