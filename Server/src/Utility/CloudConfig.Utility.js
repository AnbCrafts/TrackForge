// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import Config from '../Config/Config.js';


cloudinary.config({
  cloud_name: Config.CLOUDINARY.CLOUD_NAME,
  api_key: Config.CLOUDINARY.CLOUD_API_KEY,
  api_secret: Config.CLOUDINARY.CLOUD_API_SECRET,
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
