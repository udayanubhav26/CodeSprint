const express = require('express');

const submitRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware.js');
const {userSubmitCode, runCode} = require('../controllers/userSubmission.js')

submitRouter.post("/submit/:id", userMiddleware, userSubmitCode);
submitRouter.post('/run/:id', userMiddleware, runCode);


module.exports = submitRouter;