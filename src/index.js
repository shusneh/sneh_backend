// require('dotenv').config({path:"./env"})

import dotenv from "dotenv"
import mongoose from 'mongoose'
import { DB_NAME } from './constants.js'
import express from 'express'
import connectDB from './db/index.js';
import {app} from './app.js'


dotenv.config({
    path:"./env"
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