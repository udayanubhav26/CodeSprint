import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient.js';
import { useNavigate } from 'react-router';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
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
      ]
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

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-emerald-500 to-green-600 text-transparent bg-clip-text">
          Create New Problem
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

          {/* BASIC INFO */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-emerald-500">
              Basic Information
            </h2>

            <div className="space-y-4">

              <input
                {...register('title')}
                placeholder="Title"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition"
              />
              {errors.title && <p className="text-red-400">{errors.title.message}</p>}

              <textarea
                {...register('description')}
                placeholder="Description"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 h-32 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition"
              />
              {errors.description && <p className="text-red-400">{errors.description.message}</p>}

              <div className="flex gap-4">

                <select
                  {...register('difficulty')}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <select
                  {...register('tags')}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>

              </div>
            </div>
          </div>

          {/* TEST CASES */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-emerald-500">
              Test Cases
            </h2>

            {/* VISIBLE */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Visible Test Cases</h3>

                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm"
                >
                  Add Visible
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 mb-4"
                >

                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2 mb-2"
                  />

                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Output"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2 mb-2"
                  />

                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="mt-2 px-3 py-1 bg-red-500 rounded-lg text-xs"
                  >
                    Remove
                  </button>

                </div>
              ))}
            </div>

            {/* HIDDEN */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Hidden Test Cases</h3>

                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm"
                >
                  Add Hidden
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-[#0d1117] border border-gray-800 rounded-xl p-4 mb-4"
                >

                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2 mb-2"
                  />

                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-2"
                  />

                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="mt-2 px-3 py-1 bg-red-500 rounded-lg text-xs"
                  >
                    Remove
                  </button>

                </div>
              ))}
            </div>
          </div>

          {/* CODE TEMPLATES (UNCHANGED FULL FEATURE) */}
          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-emerald-500">
              Code Templates
            </h2>

            {[0, 1, 2].map((index) => (
              <div key={index} className="mb-8">

                <h3 className="font-semibold mb-3">
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                </h3>

                <textarea
                  {...register(`startCode.${index}.initialCode`)}
                  placeholder="Initial Code"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3 mb-3"
                  rows={6}
                />

                <textarea
                  {...register(`referenceSolution.${index}.completeCode`)}
                  placeholder="Reference Solution"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-xl px-4 py-3"
                  rows={6}
                />

              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-lg shadow-xl"
          >
            Create Problem
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminPanel;