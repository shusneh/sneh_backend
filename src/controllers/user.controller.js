import express from "express";
import { asyncHandler } from "../utils/asyncHandlers.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    const user= User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken, refreshToken}
}
//********My style of code for async handling *******
//  const registerUser = async (req, res) => {  
//         const {fullName,email,username,password}=await req.body; 
//             if([fullName,email,username,password].some((fields)=>fields?.trim()==="")){
//                 throw new ApiError(400,"All the fields are mandatory");
//     }

//    console.log(email);
//     } 

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    
    const {fullName,email,username,password}=req.body; 
    //console.log(req.body);

    if([fullName,email,username,password].some((fields)=>fields?.trim()==="")){
        // throw new Error("please enter every fields");
       throw new ApiError(400,"All the fields are mandatory");
    }

    const existed=await User.findOne({
        $or:[{username},{email}]
    })
    console.log(existed); 
    if(existed){
        throw new ApiError(409,"The given username or email already exists");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath= req.files?.coverImage?[0]?.path: "";
    //console.log(req.files);
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is needed");
    }
 
    const avatar = await uploadOnCloudinary(avatarLocalPath,"avatar");
    const coverImage = await uploadOnCloudinary(coverImageLocalPath,"cloudinary");

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"there some issue in the server! please try again")
    }

    return res.status(201).json(new ApiResponse(200,"*Registration Successful*",createdUser));

} )

const login=asyncHandler(async(req,res)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {username,email,password}=await req.body;

    if(!(username||email)){
        throw new ApiError(400,"please enter username or email");
    }

    const user = User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"user does not exist");
    }

    const isPasswordCorrect = user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401,"user credential error! : please enter correct password");
    }
    const {accessToken,refreshToken}=generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logout=asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {
            $unset:{refreshToken: 1 }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export {
    registerUser
}