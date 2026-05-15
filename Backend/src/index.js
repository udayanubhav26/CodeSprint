const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const main = require('./config/db.js');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth.js');
const redisClient = require('./config/redis.js');
const problemRouter = require('./routes/problemCreater.js');
const submitRouter = require('./routes/submit.js');
const cors = require('cors');
const chatRouter = require('./routes/chat.js');

//Middleware

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//Code Starts!

app.use(express.json());  //parsing express json to js format
app.use(cookieParser());  //parsing cookies


//Routes

app.use('/user', authRouter); 
app.use('/problem', problemRouter); 
app.use('/submission',submitRouter);
app.use('/chat', chatRouter);  //For Ai

//Server Initialization

const PORT = process.env.PORT || 3000;

const InitializeConnection = async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB and Redis Connected!")

        app.listen(PORT, () => {
    console.log("Server running on port:", PORT);
});
    }
    catch(err){

        console.log('Error: '+err);

    }
}


InitializeConnection();


