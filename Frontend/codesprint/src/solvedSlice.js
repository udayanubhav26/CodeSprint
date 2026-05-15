// solvedSlice.js
import { createSlice } from "@reduxjs/toolkit";

const solvedSlice = createSlice({
  name: "solved",
  initialState: {
    problems: []
  },
  reducers: {
    setSolvedProblems: (state, action) => {
      state.problems = action.payload;
    },
    clearSolvedProblems: (state) => {
      state.problems = [];
    }
  }
});

export const { setSolvedProblems, clearSolvedProblems } = solvedSlice.actions;
export default solvedSlice.reducer;