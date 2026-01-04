import mongoose from "mongoose";

export default async function connectDB() 
{
    try{
        await mongoose.connect(process.env.MONGO_URI);
    }
    catch(e)
    {
        console.log("Mongodb conncetion failed");
        process.exit(1);
    }
}

