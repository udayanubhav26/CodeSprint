import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0d1117]">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0d1117]">
        <div className="alert alert-error shadow-lg w-fit">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text">
          Delete Problem
        </h1>
      </div>

      {/* TABLE CARD */}
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">

        <div className="overflow-x-auto">
          <table className="table w-full text-gray-300">

            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {problems.map((problem, index) => (
                <tr
                  key={problem._id}
                  className="hover:bg-[#21262d] transition-all"
                >

                  <th>{index + 1}</th>

                  <td className="font-medium text-white">
                    {problem.title}
                  </td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      problem.difficulty === 'easy'
                        ? 'text-green-400 border-green-500/30 bg-green-500/10'
                        : problem.difficulty === 'medium'
                          ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
                          : 'text-red-400 border-red-500/30 bg-red-500/10'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>

                  <td>
                    <span className="px-3 py-1 rounded-full text-xs border border-purple-500/30 bg-purple-500/10 text-purple-300">
                      {problem.tags}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default AdminDelete;