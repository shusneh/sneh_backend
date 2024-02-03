// require('dotenv').config({path:"./env"})

import dotenv from "dotenv"
import mongoose from 'mongoose'
import { DB_NAME } from './constants.js'
import express from 'express'
import connectDB from './db/index.js';

const app=express();

dotenv.config({
    path:"./env"
})


app.get("/",(req,res)=>{
    res.send("hi there develpment is on track it will come soon :-)")
})



connectDB()
.then(()=>{
    app.on("error",(error)=>{
    console.log("ERR: ",error);
    throw error;
    })

    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running on PORT : ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection error in /src/index.js : ",error);
})







// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error)=>{
//             console.log("ERR: ",error);
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`server is running fine on ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })()