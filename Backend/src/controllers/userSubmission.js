const Problem = require('../models/problems.js')
const Submission = require('../models/submission.js')
const {getLanguageById, submitBatch, submitToken} = require('../utils/problemUtility.js')

const userSubmitCode = async (req, res)=>{

    try{

        const userId = req.result._id;
        const problemId = req.params.id;

        const {code, language} = req.body;

        if (!userId || !problemId || !language || typeof code !== 'string') {
            return res.status(400).send('Some fields are missing!');
        }

 
        //Changing Language!!

        // if(language==='cpp')
        //     language='c++'

        // console.log(language);

        //Fetch the problem from database

        const problem = await Problem.findById(problemId)


        if(!problem){                                                
            return res.status(404).send("Problem not found");
        }
        //Hidden test cases are the result of database call

        //pehle databse me store karwao code ko jo user de rahe he fhir Judge0 ko do and then jo result mile unke basis me databse update kro !! 
        //Good for times when Judge0 may not work so no user code is stored in history to store it first insert code inside DB and then give to Judge0 !


        const submittedResult = await Submission.create({

            userId,
            problemId,
            code,
            language,
            testCasesPassed: 0,
            status: 'pending',
            testCasesTotal:problem.hiddenTestCases.length

        })

        //  Judge0 code ko submit karna hai !

         const languageId = getLanguageById(language);

          const submissions = problem.hiddenTestCases.map((testcase)=>({
         
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
         }))

        const submitResult = await submitBatch(submissions);
        console.log(submitResult);

        const resultToken = submitResult.map((value)=> value.token);

        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let errorMessage = null;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';

        for (const test of testResult) {
          if (test.status_id == 3) {
            testCasesPassed++;
            runtime += parseFloat(test.time || 0);
            memory = Math.max(memory, test.memory || 0);
          }   
          else {
            if (status !== 'error') {
                status = (test.status_id == 4) ? 'error' : 'wrong';
            }
            errorMessage = test.stderr;
          }
        }

        // Store the Result 

        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();

        //probleId ko submit karenge useSchema ke problemSolved me agar already nahi ho to!

        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId);          //whole if to save that question in problemId
            await req.result.save();
        }

        res.status(201).send(submittedResult);

    }
    catch(err){
        res.status(500).send("internal Server Error "+err);
    
    }

}

const runCode = async (req,res)=>{

    try{

        const userId = req.result._id;
        const problemId = req.params.id;

        const {code, language} = req.body;

        if (!userId || !problemId || !language || typeof code !== 'string') {
            return res.status(400).send('Some fields are missing!');
        }

        //Fetch the problem from database

        const problem = await Problem.findById(problemId)
        if(!problem){                                                
            return res.status(404).send("Problem not found");
        }
        //Hidden test cases are the result of database call

        //pehle databse me store karwao code ko jo user de rahe he fhir Judge0 ko do and then jo result mile unke basis me databse update kro !! 
        //Good for times when Judge0 may not work so no user code is stored in history to store it first insert code inside DB and then give to Judge0 !


        const submittedResult = await Submission.create({

            userId,
            problemId,
            code,
            language,
            testCasesPassed: 0,
            status: 'pending',
            testCasesTotal:problem.hiddenTestCases.length

        })

        //  Judge0 code ko submit karna hai !

         const languageId = getLanguageById(language);

          const submissions = problem.visibleTestCases.map((testcase)=>({
         
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
         }))

        const submitResult = await submitBatch(submissions);
        console.log(submitResult);

        const resultToken = submitResult.map((value)=> value.token);

        const testResult = await submitToken(resultToken);


        res.status(201).send(testResult);

    }
    catch(err){
        res.status(500).send("internal Server Error "+err);
    
    }
   
}   
module.exports = {userSubmitCode, runCode};

