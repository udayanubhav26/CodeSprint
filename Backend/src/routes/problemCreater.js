const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware.js');
const {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, problemAllSolvedByUser, submittedProblem} = require('../controllers/userProblem.js');
const userMiddleware = require('../middleware/userMiddleware.js');
const { runCode } = require('../controllers/userSubmission.js');


const problemRouter = express.Router();



//Create

problemRouter.post('/create', adminMiddleware, createProblem);
problemRouter.put('/update/:id', adminMiddleware, updateProblem);
problemRouter.delete('/delete/:id', adminMiddleware, deleteProblem);

problemRouter.get('/problemById/:id', userMiddleware, getProblemById);
problemRouter.get('/getAllProblem', userMiddleware, getAllProblem);
problemRouter.get('/problemAllSolvedByUser', userMiddleware, problemAllSolvedByUser);
problemRouter.get('/submittedProblem/:pid', userMiddleware, submittedProblem);



//fetch 
//update
//delete

module.exports = problemRouter;