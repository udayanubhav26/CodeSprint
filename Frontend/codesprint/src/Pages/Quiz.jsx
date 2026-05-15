import { useState } from "react";

const questions = [
  {
    question: "What data structure uses LIFO order?",
    options: [
      { text: "Queue", correct: false },
      { text: "Stack", correct: true },
      { text: "Tree", correct: false },
      { text: "Graph", correct: false },
    ],
  },
  {
    question: "What is the time complexity of binary search?",
    options: [
      { text: "O(n)", correct: false },
      { text: "O(log n)", correct: true },
      { text: "O(n log n)", correct: false },
      { text: "O(1)", correct: false },
    ],
  },
  {
    question: "Which data structure uses FIFO order?",
    options: [
      { text: "Stack", correct: false },
      { text: "Queue", correct: true },
      { text: "Heap", correct: false },
      { text: "Tree", correct: false },
    ],
  },
  {
    question: "Which traversal is used in BFS?",
    options: [
      { text: "Stack", correct: false },
      { text: "Queue", correct: true },
      { text: "Recursion", correct: false },
      { text: "Heap", correct: false },
    ],
  },
  {
    question: "What is worst case time complexity of Quick Sort?",
    options: [
      { text: "O(n log n)", correct: false },
      { text: "O(log n)", correct: false },
      { text: "O(n^2)", correct: true },
      { text: "O(n)", correct: false },
    ],
  },
  {
    question: "Which data structure is used in recursion?",
    options: [
      { text: "Queue", correct: false },
      { text: "Stack", correct: true },
      { text: "Array", correct: false },
      { text: "Graph", correct: false },
    ],
  },
  {
    question: "Which of the following is a linear data structure?",
    options: [
      { text: "Tree", correct: false },
      { text: "Graph", correct: false },
      { text: "Array", correct: true },
      { text: "Heap", correct: false },
    ],
  },
  {
    question: "Which algorithm is used for shortest path?",
    options: [
      { text: "DFS", correct: false },
      { text: "BFS", correct: false },
      { text: "Dijkstra", correct: true },
      { text: "Merge Sort", correct: false },
    ],
  },
  {
    question: "What is space complexity of merge sort?",
    options: [
      { text: "O(1)", correct: false },
      { text: "O(n)", correct: true },
      { text: "O(log n)", correct: false },
      { text: "O(n log n)", correct: false },
    ],
  },
  {
    question: "Which data structure is used for BFS traversal?",
    options: [
      { text: "Stack", correct: false },
      { text: "Queue", correct: true },
      { text: "Heap", correct: false },
      { text: "Tree", correct: false },
    ],
  },
  {
    question: "Which is not a linear data structure?",
    options: [
      { text: "Array", correct: false },
      { text: "Linked List", correct: false },
      { text: "Tree", correct: true },
      { text: "Stack", correct: false },
    ],
  },
  {
    question: "Best case time complexity of Bubble Sort?",
    options: [
      { text: "O(n)", correct: true },
      { text: "O(n^2)", correct: false },
      { text: "O(log n)", correct: false },
      { text: "O(1)", correct: false },
    ],
  },
  {
    question: "Which data structure uses hashing?",
    options: [
      { text: "HashMap", correct: true },
      { text: "Stack", correct: false },
      { text: "Queue", correct: false },
      { text: "Tree", correct: false },
    ],
  },
  {
    question: "Which traversal is used in DFS?",
    options: [
      { text: "Queue", correct: false },
      { text: "Stack / Recursion", correct: true },
      { text: "Heap", correct: false },
      { text: "Array", correct: false },
    ],
  },
  {
    question: "What is the height of a balanced binary tree?",
    options: [
      { text: "O(n)", correct: false },
      { text: "O(log n)", correct: true },
      { text: "O(n log n)", correct: false },
      { text: "O(1)", correct: false },
    ],
  },
  {
    question: "Which sorting algorithm is stable?",
    options: [
      { text: "Quick Sort", correct: false },
      { text: "Merge Sort", correct: true },
      { text: "Selection Sort", correct: false },
      { text: "Heap Sort", correct: false },
    ],
  },
  {
    question: "Which data structure is best for LRU Cache?",
    options: [
      { text: "Stack + Queue", correct: false },
      { text: "HashMap + Doubly Linked List", correct: true },
      { text: "Array", correct: false },
      { text: "Tree", correct: false },
    ],
  },
  {
    question: "In binary tree, max number of children per node?",
    options: [
      { text: "1", correct: false },
      { text: "2", correct: true },
      { text: "3", correct: false },
      { text: "Unlimited", correct: false },
    ],
  },
  {
    question: "Which algorithm uses divide and conquer?",
    options: [
      { text: "Merge Sort", correct: true },
      { text: "Linear Search", correct: false },
      { text: "BFS", correct: false },
      { text: "Stack", correct: false },
    ],
  },
  {
    question: "Time complexity of accessing element in array?",
    options: [
      { text: "O(n)", correct: false },
      { text: "O(log n)", correct: false },
      { text: "O(1)", correct: true },
      { text: "O(n^2)", correct: false },
    ],
  },
];

const QuizPage = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (correct) => {
    if (correct) setScore((prev) => prev + 1);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 pt-20">

      {/* background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-blue-900 opacity-30 animate-gradient"></div>

      <div className="relative w-full max-w-2xl">

        {/* CARD */}
        <div className="bg-black/40 border border-gray-800 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:border-purple-500 transition">

          {finished ? (
            <div className="text-center animate-fadeIn">

              <h2 className="text-3xl font-bold text-purple-400 mb-4">
                Quiz Completed 🎉
              </h2>

              <p className="text-lg text-gray-300">
                Your Score:
              </p>

              <div className="text-4xl font-bold mt-3 text-white">
                {score} / {questions.length}
              </div>

              <button
                onClick={() => {
                  setCurrent(0);
                  setScore(0);
                  setFinished(false);
                }}
                className="mt-6 px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition hover:scale-105"
              >
                Restart Quiz
              </button>

            </div>
          ) : (
            <>
              {/* progress */}
              <div className="flex justify-between text-sm text-gray-400 mb-6">
                <span>Question {current + 1}</span>
                <span>{questions.length}</span>
              </div>

              {/* question */}
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                {questions[current].question}
              </h2>

              {/* options */}
              <div className="space-y-3">
                {questions[current].options.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(opt.correct)}
                    className="w-full text-left px-5 py-3 rounded-xl bg-black/30 border border-gray-700 hover:border-purple-500 hover:bg-purple-500/10 transition duration-200 hover:scale-[1.02]"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
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
};

export default QuizPage;