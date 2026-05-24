import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { useNavigate } from "react-router-dom";

function Homepage() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  console.log(user);
  console.log("Homepage rendered");

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
    

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemAllSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' ||
      solvedProblems.some(sp => sp._id === problem._id);

    return difficultyMatch && tagMatch && statusMatch;
  });

 if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d1117]">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      

      {/* MAIN CONTENT */}
      <div className="container mx-auto p-4 pt-24">

        {/* FILTERS */}
        <div className="flex justify-center gap-4 mb-6">

          <select
            className="select bg-black border border-gray-700 text-white hover:border-purple-500 rounded-3xl"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select
            className="select bg-black border border-gray-700 text-white hover:border-purple-500 rounded-3xl"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select bg-black border border-gray-700 text-white hover:border-purple-500 rounded-3xl"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>

        </div>

        {/* PROBLEM LIST */}
        <div className="grid gap-4">

          {filteredProblems.map(problem => (
            <div
              key={problem._id}
              className="bg-black/40 border border-gray-800 hover:border-purple-500 rounded-xl p-4 transition-all duration-200"
            >

              <div className="flex items-center">

                <h2 className="text-lg font-semibold">
                  <NavLink to={`/problem/${problem._id}`} className="hover:text-purple-400">
                    {problem.title}
                  </NavLink>
                </h2>

                {solvedProblems.some(sp => sp._id === problem._id) && (
                  <div className="ml-3 text-green-400 text-sm">
                    ✔ Solved
                  </div>
                )}

                <div className="ml-auto flex gap-2">

                  <div className={`${getDifficultyBadgeColor(problem.difficulty)} px-4 rounded-full text-sm font-semibold`}>
                    {problem.difficulty}
                  </div>

                  <div className="px-4 rounded-full text-sm bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {problem.tags}
                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* LOGOUT MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="bg-black border border-gray-700 rounded-xl p-6 w-80 text-center">

              <div className="text-2xl mb-2">⚠️</div>

              <h2 className="text-white text-xl font-bold">
                Confirm Logout
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Are you sure you want to logout?
              </p>

              <div className="flex justify-center gap-3 mt-6">

                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 text-white hover:border-purple-500"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    dispatch(logoutUser());
                    setSolvedProblems([]);
                    setShowLogoutModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white"
                >
                  Logout
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/10 text-green-400 border border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30';
    case 'hard':
      return 'bg-red-500/10 text-red-400 border border-red-500/30';
    default:
      return 'bg-gray-700 text-white';
  }
};

export default Homepage;