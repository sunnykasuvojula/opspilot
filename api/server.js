import app from "./app.js"
import dotenv from "dotenv";

dotenv.config();

import connectDB from './config/db.config.js';

const PORT=process.env.PORT || 5000;

async function startServer() {
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`App is running on PORT ${PORT}`);
    })
}


startServer();
