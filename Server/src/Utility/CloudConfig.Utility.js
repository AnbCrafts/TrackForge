// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
 
const uploadOnCloudinary = async(localFilePath)=>{
  try {
    if(!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: 'auto'
    })
    console.log("File Uploaded successfully on cloudinary on : -> ",response.url);
    fs.unlinkSync(localFilePath) ;
    return response;


  } catch (error) {
      fs.unlinkSync(localFilePath) ;
      console.log("Error occurred while uploading: ", error)
      return null;

  }
  

}


export {uploadOnCloudinary};
