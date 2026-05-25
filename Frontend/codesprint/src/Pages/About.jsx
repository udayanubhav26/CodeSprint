import {
  Mail,
  Phone,
  Code2,
  Globe,
  GraduationCap,
  Sparkles,
  Laptop,
  Brain,
} from "lucide-react";
import logo from "../assets/CodeSprint2.png";

function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-28">

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto">

        {/* HERO SECTION */}
<div className="relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#111111] p-10 shadow-[0_0_60px_rgba(168,85,247,0.08)]">

  {/* GLOW */}
  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent pointer-events-none" />

  <div className="relative flex flex-col lg:flex-row items-center gap-10">

    {/* LOGO */}
    <div className="flex flex-col items-center">

      <div className="h-36 w-36 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] border border-purple-500/40">
      <img
        src={logo}
        alt="CodeSprint"
        className="h-full w-full object-cover"
      />
    </div>

      <div className="mt-5 text-center">
        <h1 className="text-4xl font-bold">
          Code<span className="text-purple-500">Sprint</span>
        </h1>

        <p className="text-gray-400 mt-2">
          Official Support & Development Team
        </p>
      </div>

    </div>

    {/* ABOUT */}
    <div className="flex-1">

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold mb-6">
        <Sparkles size={16} />
        About CodeSprint
      </div>

      <p className="text-gray-300 leading-8 text-[15px]">
        <span className="text-purple-400 font-semibold">
          CodeSprint
        </span>{" "}
        is a modern coding platform focused on helping developers improve
        their problem-solving skills, practice DSA, and prepare for coding
        interviews with an immersive and futuristic experience.
      </p>

      <p className="text-gray-300 leading-8 text-[15px] mt-5">
        Our mission is to combine powerful coding tools, AI assistance,
        clean UI/UX, and competitive programming features into one
        seamless platform for students and developers.
      </p>

      <div className="flex flex-wrap gap-3 mt-6">

        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          AI Powered
        </div>

        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          DSA Practice
        </div>

        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          Modern UI
        </div>

        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
          Competitive Coding
        </div>

      </div>

    </div>

  </div>
</div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* CONTACT CARD */}
          <div className="rounded-3xl border border-gray-800 bg-[#111111] p-7">

            <div className="flex items-center gap-3 mb-6">
              <Mail className="text-purple-400" size={22} />
              <h2 className="text-2xl font-bold">
                Contact Information
              </h2>
            </div>

            <div className="space-y-5">

              <div className="flex items-start gap-4">
                <Mail className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium break-all">
                    <a href='https://mail.google.com/mail/?view=cm&fs=1&to=codesprintsupport@gmail.com' target="_blank">codesprintsupport@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Mobile</p>
                  <p className="text-white font-medium">
                    +91 9302158097
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Country</p>
                  <p className="text-white font-medium">
                    India
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* EDUCATION CARD */}
          <div className="rounded-3xl border border-gray-800 bg-[#111111] p-7">

            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-purple-400" size={22} />
              <h2 className="text-2xl font-bold">
                Education
              </h2>
            </div>

            <div className="space-y-5">

              <div className="flex items-start gap-4">
                <GraduationCap className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Degree</p>
                  <p className="text-white font-medium">
                    B.Tech in Computer Science
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Laptop className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">College</p>
                  <p className="text-white font-medium">
                    Annie Institute of Technology
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Code2 className="text-purple-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-400 text-sm">Current Focus</p>
                  <p className="text-white font-medium">
                    MERN Stack • DSA • AI Integration
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        
        {/* PROJECT */}
        <div className="mt-10 rounded-3xl border border-gray-800 bg-[#111111] p-8">

          <div className="flex items-center gap-3 mb-6">
            <Code2 className="text-purple-400" size={24} />
            <h2 className="text-3xl font-bold">
              CodeSprint
            </h2>
          </div>

          <p className="text-gray-300 leading-8">
            CodeSprint is a modern coding platform designed for practicing DSA,
            solving coding problems, AI-assisted learning, and improving
            programming skills with an immersive dark-themed experience.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mt-8">

            <div className="rounded-2xl border border-gray-800 bg-[#0a0a0a] p-5">
              <h3 className="text-purple-400 font-bold text-lg mb-2">
                AI Assistance
              </h3>
              <p className="text-gray-400 text-sm leading-7">
                Integrated CodeSprint AI for hints, debugging help,
                and explanations.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0a0a0a] p-5">
              <h3 className="text-purple-400 font-bold text-lg mb-2">
                Modern UI
              </h3>
              <p className="text-gray-400 text-sm leading-7">
                Purple-black futuristic interface inspired by modern coding tools.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0a0a0a] p-5">
              <h3 className="text-purple-400 font-bold text-lg mb-2">
                Competitive Coding
              </h3>
              <p className="text-gray-400 text-sm leading-7">
                Practice coding problems with submissions, history,
                and live execution.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default About;