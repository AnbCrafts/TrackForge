import mongoose from "mongoose";
import { DB_NAME } from "../Constants/Constant.js";

const connectDB = async () => {
  try {
    const url = process.env.MONGO_DB_URI;
    const db_name = DB_NAME;

    let connectionUrl = url;
    if (url.includes("?")) {
      const parts = url.split("?");
      connectionUrl = `${parts[0]}${db_name}?${parts[1]}`;
    } else {
      connectionUrl = `${url}/${db_name}`;
    }

    const connectionInstance = await mongoose.connect(connectionUrl);

    console.log("✅ Connected to DB SUCCESSFULLY!!");
    console.log(`🔗 Host: ${connectionInstance.connection.host}\n`);

    

    

  } catch (error) {
    console.error("❌ DB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
