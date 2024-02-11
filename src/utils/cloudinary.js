import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async (localFilePath,name)=>{
    try {
        if(!localFilePath){
            console.log("please give some file path for ",name||"");
            return null;
        }
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
      console.log("file is uploaded on cloudinary ", response.url);
       fs.unlinkSync(localFilePath);
        return response;
    } catch (err) {
        fs.unlinkSync(localFilePath) ;
        console.log("!there is some problem in uploading files in cloudinary!",err);
        return null;
    }
}

const destroyOnCloudinary=async (public_id)=>{
    try {
        if(!public_id){
            console.log("please give some file path for ");
            return null;
        }
        const response=await cloudinary.uploader.destroy(public_id,{
            resource_type:"image"
        })
      console.log("file is deleted from cloudinary ");
       
        return response;
    } catch (err) {
        console.log("!there is some problem in deleting files from cloudinary!",err);
        return null;
    }
}



export {uploadOnCloudinary,destroyOnCloudinary}