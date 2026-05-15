const User = require('../models/user.js');
const validator = require('../utils/validator.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis.js')


const register = async (req,res)=>{


    try{

        //Validate
        validator(req.body);

        const {firstName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10) //hash
        req.body.role = 'user'; //makes peaple to not be admin when they register  

        // const ans = User.exists({emailId}); //Optional cuz schema will already check this 

        const user = await User.create(req.body);
        const token = jwt.sign(
  {
    _id: user._id,
    emailId: emailId,
    role: user.role
  },
  process.env.JWT_KEY,
  { expiresIn: 60 * 60 }
)  //jwt token
        res.cookie('token', token, {maxAge: 60*60*1000})

        // res.cookie('token', token, {
        //    httpOnly: true,     // prevents JS access (security)
        //    secure: true,       // only HTTPS                         //use this to make cookie more secure
        //    sameSite: 'strict', // CSRF protection
        //    maxAge: 60 * 60 * 1000
        // })

         const reply = {
            _id : user._id,
            firstName : user.firstName,
            emailId : user.emailId,
            role: user.role
        }

        res.status(201).send({
            user: reply,
            message: "Sign Up Successfully!"
        })
    }
    catch(err){

         console.log(err);

        res.status(400).send("Error: "+err);

    }
}

const login = async (req,res)=>{

    try{
        const{emailId, password} = req.body;


        if(!emailId)
            throw new Error("Invalid Credentials!");

        if(!password)
            throw new Error("Invalid Credentials!");

        const user = await User.findOne({emailId});

        const match = await     bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials!!")

        const reply = {
            _id : user._id,
            firstName : user.firstName,
            emailId : user.emailId,
            role: user.role
        }

        const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60})  //jwt token
        res.cookie('token', token, {maxAge: 60*60*1000})
        res.status(201).json({
            user: reply,
            message: "Loggin Successfully!"
        })
    }
    catch(err){
        res.status(401).send("Invalid Credentials!!!")
    }
}

const logout = async (req,res)=>{

    try {

        //checking if user is Valid or not?!

            const {token} = req.cookies; //to get token keyword here!
    
            const payload = jwt.decode(token);
    
            await redisClient.set(`token:${token}`, "Blocked")
    
            await redisClient.expireAt(`token:${token}`, payload.exp); //initial to expires!
    

            res.cookie("token",null,{expires: new Date(Date.now())})
            res.send("Logged Out Sucessfully!")
    
        } catch (err) {
            res.status(503).json({ error: err.message });
        }
}

const adminRegister = async (req,res)=>{

     try{

        //Validate
        validator(req.body);

        const {firstName, emailId, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10) //hash
        req.body.role = 'admin'; //makes peaple to not be admin when they register  

        // const ans = User.exists({emailId}); //Optional cuz schema will already check this 

        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id, emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60})  //jwt token
        res.cookie('token', token, {maxAge: 60*60*1000})

        // res.cookie('token', token, {
        //    httpOnly: true,     // prevents JS access (security)
        //    secure: true,       // only HTTPS                         //use this to make cookie more secure
        //    sameSite: 'strict', // CSRF protection
        //    maxAge: 60 * 60 * 1000
        // })

        res.status(201).send('User Registered Sucessfully!')
    }
    catch(err){

        res.status(400).send("Error: "+err);

    }

}

const deleteProfile = async (req,res)=>{

    try{

        const userId = req.result._id;

        //userSchema
        user.findByIdAndDelete(userId);
    
        //submission se bhi delete kar do!

        
        await Submission.deleteMany({userId});

        res.status(200).send("Deleted Sucessfully!");

    }
    catch(err){

        res.status(500).send("internet Server Error!")

    }
}

module.exports = { register, login, logout, adminRegister, deleteProfile }