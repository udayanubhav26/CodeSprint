const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility.js');
const Problem = require('../models/problems.js');
const User = require('../models/user.js');
const Submission = require('../models/submission.js');

const createProblem = async (req,res)=>{


     const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;

     console.log(req.body);
     console.log(referenceSolution);

     try{

        for(const {language,completeCode} of referenceSolution){
            
         // source_code
         // language
         // stdin
         // expectedOutput

         const languageId = getLanguageById(language);


         const submissions = visibleTestCases.map((testcase)=>({
         
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
         }))

         const submitResult = await submitBatch(submissions);
         console.log(submitResult);

         const resultToken = submitResult.map((value)=> value.token);


        const testResult = await submitToken(resultToken)

        console.log(testResult);

        console.log(JSON.stringify(testResult, null, 2));

        for(const test of testResult){
            if(test.status.id !== 3){
               console.log("FAILED TEST:", test);   // 👈 debug
               return res.status(400).send("Error Occured!");
            }
        }


      }

      //Now we can store this in our database!

      await Problem.create({
  title,
  description,
  difficulty,
  tags,                                 //Change it later if u want 
  visibleTestCases,                     
  hiddenTestCases,                     
  startCode,                            
  referenceSolution,
  problemCreator: req.result._id
});

// await Problem.create({
//   ...req.body,
//   problemCreator: req.result._id
// });

      res.status(201).send("Problem Saved Successfully!!");

         

     }
     catch (err) {
  console.log("🔥 ERROR:", err);
  res.status(500).json({
    message: err.message,
    error: err
  });
}
      
}

const updateProblem = async (req,res)=>{

   const {id} = req.params

   const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;

    try{

      if(!id){
         return res.status(404).send("Missing Id!")
      }

      const DsaProblem = await Problem.findById(id)

      if(!DsaProblem){
         return res.status(404).send("ID is not present in Database!")
      }

        for(const {language,completeCode} of referenceSolution){
            
         // source_code
         // language
         // stdin
         // expectedOutput

         const languageId = getLanguageById(language);


         const submissions = visibleTestCases.map((testcase)=>({
         
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
         }))

         const submitResult = await submitBatch(submissions);
         console.log(submitResult);

         const resultToken = submitResult.map((value)=> value.token);


        const testResult = await submitToken(resultToken)

        console.log(testResult);

        console.log(JSON.stringify(testResult, null, 2));

        for(const test of testResult){
            if(test.status.id !== 3){
               console.log("FAILED TEST:", test);   // 👈 debug
               return res.status(400).send("Error Occured!");
            }
        }


      }

      //Now we update!

      const newProblem = await Problem.findByIdAndUpdate(
  id,
  {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,                       //Change it later if u want
    hiddenTestCases,
    startCode,
    referenceSolution
  },
  { runValidators: true, new: true }
);

await Problem.findByIdAndUpdate(id, {...req.body},{runvalidators:true, new:true})
     
      res.status(200).send("Problem Saved Successfully!!");

     }
     catch(err){
      
      res.status(404).send("Error: "+err);

     }

}

const deleteProblem = async (req,res)=>{

   const {id} = req.params;

   try{

      if(!id){
         return res.status(404).send('Error Id is Missing!');
      }

      const deletedProblem = await Problem.findByIdAndDelete(id);

      if(!deletedProblem){
         return res.status(404).send('Problem is Missing in Database!');
      }

      res.status(200).send("Succesfully Deleted!!");

   }
   catch(err){

      res.status(500).send("Error: "+err);

   }

}

const getProblemById = async (req,res)=>{

   const {id} = req.params;

   try{

      if(!id){
         return res.status(404).send('Error Id is Missing!');
      }

      const getProblem = await Problem.findById(id).select('_id title description tags difficulty visibleTestCases startCode referenceSolution');


      if(!getProblem){
         return res.status(404).send('Problem is Missing in Database!');
      }

      res.status(200).send(getProblem);

   }
   catch(err){

      res.status(500).send("Error: "+err);

   }


}

const getAllProblem = async (req,res)=>{


   try{

      const getProblem = await Problem.find({}).select('_id title tags difficulty');
;


      if(getProblem.length==0){
         return res.status(404).send('Problem is Missing in Database!');
      }

      res.status(200).json(getProblem);

   }
   catch(err){

      res.status(500).send("Error: "+err);

   }


}

const problemAllSolvedByUser = async (req,res)=>{

      try{

         const userId = req.result._id; //<--get userId

         const user = await User.findById(userId).populate({ //<--populate and give particulatar info by fetching them

            path: "problemSolved",
            select: "_id title difficulty tags"                                                            

         });

         // const count = req.result.problemSolved.length;
         res.status(200).send(user.problemSolved);

      }
      catch(err){
         res.status(500).send("Server Error!");
      }

   }
const submittedProblem = async (req,res)=>{

   try{

      const userId = req.result._id;

      const problemId = req.params.pid;

      const ans = await Submission.find({
         userId,
         problemId
      });

      return res.status(200).json(ans);

   }
   catch(err){

      console.log(err);

      return res.status(500).send("Internal Server Error");

   }
}


module.exports = {createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, problemAllSolvedByUser, submittedProblem };