import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient.js';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';

// SAME SCHEMA
const problemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string()
    })
  ),
  hiddenTestCases: z.array(
    z.object({
      input: z.string(),
      output: z.string()
    })
  ),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string()
    })
  ),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string()
    })
  )
});

function UpdateProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ],
      visibleTestCases: [],
      hiddenTestCases: []
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  // FETCH EXISTING DATA
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/problem/problemById/${id}`);
        reset(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, reset]);

  // SUBMIT UPDATE
  const onSubmit = async (data) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, data);
      alert("Problem updated successfully");
      navigate("/");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">
          Update Problem
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

          {/* BASIC INFO */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-yellow-600">
              Basic Information
            </h2>

            <input
              {...register("title")}
              placeholder="Title"
              className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 mb-4"
            />

            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 h-32"
            />

            <div className="flex gap-4 mt-4">

              <select
                {...register("difficulty")}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select
                {...register("tags")}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3"
              >
                <option value="array">Array</option>
                <option value="linkedList">Linked List</option>
                <option value="graph">Graph</option>
                <option value="dp">DP</option>
              </select>

            </div>
          </div>

          {/* TEST CASES */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-xl">

            <h2 className="text-2xl font-bold mb-6 text-yellow-600">
              Test Cases
            </h2>

            {/* visible */}
            <div className="mb-10">
              <div className="flex justify-between mb-4">
                <h3>Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
                >
                  Add
                </button>
              </div>

              {visibleFields.map((f, i) => (
                <div key={f.id} className="bg-[#0d1117] border border-gray-800 p-4 rounded-xl mb-3">

                  <input
                    {...register(`visibleTestCases.${i}.input`)}
                    placeholder="Input"
                    className="w-full mb-2 bg-[#0d1117] border border-gray-700 rounded-xl px-3 py-2"
                  />

                  <input
                    {...register(`visibleTestCases.${i}.output`)}
                    placeholder="Output"
                    className="w-full mb-2 bg-[#0d1117] border border-gray-700 rounded-xl px-3 py-2"
                  />

                  <textarea
                    {...register(`visibleTestCases.${i}.explanation`)}
                    placeholder="Explanation"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeVisible(i)}
                    className="mt-2 bg-red-500 px-2 py-1 rounded"
                  >
                    Remove
                  </button>

                </div>
              ))}
            </div>

            {/* hidden */}
            <div>
              <div className="flex justify-between mb-4">
                <h3>Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
                >
                  Add
                </button>
              </div>

              {hiddenFields.map((f, i) => (
                <div key={f.id} className="bg-[#0d1117] border border-gray-800 p-4 rounded-xl mb-3">

                  <input
                    {...register(`hiddenTestCases.${i}.input`)}
                    placeholder="Input"
                    className="w-full mb-2 bg-[#0d1117] border border-gray-700 rounded-xl px-3 py-2"
                  />

                  <input
                    {...register(`hiddenTestCases.${i}.output`)}
                    placeholder="Output"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeHidden(i)}
                    className="mt-2 bg-red-500 px-2 py-1 rounded"
                  >
                    Remove
                  </button>

                </div>
              ))}
            </div>

          </div>

          {/* CODE */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-xl">

            <h2 className="text-2xl font-bold mb-6 text-yellow-600">
              Code Templates
            </h2>

            {[0,1,2].map(i => (
              <div key={i} className="mb-6">

                <h3 className="mb-2 text-gray-300">
                  {i === 0 ? "C++" : i === 1 ? "Java" : "JavaScript"}
                </h3>

                <textarea
                  {...register(`startCode.${i}.initialCode`)}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl p-3 mb-3"
                  rows={5}
                />

                <textarea
                  {...register(`referenceSolution.${i}.completeCode`)}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl p-3"
                  rows={5}
                />

              </div>
            ))}

          </div>

          {/* BUTTON */}
          <button className="w-full py-4 bg-yellow-600 hover:bg-yellow-700 rounded-xl font-bold">
            Update Problem
          </button>

        </form>

      </div>
    </div>
  );
}

export default UpdateProblem;