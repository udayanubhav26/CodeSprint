import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import {
  Play,
  Send,
  BookOpen,
  FileCode,
  History,
  Sparkles
} from "lucide-react";

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeBottomTab, setActiveBottomTab] = useState('testcase');
  const [bottomHeight, setBottomHeight] = useState(280);

  // NEW: left panel width in percent
  const [leftWidthPercent, setLeftWidthPercent] = useState(50);

  const editorRef = useRef(null);
  const containerRef = useRef(null); // NEW: ref on the outer flex container

  const { id } = useParams();

  // FETCH PROBLEM
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/problemById/${id}`);
        const data = response.data;
        setProblem(data);
        const starterCode =
          data?.startCode?.find(
            (sc) => sc.language === langMap[selectedLanguage]
          )?.initialCode || "// No starter code available";
        setCode(starterCode);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProblem();
  }, [id]);

  // CHANGE LANGUAGE CODE
  useEffect(() => {
    if (!problem) return;
    const starterCode =
      problem?.startCode?.find(
        (sc) => sc.language === langMap[selectedLanguage]
      )?.initialCode || "// No starter code";
    setCode(starterCode);
  }, [selectedLanguage, problem]);

  // RUN CODE
  const handleRun = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language: selectedLanguage
      });
      setRunResult(response.data);
      setActiveBottomTab('testcase');
    } catch (error) {
      console.log(error);
      setRunResult({ success: false, error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // SUBMIT CODE
  const handleSubmitCode = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.post(`/submission/submit/${id}`, {
        code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setActiveBottomTab('result');

    } catch (error) {
      console.log(error);
      setSubmitResult({ accepted: false, error: "Submission failed" });
    } finally {
      setLoading(false);
    }
  };

  // MONACO LANGUAGE
  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      default: return 'javascript';
    }
  };

  // DIFFICULTY COLOR
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  // VERTICAL RESIZE (bottom panel)
  const startResizingVertical = (e) => {
    const startY = e.clientY;
    const startHeight = bottomHeight;

    const onMouseMove = (moveEvent) => {
      const newHeight = startHeight - (moveEvent.clientY - startY);
      if (newHeight > 180 && newHeight < 600) {
        setBottomHeight(newHeight);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // HORIZONTAL RESIZE (left / right panels)  ← NEW
  const startResizingHorizontal = (e) => {
    e.preventDefault();
    const containerWidth = containerRef.current?.getBoundingClientRect().width || window.innerWidth;
    const startX = e.clientX;
    const startPercent = leftWidthPercent;

    const onMouseMove = (moveEvent) => {
      const deltaPx = moveEvent.clientX - startX;
      const deltaPercent = (deltaPx / containerWidth) * 100;
      const newPercent = startPercent + deltaPercent;
      // clamp between 20% and 80%
      if (newPercent >= 20 && newPercent <= 80) {
        setLeftWidthPercent(newPercent);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // LOADING
  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d1117]">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  // NOT FOUND
  if (!problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d1117] text-white text-2xl">
        Problem Not Found
      </div>
    );
  }

  return (
    // attach ref to the outermost flex container
    <div ref={containerRef} className="h-screen flex bg-[#0a0a0a] text-white overflow-hidden">

      {/* LEFT PANEL — width driven by state */}
      <div
        style={{ width: `${leftWidthPercent}%` }}
        className="flex-shrink-0 border-r border-gray-700 flex flex-col bg-[#111827]"
      >

        {/* TOP */}
        <div className="p-5 border-b border-gray-700 bg-[#0a0a0a]">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{problem?.title}</h1>
            <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${getDifficultyColor(problem?.difficulty)}`}>
              {problem?.difficulty}
            </div>
            <div className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm">
              {problem?.tags}
            </div>
          </div>
        </div>

        {/* LEFT TABS */}
        <div className="flex gap-2 p-3 border-b border-gray-800 bg-[#111827] overflow-x-auto">
          <button
            onClick={() => setActiveLeftTab('description')}
            className={`btn btn-sm rounded-xl ${activeLeftTab === 'description' ? 'btn-primary' : 'btn-ghost text-gray-300'}`}
          >
            <BookOpen size={16} /> Description
          </button>
          <button
            onClick={() => setActiveLeftTab('solutions')}
            className={`btn btn-sm rounded-xl ${activeLeftTab === 'solutions' ? 'btn-primary' : 'btn-ghost text-gray-300'}`}
          >
            <FileCode size={16} /> Solutions
          </button>
          <button
            onClick={() => setActiveLeftTab('submissions')}
            className={`btn btn-sm rounded-xl ${activeLeftTab === 'submissions' ? 'btn-primary' : 'btn-ghost text-gray-300'}`}
          >
            <History size={16} /> Submissions
          </button>
          <button
            onClick={() => setActiveLeftTab('chatAI')}
            className={`btn btn-sm rounded-xl ${activeLeftTab === 'chatAI' ? 'btn-primary' : 'btn-ghost text-gray-300'}`}
          >
            <Sparkles size={16} /> AI Chat
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* DESCRIPTION */}
          {activeLeftTab === 'description' && (
            <div>
              <div className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-6 leading-8 text-gray-300 shadow-xl">
                <p className="whitespace-pre-wrap">{problem?.description}</p>
              </div>

              {/* TESTCASES */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-5">Example Testcases</h2>
                <div className="space-y-5">
                  {problem?.visibleTestCases?.map((test, index) => (
                    <div key={index} className="bg-[#0a0a0a] border border-gray-700 rounded-2xl p-5 shadow-lg">
                      <div className="font-semibold text-lg mb-4 text-purple-700">Example {index + 1}</div>
                      <div className="space-y-4 text-sm">
                        <div>
                          <div className="text-gray-400 mb-1">Input</div>
                          <pre className="bg-[#1b1b2e] p-3 rounded-xl overflow-x-auto text-green-300">{test?.input}</pre>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Output</div>
                          <pre className="bg-[#1b1b2e] p-3 rounded-xl overflow-x-auto text-blue-300">{test?.output}</pre>
                        </div>
                        <div>
                          <div className="text-gray-400 mb-1">Explanation</div>
                          <pre className="bg-[#1b1b2e] p-3 rounded-xl overflow-x-auto text-gray-300 whitespace-pre-wrap">{test?.explanation}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SOLUTIONS */}
          {activeLeftTab === 'solutions' && (
            <div className="space-y-6">
              {problem?.referenceSolution?.map((solution, index) => (
                <div key={index} className="border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="bg-[#0a0a0a] px-5 py-3 font-semibold text-purple-300 border-b border-gray-800">
                    {solution?.language}
                  </div>
                  <pre className="bg-[#0a0a0a] p-5 overflow-x-auto text-sm">
                    <code>{solution?.completeCode}</code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* SUBMISSIONS */}
          {activeLeftTab === 'submissions' && <SubmissionHistory problemId={id} />}

          {/* CHAT AI */}
          {activeLeftTab === 'chatAI' && <ChatAi problem={problem}/>}

        </div>
      </div>

      {/* ── HORIZONTAL DRAG HANDLE ── NEW */}
      <div
        onMouseDown={startResizingHorizontal}
        className="w-1.5 flex-shrink-0 cursor-col-resize bg-gray-700 hover:bg-purple-500 active:bg-purple-400 transition-colors duration-150"
        title="Drag to resize"
      />

      {/* RIGHT PANEL — takes remaining space */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#0a0a0a]">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-[#0a0a0a]">

          {/* LANGUAGES */}
          <div className="flex gap-2">
            {['javascript', 'java', 'cpp'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedLanguage === lang
                    ? 'bg-cyan-500/10  border border-cyan-700/30 text-cyan-400 shadow-lg'
                    : 'bg-[#0a0a0a] text-gray-300 border border-[#0a0a0a] hover:border-cyan-800'
                }`}
              >
                {lang === 'cpp' ? 'C++' : lang === 'java' ? 'Java' : 'JavaScript'}
              </button>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-xl  bg-green-500/10 text-yellow-400 border border-yellow-700/30  hover:bg-yellow-400/30 transition-all"
              onClick={handleRun}
            >
              <Play size={16} />
              {loading ? "Running..." : "Run"}
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-700/30 hover:bg-green-400/30 font-semibold transition-all"
              onClick={handleSubmitCode}
            >
              <Send size={16} />
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* EDITOR */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={getLanguageForMonaco(selectedLanguage)}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={(editor) => editorRef.current = editor}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              fontFamily: "Fira Code",
              padding: { top: 20 }
            }}
          />
        </div>

        {/* VERTICAL DRAG HANDLE (bottom panel) */}
        <div
          onMouseDown={startResizingVertical}
          className="h-1.5 cursor-row-resize bg-gray-700 hover:bg-purple-500 active:bg-purple-400 transition-colors duration-150"
        />

        {/* BOTTOM PANEL */}
        <div
          style={{ height: `${bottomHeight}px` }}
          className="border-t border-gray-800 bg-[#0a0a0a] flex flex-col"
        >
          {/* TABS */}
          <div className="flex border-b border-gray-800 flex-shrink-0">
            <button
              className={`px-5 py-3 text-sm font-medium ${
                activeBottomTab === 'testcase'
                  ? 'border-b-2 border-purple-500 text-white'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveBottomTab('testcase')}
            >
              Testcases
            </button>
            <button
              className={`px-5 py-3 text-sm font-medium ${
                activeBottomTab === 'result'
                  ? 'border-b-2 border-green-500 text-white'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveBottomTab('result')}
            >
              Result
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-5 overflow-y-auto flex-1">

            {/* TESTCASE */}
            {activeBottomTab === 'testcase' && (
              <>
                {!runResult ? (
                  <div className="text-gray-500 flex justify-center items-center h-full font-bold">
                    Run your code to see testcase results
                  </div>
                ) : (
                  <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5">
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-gray-300">
                      {JSON.stringify(runResult, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}

            {/* RESULT */}
            {activeBottomTab === 'result' && (
              <>
                {!submitResult ? (
                  <div className="text-gray-500 flex justify-center items-center h-full font-bold">
                    Submit your code to see results
                  </div>
                ) : (
                  <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-5">
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-gray-300">
                      {JSON.stringify(submitResult, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemPage;
